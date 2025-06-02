
import React, { useState, useCallback } from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Keyword } from '@/types';

interface KeywordFilterProps {
  keywords: Keyword[];
  onFilterChange: (filteredKeywords: Keyword[]) => void;
}

export const KeywordFilter: React.FC<KeywordFilterProps> = ({
  keywords,
  onFilterChange
}) => {
  const [minCount, setMinCount] = useState('');
  const [sortBy, setSortBy] = useState('count-desc');
  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = useCallback(() => {
    let filtered = [...keywords];

    // Filter by minimum count
    if (minCount && !isNaN(Number(minCount))) {
      filtered = filtered.filter(k => k.count >= Number(minCount));
    }

    // Sort keywords
    switch (sortBy) {
      case 'count-desc':
        filtered.sort((a, b) => b.count - a.count);
        break;
      case 'count-asc':
        filtered.sort((a, b) => a.count - b.count);
        break;
      case 'word-asc':
        filtered.sort((a, b) => a.word.localeCompare(b.word));
        break;
      case 'word-desc':
        filtered.sort((a, b) => b.word.localeCompare(a.word));
        break;
    }

    onFilterChange(filtered);
  }, [keywords, minCount, sortBy, onFilterChange]);

  React.useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleMinCountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMinCount(e.target.value);
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value);
  }, []);

  const clearFilters = useCallback(() => {
    setMinCount('');
    setSortBy('count-desc');
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter Keywords</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="h-8"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {showFilters && (
        <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600">Minimum Count</label>
            <Input
              type="number"
              placeholder="e.g., 5"
              value={minCount}
              onChange={handleMinCountChange}
              className="h-8"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600">Sort By</label>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="count-desc">Count (High to Low)</SelectItem>
                <SelectItem value="count-asc">Count (Low to High)</SelectItem>
                <SelectItem value="word-asc">Word (A to Z)</SelectItem>
                <SelectItem value="word-desc">Word (Z to A)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="w-full h-8"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};
