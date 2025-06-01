
import React, { useState } from 'react';
import { Plus, X, Eye, EyeOff, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Keyword } from '@/pages/Index';

interface KeywordManagerProps {
  keywords: Keyword[];
  onAddKeyword: (word: string, color: string) => void;
  onRemoveKeyword: (id: string) => void;
  highlightEnabled: boolean;
  onToggleHighlight: (enabled: boolean) => void;
}

const colors = [
  '#fbbf24', '#34d399', '#60a5fa', '#f87171', '#a78bfa', 
  '#fb7185', '#4ade80', '#38bdf8', '#fbbf24', '#818cf8'
];

export const KeywordManager: React.FC<KeywordManagerProps> = ({
  keywords,
  onAddKeyword,
  onRemoveKeyword,
  highlightEnabled,
  onToggleHighlight
}) => {
  const [newKeyword, setNewKeyword] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) {
      toast.error('Please enter a keyword');
      return;
    }

    if (keywords.some(k => k.word.toLowerCase() === newKeyword.toLowerCase())) {
      toast.error('Keyword already exists');
      return;
    }

    onAddKeyword(newKeyword.trim(), selectedColor);
    setNewKeyword('');
    setSelectedColor(colors[Math.floor(Math.random() * colors.length)]);
    toast.success(`Added keyword: ${newKeyword}`);
  };

  const handleRemoveKeyword = (id: string, word: string) => {
    onRemoveKeyword(id);
    toast.success(`Removed keyword: ${word}`);
  };

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

      <div className="space-y-3">
        <div className="space-y-3">
          <Input
            placeholder="Enter keyword..."
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Highlight Color</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                    selectedColor === color ? 'border-gray-800 ring-2 ring-gray-300' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <Button 
            onClick={handleAddKeyword}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Keyword
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Active Keywords</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {keywords.map((keyword) => (
            <div
              key={keyword.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:border-gray-300 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: keyword.color }}
                />
                <span className="font-medium text-gray-900">{keyword.word}</span>
                <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
                  {keyword.count}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveKeyword(keyword.id, keyword.word)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
