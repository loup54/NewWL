
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, HeadingLevel } from 'docx';
import { Keyword, DocumentData } from '@/pages/Index';
import { AdvancedDocumentStats } from './advancedAnalytics';

export interface ExportData {
  document: DocumentData;
  keywords: Keyword[];
  keywordCounts: Record<string, number>;
  documentStats: AdvancedDocumentStats;
}

export const generatePDFReport = async (data: ExportData, chartElement?: HTMLElement) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = margin;

  // Title
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('WordLens Analysis Report', margin, yPosition);
  yPosition += 15;

  // Document info
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Document: ${data.document.filename}`, margin, yPosition);
  yPosition += 8;
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
  yPosition += 15;

  // Document Statistics
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Document Statistics', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  const stats = [
    `Total Words: ${data.documentStats.totalWords.toLocaleString()}`,
    `Total Characters: ${data.documentStats.totalCharacters.toLocaleString()}`,
    `Reading Time: ${data.documentStats.readingTime} minutes`,
    `Complexity Score: ${data.documentStats.complexityScore}/100`,
    `Average Words per Sentence: ${data.documentStats.avgWordsPerSentence}`,
    `Sentences: ${data.documentStats.totalSentences}`,
    `Paragraphs: ${data.documentStats.totalParagraphs}`
  ];

  stats.forEach(stat => {
    pdf.text(stat, margin, yPosition);
    yPosition += 6;
  });
  yPosition += 10;

  // Keyword Analysis
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Keyword Analysis', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  data.keywords.forEach(keyword => {
    const count = data.keywordCounts[keyword.word] || 0;
    const density = data.documentStats.totalWords > 0 ? 
      (count / data.documentStats.totalWords * 100).toFixed(2) : '0.00';
    
    pdf.text(`• ${keyword.word}: ${count} occurrences (${density}% density)`, margin, yPosition);
    yPosition += 6;
    
    if (yPosition > pdf.internal.pageSize.getHeight() - margin) {
      pdf.addPage();
      yPosition = margin;
    }
  });

  // Most Common Words
  if (data.documentStats.mostCommonWords.length > 0) {
    yPosition += 10;
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Most Common Words', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    data.documentStats.mostCommonWords.slice(0, 10).forEach((word, index) => {
      const count = data.documentStats.wordFrequency[word];
      pdf.text(`${index + 1}. ${word}: ${count} times`, margin, yPosition);
      yPosition += 6;
    });
  }

  // Save the PDF
  pdf.save(`wordlens-analysis-${data.document.filename}.pdf`);
};

export const generateWordDocument = async (data: ExportData) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: "WordLens Analysis Report",
          heading: HeadingLevel.TITLE,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Document: ${data.document.filename}`,
              bold: true,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Generated: ${new Date().toLocaleDateString()}`,
            }),
          ],
        }),
        new Paragraph({
          text: "",
        }),
        new Paragraph({
          text: "Document Statistics",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `Total Words: ${data.documentStats.totalWords.toLocaleString()}` }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `Reading Time: ${data.documentStats.readingTime} minutes` }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `Complexity Score: ${data.documentStats.complexityScore}/100` }),
          ],
        }),
        new Paragraph({
          text: "",
        }),
        new Paragraph({
          text: "Keyword Analysis",
          heading: HeadingLevel.HEADING_1,
        }),
        ...data.keywords.map(keyword => {
          const count = data.keywordCounts[keyword.word] || 0;
          const density = data.documentStats.totalWords > 0 ? 
            (count / data.documentStats.totalWords * 100).toFixed(2) : '0.00';
          
          return new Paragraph({
            children: [
              new TextRun({ 
                text: `${keyword.word}: ${count} occurrences (${density}% density)`,
              }),
            ],
          });
        }),
      ],
    }],
  });

  const buffer = await Packer.toBlob(doc);
  const url = URL.createObjectURL(buffer);
  const link = document.createElement('a');
  link.href = url;
  link.download = `wordlens-analysis-${data.document.filename}.docx`;
  link.click();
  URL.revokeObjectURL(url);
};

export const generateExcelReport = (data: ExportData) => {
  const workbook = XLSX.utils.book_new();

  // Document Stats Sheet
  const statsData = [
    ['Metric', 'Value'],
    ['Document Name', data.document.filename],
    ['Total Words', data.documentStats.totalWords],
    ['Total Characters', data.documentStats.totalCharacters],
    ['Reading Time (minutes)', data.documentStats.readingTime],
    ['Complexity Score', data.documentStats.complexityScore],
    ['Average Words per Sentence', data.documentStats.avgWordsPerSentence],
    ['Total Sentences', data.documentStats.totalSentences],
    ['Total Paragraphs', data.documentStats.totalParagraphs]
  ];
  const statsSheet = XLSX.utils.aoa_to_sheet(statsData);
  XLSX.utils.book_append_sheet(workbook, statsSheet, 'Document Stats');

  // Keywords Sheet
  const keywordData = [
    ['Keyword', 'Count', 'Density %']
  ];
  data.keywords.forEach(keyword => {
    const count = data.keywordCounts[keyword.word] || 0;
    const density = data.documentStats.totalWords > 0 ? 
      (count / data.documentStats.totalWords * 100).toFixed(2) : '0.00';
    keywordData.push([keyword.word, count, density]);
  });
  const keywordsSheet = XLSX.utils.aoa_to_sheet(keywordData);
  XLSX.utils.book_append_sheet(workbook, keywordsSheet, 'Keywords');

  // Word Frequency Sheet
  const wordFreqData = [['Word', 'Frequency']];
  Object.entries(data.documentStats.wordFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 50)
    .forEach(([word, count]) => {
      wordFreqData.push([word, count]);
    });
  const wordFreqSheet = XLSX.utils.aoa_to_sheet(wordFreqData);
  XLSX.utils.book_append_sheet(workbook, wordFreqSheet, 'Word Frequency');

  XLSX.writeFile(workbook, `wordlens-analysis-${data.document.filename}.xlsx`);
};

export const generateComparisonReport = (
  documents: DocumentData[],
  keywords: Keyword[],
  keywordCounts: Record<string, Record<string, number>>,
  format: 'pdf' | 'word' | 'excel'
) => {
  if (format === 'excel') {
    const workbook = XLSX.utils.book_new();

    // Comparison Summary
    const summaryData = [
      ['Document', 'Total Words', 'Keyword Count', 'Keyword Density %']
    ];
    
    documents.forEach(doc => {
      const totalWords = doc.content.trim().split(/\s+/).length;
      const totalKeywords = keywords.reduce((sum, keyword) => {
        return sum + (keywordCounts[doc.filename]?.[keyword.word] || 0);
      }, 0);
      const density = totalWords > 0 ? (totalKeywords / totalWords * 100).toFixed(2) : '0.00';
      summaryData.push([doc.filename, totalWords, totalKeywords, density]);
    });

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Detailed Comparison
    const detailData = [['Keyword', ...documents.map(doc => doc.filename)]];
    keywords.forEach(keyword => {
      const row = [keyword.word];
      documents.forEach(doc => {
        row.push(keywordCounts[doc.filename]?.[keyword.word] || 0);
      });
      detailData.push(row);
    });

    const detailSheet = XLSX.utils.aoa_to_sheet(detailData);
    XLSX.utils.book_append_sheet(workbook, detailSheet, 'Detailed Comparison');

    XLSX.writeFile(workbook, `wordlens-comparison-${Date.now()}.xlsx`);
  }
  // PDF and Word implementations would go here
};
