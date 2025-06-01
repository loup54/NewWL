
import React, { useState, useCallback } from 'react';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchControlsProps {
  onSearch: (query: string) => void;
  onNavigate: (direction: 'next' | 'prev') => void;
  onClear: () => void;
  currentMatch: number;
  totalMatches: number;
  isSearchActive: boolean;
}

export const SearchControls: React.FC<SearchControlsProps> = ({
  onSearch,
  onNavigate,
  onClear,
  currentMatch,
  totalMatches,
  isSearchActive
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  }, [onSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onNavigate('next');
    } else if (e.key === 'Escape') {
      setSearchQuery('');
      onClear();
    }
  }, [onNavigate, onClear]);

  const handleClear = useCallback(() => {
    setSearchQuery('');
    onClear();
  }, [onClear]);

  return (
    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search in document..."
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-8"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
      
      {isSearchActive && totalMatches > 0 && (
        <>
          <div className="text-sm text-gray-600 min-w-0">
            {currentMatch} of {totalMatches}
          </div>
          <div className="flex">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('prev')}
              disabled={totalMatches === 0}
              className="h-8 w-8 p-0"
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('next')}
              disabled={totalMatches === 0}
              className="h-8 w-8 p-0 ml-1"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
