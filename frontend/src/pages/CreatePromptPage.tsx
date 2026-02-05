import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { promptService } from '../services/promptService';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PromptForm, type PromptFormValues } from '../components/prompts/PromptForm';

export const CreatePromptPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: PromptFormValues) => {
        setIsLoading(true);
        try {
            const formattedData = {
                ...data,
                tags: data.tags ? data.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag !== '') : []
            };

            await promptService.createPrompt(formattedData);
            toast.success('Prompt created successfully');
            navigate('/prompts'); // Redirect to list
        } catch (error: any) {
             const message = error.response?.data?.message || 'Failed to create prompt';
             toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-2xl">
                <Button 
                    variant="ghost" 
                    className="mb-6 pl-0 text-slate-400 hover:text-white"
                    onClick={() => navigate('/prompts')}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <CardTitle className="text-2xl text-white">Create New Prompt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PromptForm onSubmit={onSubmit} isLoading={isLoading} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

