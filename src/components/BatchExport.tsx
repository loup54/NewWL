
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentData } from '@/types';
import { Download, FileText, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BatchExportProps {
  documents: DocumentData[];
}

interface ExportProgress {
  documentId: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
}

export const BatchExport: React.FC<BatchExportProps> = ({ documents }) => {
  const { toast } = useToast();
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'word' | 'excel' | 'zip'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress[]>([]);

  const handleDocumentSelection = (documentId: string, checked: boolean) => {
    setSelectedDocuments(prev => 
      checked 
        ? [...prev, documentId]
        : prev.filter(id => id !== documentId)
    );
  };

  const selectAllDocuments = () => {
    setSelectedDocuments(documents.map(doc => doc.filename));
  };

  const deselectAllDocuments = () => {
    setSelectedDocuments([]);
  };

  const startBatchExport = async () => {
    if (selectedDocuments.length === 0) {
      toast({
        title: "No Documents Selected",
        description: "Please select at least one document to export.",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    const progress = selectedDocuments.map(id => ({
      documentId: id,
      status: 'pending' as const,
      progress: 0
    }));
    setExportProgress(progress);

    // Simulate batch export process
    for (let i = 0; i < selectedDocuments.length; i++) {
      const documentId = selectedDocuments[i];
      
      // Update status to processing
      setExportProgress(prev => prev.map(p => 
        p.documentId === documentId 
          ? { ...p, status: 'processing', progress: 0 }
          : p
      ));

      // Simulate export progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setExportProgress(prev => prev.map(p => 
          p.documentId === documentId 
            ? { ...p, progress }
            : p
        ));
      }

      // Mark as completed
      setExportProgress(prev => prev.map(p => 
        p.documentId === documentId 
          ? { ...p, status: 'completed', progress: 100 }
          : p
      ));
    }

    setIsExporting(false);
    toast({
      title: "Batch Export Complete",
      description: `Successfully exported ${selectedDocuments.length} documents as ${exportFormat.toUpperCase()}.`
    });
  };

  const getDocumentProgress = (documentId: string) => {
    return exportProgress.find(p => p.documentId === documentId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Batch Export</h2>
        <p className="text-muted-foreground">Export multiple documents at once</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export Settings</CardTitle>
          <CardDescription>Configure your batch export preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Export Format</label>
              <Select value={exportFormat} onValueChange={(value: 'pdf' | 'word' | 'excel' | 'zip') => setExportFormat(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Reports</SelectItem>
                  <SelectItem value="word">Word Documents</SelectItem>
                  <SelectItem value="excel">Excel Workbook</SelectItem>
                  <SelectItem value="zip">ZIP Archive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-6">
              <Button variant="outline" size="sm" onClick={selectAllDocuments}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={deselectAllDocuments}>
                Deselect All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents ({documents.length})</CardTitle>
          <CardDescription>Select documents to include in the batch export</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {documents.map(document => {
              const progress = getDocumentProgress(document.filename);
              const isSelected = selectedDocuments.includes(document.filename);
              
              return (
                <div key={document.filename} className="flex items-center gap-3 p-3 rounded-lg border">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => handleDocumentSelection(document.filename, !!checked)}
                    disabled={isExporting}
                  />
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">{document.filename}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(document.uploadDate).toLocaleDateString()}
                    </p>
                    {progress && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2">
                          <Progress value={progress.progress} className="flex-1" />
                          <span className="text-xs text-muted-foreground">
                            {progress.progress}%
                          </span>
                          {progress.status === 'completed' && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {selectedDocuments.length} of {documents.length} documents selected
        </p>
        <Button 
          onClick={startBatchExport}
          disabled={selectedDocuments.length === 0 || isExporting}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Start Batch Export'}
        </Button>
      </div>
    </div>
  );
};
