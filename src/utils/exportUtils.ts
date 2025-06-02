import { Keyword, DocumentData } from '@/types';

export const exportKeywordResults = (
  keywords: Keyword[], 
  document: DocumentData, 
  format: 'csv' | 'json'
) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `keyword-analysis-${timestamp}.${format}`;
  
  if (format === 'csv') {
    const csvContent = [
      'Keyword,Count,Color,Document',
      ...keywords.map(k => `"${k.word}",${k.count},"${k.color}","${document.filename}"`)
    ].join('\n');
    
    downloadFile(csvContent, filename, 'text/csv');
  } else {
    const jsonContent = {
      document: {
        filename: document.filename,
        uploadDate: document.uploadDate,
        totalWords: document.content.trim().split(/\s+/).length
      },
      keywords: keywords.map(k => ({
        word: k.word,
        count: k.count,
        color: k.color,
        density: ((k.count / document.content.trim().split(/\s+/).length) * 100).toFixed(2)
      })),
      exportDate: new Date().toISOString()
    };
    
    downloadFile(JSON.stringify(jsonContent, null, 2), filename, 'application/json');
  }
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
