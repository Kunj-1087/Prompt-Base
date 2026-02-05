import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchPromptsAdvanced, type PromptFilters, type SearchResults } from '../services/promptService';
import { SearchInput } from '../components/search/SearchInput';
import { FilterPanel } from '../components/search/FilterPanel';
import { PromptCard } from '../components/prompts/PromptCard';
import { Button } from '../components/ui/Button'; // Changed to lowercase

export const AdvancedSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<PromptFilters>({
    status: searchParams.get('filter[status]')?.split(',') || [],
    priority: searchParams.get('filter[priority]')?.split(',') || [],
    tags: searchParams.get('filter[tags]')?.split(',') || [],
  });
  
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const fetchResults = async (q: string, f: PromptFilters) => {
    try {
      setIsSearching(true);
      const data = await searchPromptsAdvanced(q, f);
      // @ts-ignore
      setResults(data); 
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    // Initial search if params exist
    if (query) {
        fetchResults(query, filters);
    }
  }, []);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    updateParams(newQuery, filters);
    fetchResults(newQuery, filters);
  };

  const handleFilterChange = (newFilters: PromptFilters) => {
    setFilters(newFilters);
    updateParams(query, newFilters);
    fetchResults(query, newFilters);
  };

  const updateParams = (q: string, f: PromptFilters) => {
    const params: any = {};
    if (q) params.q = q;
    if (f.status?.length) params['filter[status]'] = f.status.join(',');
    if (f.priority?.length) params['filter[priority]'] = f.priority.join(',');
    if (f.tags?.length) params['filter[tags]'] = f.tags.join(',');
    setSearchParams(params);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Advanced Search</h1>
        <SearchInput value={query} onChange={setQuery} onSearch={handleSearch} />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
           {/* Only show filters if we have facets or if filters are active */}
           {(results?.meta?.facets || query) && (
               <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                   <h2 className="font-semibold mb-4">Filters</h2>
                   {results?.meta?.facets && (
                       <FilterPanel 
                           filters={filters} 
                           facets={results.meta.facets} 
                           onChange={handleFilterChange} 
                       />
                   )}
                   <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                            const cleared = { status: [], priority: [], tags: [] };
                            setFilters(cleared);
                            updateParams(query, cleared);
                            fetchResults(query, cleared);
                        }}
                    >
                        Clear Filters
                    </Button>
                   </div>
               </div>
           )}
        </aside>

        <main className="flex-1">
          {isSearching ? (
             <div className="text-center py-12">Loading...</div>
          ) : results?.data?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.data.map((prompt: any) => (
                <PromptCard key={prompt._id} prompt={prompt} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              {query ? 'No results found.' : 'Start typing to search...'}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
