
import React, { useState } from 'react';
import { Plus, X, Palette, Eye, EyeOff } from 'lucide-react';
import { TouchOptimizedButton } from '@/components/TouchOptimizedButton';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Keyword } from '@/pages/Index';
import { toast } from 'sonner';

interface MobileKeywordManagerProps {
  keywords: Keyword[];
  onAddKeyword: (word: string, color: string) => void;
  onRemoveKeyword: (id: string) => void;
  highlightEnabled: boolean;
  onToggleHighlight: (enabled: boolean) => void;
  caseSensitive: boolean;
  onToggleCaseSensitive: (enabled: boolean) => void;
}

const PREDEFINED_COLORS = [
  '#fbbf24', '#34d399', '#60a5fa', '#f87171', '#a78bfa', 
  '#fbbf24', '#fb7185', '#4ade80', '#22d3ee', '#a855f7'
];

export const MobileKeywordManager: React.FC<MobileKeywordManagerProps> = ({
  keywords,
  onAddKeyword,
  onRemoveKeyword,
  highlightEnabled,
  onToggleHighlight,
  caseSensitive,
  onToggleCaseSensitive
}) => {
  const [newKeyword, setNewKeyword] = useState('');
  const [selectedColor, setSelectedColor] = useState(PREDEFINED_COLORS[0]);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) {
      toast.error('Please enter a keyword');
      return;
    }

    onAddKeyword(newKeyword.trim(), selectedColor);
    setNewKeyword('');
    setSelectedColor(PREDEFINED_COLORS[0]);
    setShowAddForm(false);
  };

  return (
    <Card className="p-4 bg-white/90 backdrop-blur-sm">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Keywords</h3>
        <div className="flex items-center space-x-2">
          <Switch
            checked={highlightEnabled}
            onCheckedChange={onToggleHighlight}
            className="scale-110"
          />
          <span className="text-sm text-gray-600">
            {highlightEnabled ? 'On' : 'Off'}
          </span>
        </div>
      </div>

      {/* Settings */}
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
        <span className="text-sm text-gray-700">Case Sensitive</span>
        <Switch
          checked={caseSensitive}
          onCheckedChange={onToggleCaseSensitive}
          className="scale-110"
        />
      </div>

      {/* Keywords List */}
      <div className="space-y-2 mb-4">
        {keywords.map((keyword) => (
          <div
            key={keyword.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div
                className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                style={{ backgroundColor: keyword.color }}
              />
              <span className="font-medium text-gray-900 truncate">
                {keyword.word}
              </span>
              <Badge variant="secondary" className="ml-auto">
                {keyword.count}
              </Badge>
            </div>
            <TouchOptimizedButton
              variant="ghost"
              size="sm"
              touchTarget="small"
              onClick={() => onRemoveKeyword(keyword.id)}
              className="text-red-500 hover:text-red-700 ml-2"
            >
              <X className="w-4 h-4" />
            </TouchOptimizedButton>
          </div>
        ))}
      </div>

      {/* Add Keyword */}
      {!showAddForm ? (
        <TouchOptimizedButton
          onClick={() => setShowAddForm(true)}
          className="w-full"
          touchTarget="medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Keyword
        </TouchOptimizedButton>
      ) : (
        <div className="space-y-3 p-3 bg-blue-50 rounded-lg">
          <Input
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="Enter keyword..."
            className="text-base"
            autoFocus
          />
          
          <div className="grid grid-cols-5 gap-2">
            {PREDEFINED_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-10 rounded-full border-2 transition-all touch-manipulation ${
                  selectedColor === color ? 'border-gray-900 scale-110' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <div className="flex space-x-2">
            <TouchOptimizedButton
              onClick={handleAddKeyword}
              className="flex-1"
              touchTarget="medium"
            >
              Add
            </TouchOptimizedButton>
            <TouchOptimizedButton
              onClick={() => setShowAddForm(false)}
              variant="outline"
              className="flex-1"
              touchTarget="medium"
            >
              Cancel
            </TouchOptimizedButton>
          </div>
        </div>
      )}
    </Card>
  );
};
