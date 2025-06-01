
import React, { useState, useEffect } from 'react';
import { DocumentVersionManager, DocumentVersion, VersionedDocument } from '@/utils/documentVersioning';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { History, Clock, User, FileText, GitBranch, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface DocumentVersionHistoryProps {
  documentId: string | null;
  onVersionSelect: (version: DocumentVersion) => void;
  onClose: () => void;
}

export const DocumentVersionHistory: React.FC<DocumentVersionHistoryProps> = ({
  documentId,
  onVersionSelect,
  onClose
}) => {
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareVersions, setCompareVersions] = useState<DocumentVersion[]>([]);

  const versionManager = DocumentVersionManager.getInstance();

  useEffect(() => {
    if (documentId) {
      const documentVersions = versionManager.getAllVersions(documentId);
      setVersions(documentVersions);
      if (documentVersions.length > 0) {
        setSelectedVersion(documentVersions[0]);
      }
    }
  }, [documentId]);

  const handleVersionSelect = (version: DocumentVersion) => {
    if (compareMode) {
      if (compareVersions.length < 2 && !compareVersions.includes(version)) {
        setCompareVersions([...compareVersions, version]);
      }
    } else {
      setSelectedVersion(version);
      onVersionSelect(version);
      toast.success(`Switched to version ${version.version}`);
    }
  };

  const handleCompare = () => {
    if (compareVersions.length === 2 && documentId) {
      const comparison = versionManager.compareVersions(
        documentId,
        compareVersions[0].version,
        compareVersions[1].version
      );
      
      console.log('Version comparison:', comparison);
      toast.success(`Comparing versions ${compareVersions[0].version} and ${compareVersions[1].version}`);
    }
  };

  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    setCompareVersions([]);
  };

  if (!documentId) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <History className="w-8 h-8 mx-auto mb-2" />
          <p>No document selected</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-semibold">Version History</h3>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant={compareMode ? "default" : "outline"} 
            size="sm"
            onClick={toggleCompareMode}
          >
            <GitBranch className="w-4 h-4 mr-1" />
            Compare
          </Button>
          {compareMode && compareVersions.length === 2 && (
            <Button size="sm" onClick={handleCompare}>
              Compare Selected
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      <ScrollArea className="h-96">
        <div className="space-y-3">
          {versions.map((version, index) => {
            const isSelected = selectedVersion?.id === version.id;
            const isInComparison = compareVersions.includes(version);
            const isLatest = index === 0;

            return (
              <div key={version.id}>
                <Card 
                  className={`p-4 cursor-pointer transition-all duration-200 ${
                    isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  } ${isInComparison ? 'ring-2 ring-green-500 bg-green-50' : ''} hover:shadow-md`}
                  onClick={() => handleVersionSelect(version)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={isLatest ? "default" : "secondary"}>
                          v{version.version}
                        </Badge>
                        {isLatest && (
                          <Badge variant="outline" className="text-green-600">
                            Current
                          </Badge>
                        )}
                        {compareMode && isInComparison && (
                          <Badge variant="outline" className="text-green-600">
                            Selected
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDistanceToNow(version.createdAt, { addSuffix: true })}</span>
                        </div>
                        {version.author && (
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{version.author}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        {version.changes.map((change, idx) => (
                          <div key={idx} className="text-sm text-gray-700">
                            • {change}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onVersionSelect(version);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
                {index < versions.length - 1 && <Separator className="my-2" />}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
};
