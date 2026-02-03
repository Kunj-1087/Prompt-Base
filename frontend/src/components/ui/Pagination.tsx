import { Button } from './Button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    hasNext: boolean;
    hasPrev: boolean;
    limit?: number;
    onLimitChange?: (limit: number) => void;
}

export const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    hasNext, 
    hasPrev,
    limit,
    onLimitChange
}: PaginationProps) => {
    if (totalPages <= 0) return null;

    // Generate page numbers
    const getPageNumbers = () => {
        const pages = [];
        const delta = 2; // neighbor pages
        
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 || 
                i === totalPages || 
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                pages.push(i);
            } else if (
                i === currentPage - delta - 1 || 
                i === currentPage + delta + 1
            ) {
                pages.push(-1); // ellipsis
            }
        }
        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 border-t border-slate-800 pt-6">
            {/* Limit Selector */}
            {onLimitChange && limit ? (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span>Show</span>
                    <select 
                        value={limit}
                        onChange={(e) => onLimitChange(Number(e.target.value))}
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 focus:outline-none focus:border-indigo-500"
                    >
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                        <option value={48}>48</option>
                        <option value={100}>100</option>
                    </select>
                    <span>per page</span>
                </div>
            ) : <div />}

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(1)}
                    disabled={!hasPrev}
                    className="p-2 h-8 w-8 hidden sm:flex border-slate-700 text-slate-400 hover:text-white disabled:opacity-30"
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!hasPrev}
                    className="p-2 h-8 w-8 border-slate-700 text-slate-400 hover:text-white disabled:opacity-30"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                        page === -1 ? (
                            <span key={`ellipsis-${index}`} className="px-2 text-slate-600">...</span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                                    page === currentPage 
                                    ? 'bg-indigo-600 text-white' 
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                {page}
                            </button>
                        )
                    ))}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!hasNext}
                    className="p-2 h-8 w-8 border-slate-700 text-slate-400 hover:text-white disabled:opacity-30"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
                 <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(totalPages)}
                    disabled={!hasNext}
                    className="p-2 h-8 w-8 hidden sm:flex border-slate-700 text-slate-400 hover:text-white disabled:opacity-30"
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};
