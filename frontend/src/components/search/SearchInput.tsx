import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { useDebounce } from '../../hooks/useDebounce'; // Need to create this or use simple implementation

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, onSearch }) => {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, 500);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (debouncedValue !== value) {
        onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="w-full">
      <Input
        type="search"
        placeholder="Search prompts..."
        value={localValue}
        onChange={handleChange}
        className="w-full"
      />
    </div>
  );
};
