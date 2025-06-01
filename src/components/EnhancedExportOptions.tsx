
import React, { useState, useCallback } from 'react';
import { Download, FileText, Table, File, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Keyword, DocumentData } from '@/pages/Index';
import { 
  generatePDFReport, 
  generateWordDocument, 
  generateExcelReport,
  generateComparisonReport,
  ExportData 
} from '@/utils/advancedExportUtils';

interface EnhancedExportOptionsProps {
  keywords: Keyword[];
  document?: DocumentData;
  documents?: DocumentData[];
  keywordCounts: Record<string, number> | Record<string, Record<string, number>>;
  documentStats?: {
    totalWords: number;
    totalCharacters: number;
    avgWordsPerSentence: number;
    readingTime: number;
  };
  isComparisonMode?: boolean;
}

export const EnhancedExportOptions: React.FC<EnhancedExportOptionsProps> = ({
  keywords,
  document,
  documents,
  keywordCounts,
  documentStats,
  isComparisonMode = false
}) => {
  const [includeCharts, setIncludeCharts] = useState(true);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'word' | 'excel'>('pdf');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(async () => {
    if (isComparisonMode) {
      if (!documents || documents.length < 2) {
        toast.error('Need at least 2 documents for comparison export');
        return;
      }

      try {
        setIsExporting(true);
        generateComparisonReport(
          documents,
          keywords,
          keywordCounts as Record<string, Record<string, number>>,
          exportFormat
        );
        toast.success(`Comparison report exported as ${exportFormat.toUpperCase()}`);
      } catch (error) {
        console.error('Export error:', error);
        toast.error('Failed to export comparison report');
      } finally {
        setIsExporting(false);
      }
      return;
    }

    if (!document || !documentStats) {
      toast.error('No document data available for export');
      return;
    }

    const exportData: ExportData = {
      document,
      keywords,
      keywordCounts: keywordCounts as Record<string, number>,
      documentStats
    };

    try {
      setIsExporting(true);
      
      let chartElement: HTMLElement | undefined;
      if (includeCharts) {
        chartElement = document.querySelector('.recharts-wrapper') as HTMLElement;
      }

      switch (exportFormat) {
        case 'pdf':
          await generatePDFReport(exportData, chartElement);
          break;
        case 'word':
          await generateWordDocument(exportData);
          break;
        case 'excel':
          generateExcelReport(exportData);
          break;
      }

      toast.success(`Report exported as ${exportFormat.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export report');
    } finally {
      setIsExporting(false);
    }
  }, [exportFormat, includeCharts, document, keywords, keywordCounts, documentStats, isComparisonMode, documents]);

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'word': return <File className="w-4 h-4" />;
      case 'excel': return <Table className="w-4 h-4" />;
      default: return <Download className="w-4 h-4" />;
    }
  };

  const getFormatDescription = (format: string) => {
    switch (format) {
      case 'pdf': return 'Professional report with charts and formatting';
      case 'word': return 'Editable document with tables and styling';
      case 'excel': return 'Spreadsheet with multiple data sheets';
      default: return '';
    }
  };

  if (keywords.length === 0) {
    return (
      <Card className="p-4">
        <div className="text-center text-gray-500">
          <Download className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Add keywords to enable export options</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Download className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">
            {isComparisonMode ? 'Export Comparison Report' : 'Export Analysis Report'}
          </h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Export Format</label>
            <Select value={exportFormat} onValueChange={(value: 'pdf' | 'word' | 'excel') => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>PDF Report</span>
                  </div>
                </SelectItem>
                <SelectItem value="word">
                  <div className="flex items-center space-x-2">
                    <File className="w-4 h-4" />
                    <span>Word Document</span>
                  </div>
                </SelectItem>
                <SelectItem value="excel">
                  <div className="flex items-center space-x-2">
                    <Table className="w-4 h-4" />
                    <span>Excel Spreadsheet</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">{getFormatDescription(exportFormat)}</p>
          </div>

          {!isComparisonMode && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Include Charts</span>
              </div>
              <Switch
                checked={includeCharts}
                onCheckedChange={setIncludeCharts}
              />
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Report Contents</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Document information and statistics</li>
              <li>• Detailed keyword analysis with counts and density</li>
              <li>• Professional formatting and styling</li>
              {includeCharts && !isComparisonMode && <li>• Visual charts and graphs</li>}
              {isComparisonMode && <li>• Side-by-side document comparison</li>}
              <li>• Export timestamp and metadata</li>
            </ul>
          </div>

          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isExporting ? (
              <>
                <Settings className="w-4 h-4 mr-2 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                {getFormatIcon(exportFormat)}
                <span className="ml-2">Export as {exportFormat.toUpperCase()}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
