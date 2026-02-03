import { useNavigate } from 'react-router-dom';
import type { IPrompt } from '../../services/promptService';
import { Calendar, Tag } from 'lucide-react';
import { HighlightText } from '../ui/HighlightText';

// Simple Badge Helper
const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
        draft: 'bg-slate-700 text-slate-300',
        active: 'bg-green-500/10 text-green-400 border-green-500/20',
        completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        archived: 'bg-slate-800 text-slate-500 border-slate-700'
    };
    
    return (
        <span className={`px-2 py-1 rounded text-xs font-medium border ${colors[status] || colors.draft} uppercase tracking-wider`}>
            {status}
        </span>
    );
};

interface PromptCardProps {
    prompt: IPrompt;
    highlightTerm?: string;
}

export const PromptCard = ({ prompt, highlightTerm = '' }: PromptCardProps) => {
    const navigate = useNavigate();

    return (
        <div 
            onClick={() => navigate(`/prompts/${prompt._id}`)}
            className="group relative bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all cursor-pointer flex flex-col h-full"
        >
            <div className="flex justify-between items-start mb-3">
                <StatusBadge status={prompt.status} />
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                    prompt.priority === 'high' ? 'bg-red-500/10 text-red-400' : 
                    prompt.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-slate-800 text-slate-400'
                }`}>
                    {prompt.priority}
                </span>
            </div>

            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                <HighlightText text={prompt.title} highlight={highlightTerm} />
            </h3>
            
            <p className="text-slate-400 text-sm mb-4 line-clamp-3 flex-1">
                <HighlightText text={prompt.description || ''} highlight={highlightTerm} />
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 mt-auto pt-4 border-t border-slate-800">
                <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(prompt.createdAt).toLocaleDateString()}</span>
                </div>
                {prompt.tags.length > 0 && (
                    <div className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>{prompt.tags.length} tags</span>
                    </div>
                )}
            </div>
        </div>
    );
};
