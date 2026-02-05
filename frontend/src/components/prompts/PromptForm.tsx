import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save } from 'lucide-react';
import { Button } from '../ui/Button';
// import { FileUpload } from '../ui/FileUpload';

const promptSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title cannot exceed 200 characters'),
  description: z.string().max(5000, 'Description cannot exceed 5000 characters').optional(),
  status: z.enum(['draft', 'active', 'completed', 'archived']),
  priority: z.enum(['low', 'medium', 'high']),
  tags: z.string().optional(),
});

export type PromptFormValues = z.infer<typeof promptSchema>;

interface PromptFormProps {
    initialValues?: Partial<PromptFormValues>;
    onSubmit: (data: PromptFormValues) => Promise<void>;
    isLoading: boolean;
    isEdit?: boolean;
    onDirtyChange?: (isDirty: boolean) => void;
}

export const PromptForm = ({ initialValues, onSubmit, isLoading, isEdit = false, onDirtyChange }: PromptFormProps) => {
    const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<PromptFormValues>({
        resolver: zodResolver(promptSchema),
        defaultValues: {
            title: '',
            description: '',
            status: 'draft',
            priority: 'medium',
            tags: '',
            ...initialValues
        }
    });

    // Notify parent about dirty state
    useEffect(() => {
        if (onDirtyChange) onDirtyChange(isDirty);
    }, [isDirty, onDirtyChange]);

    // Update form if initialValues change (e.g. data loaded)
    useEffect(() => {
        if (initialValues) {
             reset({
                title: '',
                description: '',
                status: 'draft',
                priority: 'medium',
                tags: '',
                ...initialValues
             });
        }
    }, [initialValues, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Title */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Title</label>
                <input
                    {...register('title')}
                    className="w-full rounded-md border border-slate-700 bg-slate-800 p-2.5 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. Creative Writing Prompt"
                />
                {errors.title && <p className="text-sm text-red-400">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Description</label>
                <textarea
                    {...register('description')}
                    rows={6}
                    className="w-full rounded-md border border-slate-700 bg-slate-800 p-2.5 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Enter prompt content..."
                />
                {errors.description && <p className="text-sm text-red-400">{errors.description.message}</p>}
            </div>


            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Status */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">Status</label>
                    <select
                        {...register('status')}
                        className="w-full rounded-md border border-slate-700 bg-slate-800 p-2.5 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                    </select>
                    {errors.status && <p className="text-sm text-red-400">{errors.status.message}</p>}
                </div>

                {/* Priority */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">Priority</label>
                    <select
                        {...register('priority')}
                        className="w-full rounded-md border border-slate-700 bg-slate-800 p-2.5 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    {errors.priority && <p className="text-sm text-red-400">{errors.priority.message}</p>}
                </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Tags (comma separated)</label>
                <input
                    {...register('tags')}
                    className="w-full rounded-md border border-slate-700 bg-slate-800 p-2.5 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="coding, writing, ideas"
                />
                {errors.tags && <p className="text-sm text-red-400">{errors.tags.message}</p>}
            </div>

            <div className="flex justify-end gap-4 pt-4">
                 {/* Buttons are usually controlled by parent if need specific cancel logic, but we can emit submit */}
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="min-w-[120px] bg-indigo-600 hover:bg-indigo-700"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {isEdit ? 'Updating...' : 'Saving...'}
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            {isEdit ? 'Update Prompt' : 'Create Prompt'}
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
};
