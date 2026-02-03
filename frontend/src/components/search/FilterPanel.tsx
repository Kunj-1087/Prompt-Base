import React from 'react';
import type { PromptFilters } from '../../services/promptService';
// import { Checkbox } from '../ui/Checkbox'; // Assuming we have these or use native
// import { Label } from '../ui/Label';

interface FilterPanelProps {
  filters: PromptFilters;
  facets: {
    status: { label: string; count: number }[];
    priority: { label: string; count: number }[];
    tags: { label: string; count: number }[];
  };
  onChange: (filters: PromptFilters) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, facets, onChange }) => {
  const handleCheckboxChange = (category: keyof PromptFilters, value: string) => {
    const currentValues = (filters[category] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
      
    onChange({
      ...filters,
      [category]: newValues
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Status</h3>
        <div className="space-y-2">
          {facets.status.map(facet => (
            <div key={facet.label} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`status-${facet.label}`}
                checked={filters.status?.includes(facet.label)}
                onChange={() => handleCheckboxChange('status', facet.label)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor={`status-${facet.label}`} className="text-sm text-gray-700 dark:text-gray-300 flex-1 flex justify-between">
                <span className="capitalize">{facet.label}</span>
                <span className="text-gray-400">({facet.count})</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Priority</h3>
        <div className="space-y-2">
          {facets.priority.map(facet => (
            <div key={facet.label} className="flex items-center space-x-2">
               <input
                type="checkbox"
                id={`priority-${facet.label}`}
                checked={filters.priority?.includes(facet.label)}
                onChange={() => handleCheckboxChange('priority', facet.label)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor={`priority-${facet.label}`} className="text-sm text-gray-700 dark:text-gray-300 flex-1 flex justify-between">
                <span className="capitalize">{facet.label}</span>
                <span className="text-gray-400">({facet.count})</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    
      <div>
        <h3 className="text-sm font-medium mb-3">Tags</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {facets.tags.map(facet => (
             <div key={facet.label} className="flex items-center space-x-2">
               <input
                type="checkbox"
                id={`tags-${facet.label}`}
                checked={filters.tags?.includes(facet.label)}
                onChange={() => handleCheckboxChange('tags', facet.label)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor={`tags-${facet.label}`} className="text-sm text-gray-700 dark:text-gray-300 flex-1 flex justify-between">
                <span>{facet.label}</span>
                <span className="text-gray-400">({facet.count})</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
