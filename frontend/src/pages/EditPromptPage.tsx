import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { promptService } from '../services/promptService';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PromptForm, type PromptFormValues } from '../components/prompts/PromptForm';

export const EditPromptPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [initialValues, setInitialValues] = useState<Partial<PromptFormValues>>({});
    const [isDirty, setIsDirty] = useState(false);

    // Fetch existing data
    useEffect(() => {
        const fetchPrompt = async () => {
            if (!id) return;
            try {
                const data = await promptService.getPromptById(id);
                setInitialValues({
                    title: data.title,
                    description: data.description,
                    status: data.status,
                    priority: data.priority,
                    tags: data.tags.join(', ')
                });
            } catch (error) {
                toast.error('Failed to load prompt');
                navigate('/prompts');
            } finally {
                setIsFetching(false);
            }
        };
        fetchPrompt();
    }, [id, navigate]);

    // Unsaved changes warning
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    const onSubmit = async (data: PromptFormValues) => {
        if (!id) return;
        setIsLoading(true);
        try {
            const formattedData = {
                ...data,
                tags: data.tags ? data.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag !== '') : []
            };

            await promptService.updatePrompt(id, formattedData);
            toast.success('Prompt updated successfully');
            setIsDirty(false); // Reset dirty so no warning on nav
            navigate(`/prompts/${id}`); // Redirect to detail
        } catch (error: any) {
             const message = error.response?.data?.message || 'Failed to update prompt';
             toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="min-h-screen bg-slate-950 pt-24 px-4 flex justify-center">
                <div className="text-indigo-400 animate-pulse">Loading prompt data...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-2xl">
                <Button 
                    variant="ghost" 
                    className="mb-6 pl-0 text-slate-400 hover:text-white"
                    onClick={() => {
                        if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to leave?')) return;
                        navigate(`/prompts/${id}`);
                    }}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Detail
                </Button>

                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <CardTitle className="text-2xl text-white">Edit Prompt</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <PromptForm 
                            initialValues={initialValues} 
                            onSubmit={onSubmit} 
                            isLoading={isLoading} 
                            isEdit={true}
                            onDirtyChange={setIsDirty}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
