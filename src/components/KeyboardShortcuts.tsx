
import React, { useEffect, useState } from 'react';
import { Keyboard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface ShortcutItem {
  key: string;
  description: string;
  action: () => void;
}

interface KeyboardShortcutsProps {
  onAddKeyword: () => void;
  onUploadDocument: () => void;
  onExport: () => void;
  onToggleHighlight: () => void;
}

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  onAddKeyword,
  onUploadDocument,
  onExport,
  onToggleHighlight
}) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const shortcuts: ShortcutItem[] = [
    { key: 'Ctrl+K', description: 'Add new keyword', action: onAddKeyword },
    { key: 'Ctrl+U', description: 'Upload document', action: onUploadDocument },
    { key: 'Ctrl+E', description: 'Export analysis', action: onExport },
    { key: 'Ctrl+H', description: 'Toggle highlighting', action: onToggleHighlight },
    { key: 'Ctrl+?', description: 'Show keyboard shortcuts', action: () => setIsHelpOpen(true) },
    { key: 'Escape', description: 'Close dialogs', action: () => setIsHelpOpen(false) }
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'k':
            event.preventDefault();
            onAddKeyword();
            break;
          case 'u':
            event.preventDefault();
            onUploadDocument();
            break;
          case 'e':
            event.preventDefault();
            onExport();
            break;
          case 'h':
            event.preventDefault();
            onToggleHighlight();
            break;
          case '/':
          case '?':
            event.preventDefault();
            setIsHelpOpen(true);
            break;
        }
      } else if (event.key === 'Escape') {
        setIsHelpOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAddKeyword, onUploadDocument, onExport, onToggleHighlight]);

  return (
    <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="fixed bottom-4 right-4 z-50 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
          title="Keyboard shortcuts (Ctrl+?)"
        >
          <Keyboard className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Keyboard className="w-5 h-5" />
            <span>Keyboard Shortcuts</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
              <span className="text-sm text-gray-700">{shortcut.description}</span>
              <Badge variant="outline" className="font-mono text-xs">
                {shortcut.key}
              </Badge>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500 mt-4 p-3 bg-blue-50 rounded-lg">
          💡 Tip: Use these shortcuts to work faster and more efficiently!
        </div>
      </DialogContent>
    </Dialog>
  );
};
