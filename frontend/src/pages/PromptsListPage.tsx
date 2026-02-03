import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { promptService, type IPrompt, type PaginationMeta } from '../services/promptService';
import { PromptCard } from '../components/prompts/PromptCard';
import { Pagination } from '../components/ui/Pagination';
import { Button } from '../components/ui/Button';
import { Plus, Search, Filter, RefreshCw, X, History } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { HighlightText } from '../components/ui/HighlightText';

export const PromptsListPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Read params
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const status = searchParams.get('status') || '';
    const priority = searchParams.get('priority') || '';
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    const initialSearch = searchParams.get('search') || '';

    // Local State
    const [prompts, setPrompts] = useState<IPrompt[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    
    // Debounce Search
    const debouncedSearch = useDebounce(searchTerm, 300);

    // Recent Searches
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [showRecent, setShowRecent] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('recent_searches');
        if (stored) setRecentSearches(JSON.parse(stored));
    }, []);

    // Fetch Suggestions when debouncedSearch changes
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (debouncedSearch && debouncedSearch.length >= 2) {
                try {
                    const res = await promptService.getSuggestions(debouncedSearch);
                    setSuggestions(res.data);
                } catch (err) {
                    console.error('Err fetching suggestions', err);
                }
            } else {
                setSuggestions([]);
            }
        };
        fetchSuggestions();
    }, [debouncedSearch]);

    const addToRecent = (term: string) => {
        if (!term || term.length < 2) return;
        const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recent_searches', JSON.stringify(updated));
    };

    // Update URL when debounced value changes
    useEffect(() => {
        if (debouncedSearch !== initialSearch) {
             updateParams({ search: debouncedSearch, page: 1 });
        }
    }, [debouncedSearch, initialSearch]);

    // Update URL helper
    const updateParams = (newParams: Record<string, string | number | undefined>) => {
        const current = Object.fromEntries(searchParams.entries());
        const merged = { ...current, ...newParams };
        Object.keys(merged).forEach(key => {
            if (merged[key] === undefined || merged[key] === '') delete merged[key];
        });
        setSearchParams(merged as Record<string, string>);
    };

    // Fetch Prompts
    const fetchPrompts = async () => {
        setIsLoading(true);
        try {
            let res;
            if (initialSearch && initialSearch.length >= 2) { // Use initialSearch from URL for fetching
                // Use Full Text Search
                res = await promptService.searchPrompts({ 
                    q: initialSearch, 
                    page, 
                    limit,
                    status: status || undefined,
                    priority: priority || undefined,
                    sort,
                    order
                });
                addToRecent(initialSearch);
            } else {
                // Standard Filter
                res = await promptService.getPrompts({ 
                    page, 
                    limit, 
                    search: undefined, // Don't send regex search if empty
                    status: status || undefined,
                    priority: priority || undefined,
                    sort,
                    order
                });
            }
            
            setPrompts(res.data);
            setMeta(res.pagination);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Fetch when URL params change (which includes when debounce updates URL)
        fetchPrompts();
    }, [page, limit, status, priority, sort, order, initialSearch]); 

    // Sync input if URL changes externally (e.g. back button)
    useEffect(() => {
        setSearchTerm(initialSearch);
    }, [initialSearch]);

    const clearFilters = () => {
        // Clear all filters but keep search? Or clear everything?
        // User request: "Clear filters button" usually implies clearing categorical filters
        updateParams({ status: '', priority: '', sort: 'createdAt', order: 'desc', page: 1 });
    };

    const hasActiveFilters = status !== '' || priority !== '';

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-950 px-4" onClick={() => setShowRecent(false)}>
            <div className="container mx-auto">
                {/* Header & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">My Prompts</h1>
                        <p className="text-slate-400">Manage and organize your collection.</p>
                    </div>
                    <Button 
                        onClick={() => navigate('/prompts/new')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Prompt
                    </Button>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col gap-4 mb-8">
                   <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative z-10">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLoading ? 'text-indigo-500 animate-pulse' : 'text-slate-500'}`} />
                        <input 
                            type="text" 
                            placeholder="Search prompts..." 
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-10 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setShowRecent(true)}
                            onClick={(e) => e.stopPropagation()}
                        />
                         {searchTerm && (
                            <button 
                                onClick={() => {
                                    setSearchTerm('');
                                    updateParams({ search: '', page: 1 });
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                        
                        {/* Search Dropdown */}
                        {showRecent && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-20">
                                {/* Recent Searches */}
                                {recentSearches.length > 0 && !searchTerm && (
                                    <>
                                        <div className="p-2 text-xs text-slate-500 uppercase font-semibold tracking-wider flex items-center gap-2">
                                            <History className="w-3 h-3" /> Recent Searches
                                        </div>
                                        {recentSearches.map(term => (
                                            <button
                                                key={term}
                                                className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center justify-between group"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSearchTerm(term);
                                                    updateParams({ search: term, page: 1 });
                                                    setShowRecent(false);
                                                }}
                                            >
                                                <span>{term}</span>
                                            </button>
                                        ))}
                                    </>
                                )}
                                
                                {/* Autocomplete Suggestions */}
                                {suggestions.length > 0 && searchTerm && (
                                    <>
                                        <div className="p-2 text-xs text-slate-500 uppercase font-semibold tracking-wider flex items-center gap-2 border-t border-slate-800">
                                            <Search className="w-3 h-3" /> Suggestions
                                        </div>
                                        {suggestions.map(term => (
                                            <button
                                                key={term}
                                                className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center justify-between group"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSearchTerm(term);
                                                    updateParams({ search: term, page: 1 });
                                                    setShowRecent(false);
                                                }}
                                            >
                                                <span><HighlightText text={term} highlight={searchTerm} /></span>
                                            </button>
                                        ))}
                                    </>
                                )}

                                {/* Fallback if nothing */}
                                {searchTerm && suggestions.length === 0 && (
                                    <div className="p-4 text-center text-slate-500 text-sm">
                                        No suggestions found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                        {/* Sort Controls */}
                        <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-1">
                            <select 
                                className="bg-transparent text-slate-300 text-sm focus:outline-none px-2"
                                value={sort}
                                onChange={(e) => updateParams({ sort: e.target.value, page: 1 })}
                            >
                                <option value="createdAt">Date Created</option>
                                <option value="updatedAt">Date Updated</option>
                                <option value="title">Title</option>
                                <option value="priority">Priority</option>
                                <option value="status">Status</option>
                            </select>
                            <button
                                onClick={() => updateParams({ order: order === 'asc' ? 'desc' : 'asc' })} 
                                className="px-2 text-slate-400 hover:text-white border-l border-slate-700"
                            >
                                {order === 'asc' ? '↑' : '↓'}
                            </button>
                        </div>

                        <div className="w-px h-8 bg-slate-800 mx-1 hidden md:block" />

                        <select 
                            className={`bg-slate-900 border ${status ? 'border-indigo-500 text-indigo-400' : 'border-slate-700 text-slate-300'} rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500`}
                            value={status}
                            onChange={(e) => updateParams({ status: e.target.value, page: 1 })}
                        >
                            <option value="">All Status</option>
                            <option value="draft">Draft</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="archived">Archived</option>
                        </select>

                        <select 
                            className={`bg-slate-900 border ${priority ? 'border-indigo-500 text-indigo-400' : 'border-slate-700 text-slate-300'} rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500`}
                            value={priority}
                            onChange={(e) => updateParams({ priority: e.target.value, page: 1 })}
                        >
                            <option value="">All Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        
                        {hasActiveFilters && (
                             <Button variant="ghost" className="text-slate-400 hover:text-white px-2" onClick={clearFilters}>
                                <X className="w-4 h-4 mr-1" /> Clear
                            </Button>
                        )}

                        <Button variant="outline" className="border-slate-700 text-slate-400 hover:text-white" onClick={() => fetchPrompts()}>
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                   </div>
                </div>

                {/* Info Bar */}
                {meta && (
                    <div className="mb-4 text-sm text-slate-400">
                        Found {meta.total} result{meta.total !== 1 ? 's' : ''}
                        {initialSearch && ` for "${initialSearch}"`}
                    </div>
                )}

                {/* Content */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(limit)].map((_, i) => (
                            <div key={i} className="bg-slate-900/30 border border-slate-800 h-64 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : prompts.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/20 border border-slate-800 rounded-xl border-dashed">
                        <div className="inline-flex p-4 rounded-full bg-slate-800 mb-4 text-slate-400">
                            <Filter className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">No prompts found</h3>
                        <p className="text-slate-400 mb-6">Try adjusting your filters or create a new prompt.</p>
                        <Button onClick={() => navigate('/prompts/new')} variant="secondary">
                            Create First Prompt
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {prompts.map(prompt => (
                                <PromptCard 
                                    key={prompt._id} 
                                    prompt={prompt} 
                                    highlightTerm={debouncedSearch}
                                />
                            ))}
                        </div>

                        {meta && (
                            <Pagination 
                                currentPage={meta.page}
                                totalPages={meta.totalPages}
                                onPageChange={(p) => updateParams({ page: p })}
                                hasNext={meta.hasNext}
                                hasPrev={meta.hasPrev}
                                limit={limit}
                                onLimitChange={(l) => updateParams({ limit: l, page: 1 })}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
