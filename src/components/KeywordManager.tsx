
import React, { useState, useCallback, useMemo, forwardRef } from 'react';
import { Plus, X, Eye, EyeOff, Palette, Lightbulb, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Keyword } from '@/pages/Index';
import { getKeywordSuggestions, keywordCategories } from '@/utils/keywordSuggestions';
import { EnhancedExportOptions } from './EnhancedExportOptions';

interface KeywordManagerProps {
  keywords: Keyword[];
  onAddKeyword: (word: string, color: string) => void;
  onRemoveKeyword: (id: string) => void;
  highlightEnabled: boolean;
  onToggleHighlight: (enabled: boolean) => void;
  caseSensitive: boolean;
  onToggleCaseSensitive: (enabled: boolean) => void;
  documentContent?: string;
  document?: any;
  keywordCounts?: Record<string, number>;
  documentStats?: {
    totalWords: number;
    totalCharacters: number;
    avgWordsPerSentence: number;
    readingTime: number;
  };
}

const colors = [
  '#fbbf24', '#34d399', '#60a5fa', '#f87171', '#a78bfa', 
  '#fb7185', '#4ade80', '#38bdf8', '#fcd34d', '#818cf8'
];

export const KeywordManager = forwardRef<HTMLInputElement, KeywordManagerProps>(({
  keywords,
  onAddKeyword,
  onRemoveKeyword,
  highlightEnabled,
  onToggleHighlight,
  caseSensitive,
  onToggleCaseSensitive,
  documentContent = '',
  document,
  keywordCounts = {},
  documentStats
}, ref) => {
  const [newKeyword, setNewKeyword] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Get keyword suggestions based on document content
  const suggestions = useMemo(() => {
    if (!documentContent || !showSuggestions) return [];
    return getKeywordSuggestions(documentContent).filter(
      suggestion => !keywords.some(k => k.word.toLowerCase() === suggestion.toLowerCase())
    );
  }, [documentContent, keywords, showSuggestions]);

  // Memoize keywords array to prevent unnecessary re-renders
  const memoizedKeywords = useMemo(() => keywords, [keywords]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewKeyword(value);
  }, []);

  const handleAddKeyword = useCallback(() => {
    const trimmedKeyword = newKeyword.trim();
    
    if (!trimmedKeyword) {
      toast.error('Please enter a keyword');
      return;
    }

    // Check for duplicates safely
    const isDuplicate = memoizedKeywords.some(k => 
      k?.word?.toLowerCase() === trimmedKeyword.toLowerCase()
    );

    if (isDuplicate) {
      toast.error('Keyword already exists');
      return;
    }

    try {
      onAddKeyword(trimmedKeyword, selectedColor);
      setNewKeyword('');
      // Use a safe random color selection
      const randomIndex = Math.floor(Math.random() * colors.length);
      setSelectedColor(colors[randomIndex] || colors[0]);
      toast.success(`Added keyword: ${trimmedKeyword}`);
    } catch (error) {
      console.error('Error adding keyword:', error);
      toast.error('Failed to add keyword');
    }
  }, [newKeyword, selectedColor, memoizedKeywords, onAddKeyword]);

  const handleRemoveKeyword = useCallback((id: string, word: string) => {
    try {
      onRemoveKeyword(id);
      toast.success(`Removed keyword: ${word}`);
    } catch (error) {
      console.error('Error removing keyword:', error);
      toast.error('Failed to remove keyword');
    }
  }, [onRemoveKeyword]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  }, [handleAddKeyword]);

  const handleColorSelect = useCallback((color: string) => {
    setSelectedColor(color);
  }, []);

  const handleToggleHighlight = useCallback((enabled: boolean) => {
    try {
      onToggleHighlight(enabled);
    } catch (error) {
      console.error('Error toggling highlight:', error);
    }
  }, [onToggleHighlight]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setNewKeyword(suggestion);
    const randomIndex = Math.floor(Math.random() * colors.length);
    setSelectedColor(colors[randomIndex] || colors[0]);
  }, []);

  const handleCategorySelect = useCallback((categoryKey: string) => {
    if (!categoryKey) return;
    
    const category = keywordCategories[categoryKey as keyof typeof keywordCategories];
    if (!category) return;
    
    category.keywords.forEach(keyword => {
      const isDuplicate = keywords.some(k => 
        k?.word?.toLowerCase() === keyword.toLowerCase()
      );
      
      if (!isDuplicate) {
        const randomIndex = Math.floor(Math.random() * colors.length);
        onAddKeyword(keyword, colors[randomIndex] || colors[0]);
      }
    });
    
    setSelectedCategory('');
    toast.success(`Added ${category.name} keywords`);
  }, [keywords, onAddKeyword]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Keywords</h3>
        <div className="flex items-center space-x-2">
          {highlightEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          <Switch
            checked={highlightEnabled}
            onCheckedChange={onToggleHighlight}
          />
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Case Sensitive</span>
          </div>
          <Switch
            checked={caseSensitive}
            onCheckedChange={onToggleCaseSensitive}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Tag className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Quick Add</span>
        </div>
        
        <Select value={selectedCategory} onValueChange={handleCategorySelect}>
          <SelectTrigger>
            <SelectValue placeholder="Add keyword category..." />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(keywordCategories).map(([key, category]) => (
              <SelectItem key={key} value={key}>
                {category.name} ({category.keywords.length} keywords)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {documentContent && (
          <Button
            variant="outline"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="w-full"
            type="button"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            {showSuggestions ? 'Hide' : 'Show'} Suggestions
          </Button>
        )}
      </div>

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-700">Suggested Keywords</span>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={`suggestion-${index}`}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs"
                type="button"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="space-y-3">
          <Input
            placeholder="Enter keyword..."
            value={newKeyword}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            autoComplete="off"
            ref={ref}
          />
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Highlight Color</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {colors.map((color, index) => (
                <button
                  key={`color-${index}-${color}`}
                  onClick={() => handleColorSelect(color)}
                  className={`w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                    selectedColor === color ? 'border-gray-800 ring-2 ring-gray-300' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  type="button"
                />
              ))}
            </div>
          </div>

          <Button 
            onClick={handleAddKeyword}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            type="button"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Keyword
          </Button>
        </div>
      </div>

      {/* Enhanced Export Section */}
      {keywords.length > 0 && document && (
        <EnhancedExportOptions
          keywords={keywords}
          document={document}
          keywordCounts={keywordCounts}
          documentStats={documentStats}
        />
      )}

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Active Keywords</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {memoizedKeywords.map((keyword) => {
            // Safety check to prevent crashes
            if (!keyword || !keyword.id) return null;
            
            return (
              <div
                key={keyword.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:border-gray-300 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: keyword.color || '#gray' }}
                  />
                  <span className="font-medium text-gray-900">{keyword.word || 'Unknown'}</span>
                  <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
                    {keyword.count || 0}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveKeyword(keyword.id, keyword.word || 'Unknown')}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

KeywordManager.displayName = 'KeywordManager';
