import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { promptService, type IPrompt } from '../services/promptService';
import { Button } from '../components/ui/Button';
import { DeleteConfirmModal } from '../components/ui/DeleteConfirmModal';
import { ArrowLeft, Edit, Trash2, Calendar, Tag, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const PromptDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState<IPrompt | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchPrompt = async () => {
            if (!id) return;
            try {
                const data = await promptService.getPromptById(id);
                setPrompt(data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load prompt');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPrompt();
    }, [id]);

    const handleRestore = async (promptId: string) => {
         const toastId = toast.loading('Restoring prompt...');
         try {
             await promptService.restorePrompt(promptId);
             toast.success('Prompt restored!', { id: toastId });
             // We could reload data, or just assume success if we navigated away. 
             // If we are still on page (unlikely if we redirected), we should reload.
             // But since we redirected to List, this toast happens on List page.
             // Actually, if we restore, we might want to navigate back to detail?
             // Simple UX: Just restore. User is on list page, they will see it appear if they refresh or if we had real-time list.
             // Better: Navigate back to detail? No, "Undo" is quick fix. 
         } catch (err) {
             toast.error('Failed to restore', { id: toastId });
         }
    };

    const confirmDelete = async () => {
        if (!id) return;
        setIsDeleting(true);
        try {
            await promptService.deletePrompt(id);
            setIsDeleteModalOpen(false);
            
            // Undo Toast
            toast((t) => (
                <div className="flex items-center gap-2">
                    <span>Prompt deleted</span>
                    <button 
                        onClick={() => {
                            toast.dismiss(t.id);
                            handleRestore(id);
                        }}
                        className="bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-xs text-white border border-slate-500"
                    >
                        Undo
                    </button>
                </div>
            ), { duration: 5000 });

            navigate('/prompts');
        } catch (err: any) {
             toast.error(err.response?.data?.message || 'Failed to delete');
             setIsDeleting(false); // Only stop loading if failed, otherwise we redirect
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 pt-24 px-4 flex justify-center">
                <div className="text-indigo-400 animate-pulse">Loading details...</div>
            </div>
        );
    }

    if (error || !prompt) {
        return (
            <div className="min-h-screen bg-slate-950 pt-24 px-4">
                <div className="container mx-auto max-w-3xl">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
                        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">Error Loading Prompt</h2>
                        <p className="text-red-400 mb-6">{error || 'Prompt not found'}</p>
                        <Button variant="outline" onClick={() => navigate('/prompts')}>
                            Back to List
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-8">
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate('/prompts')}
                        className="pl-0 text-slate-400 hover:text-white"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Prompts
                    </Button>

                    <div className="flex gap-3">
                        <Button 
                            variant="outline" 
                            className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
                            onClick={() => navigate(`/prompts/${id}/edit`)}
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                        <Button 
                            variant="outline" 
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                            onClick={() => setIsDeleteModalOpen(true)}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-8 shadow-xl">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                         <span className={`px-3 py-1 rounded-full text-sm font-medium border uppercase tracking-wider ${
                            prompt.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            prompt.status === 'draft' ? 'bg-slate-700 text-slate-300' : 
                            'bg-blue-500/10 text-blue-400 border-blue-500/20'
                         }`}>
                            {prompt.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border uppercase tracking-wider ${
                             prompt.priority === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                             prompt.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                             'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                            {prompt.priority} Priority
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                        {prompt.title}
                    </h1>

                    <div className="prose prose-invert max-w-none text-slate-300 mb-8 whitespace-pre-wrap">
                        {prompt.description || 'No description provided.'}
                    </div>

                    <div className="border-t border-slate-800 pt-6 flex flex-wrap gap-6 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                             <Tag className="w-4 h-4" />
                             <div className="flex gap-2">
                                 {prompt.tags.map(tag => (
                                     <span key={tag} className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded">#{tag}</span>
                                 ))}
                             </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Created {new Date(prompt.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title={prompt.title}
                isDeleting={isDeleting}
            />
        </div>
    );
};

