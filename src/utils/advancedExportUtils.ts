
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } from 'docx';
import { Keyword, DocumentData } from '@/pages/Index';

export interface ExportData {
  document: DocumentData;
  keywords: Keyword[];
  keywordCounts: Record<string, number>;
  documentStats: {
    totalWords: number;
    totalCharacters: number;
    avgWordsPerSentence: number;
    readingTime: number;
  };
}

export const generatePDFReport = async (data: ExportData, chartElement?: HTMLElement) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = margin;

  // Title
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Keyword Analysis Report', margin, yPosition);
  yPosition += 15;

  // Document info
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Document: ${data.document.filename}`, margin, yPosition);
  yPosition += 10;
  pdf.text(`Analysis Date: ${new Date().toLocaleDateString()}`, margin, yPosition);
  yPosition += 15;

  // Document statistics
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Document Statistics', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const stats = [
    `Total Words: ${data.documentStats.totalWords.toLocaleString()}`,
    `Total Characters: ${data.documentStats.totalCharacters.toLocaleString()}`,
    `Average Words per Sentence: ${data.documentStats.avgWordsPerSentence.toFixed(1)}`,
    `Estimated Reading Time: ${data.documentStats.readingTime} minutes`
  ];

  stats.forEach(stat => {
    pdf.text(stat, margin, yPosition);
    yPosition += 8;
  });
  yPosition += 10;

  // Keywords table
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Keyword Analysis', margin, yPosition);
  yPosition += 15;

  // Table headers
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  const colWidths = [60, 30, 30, 50];
  const headers = ['Keyword', 'Count', 'Density %', 'Color'];
  
  let xPosition = margin;
  headers.forEach((header, index) => {
    pdf.text(header, xPosition, yPosition);
    xPosition += colWidths[index];
  });
  yPosition += 8;

  // Table data
  pdf.setFont('helvetica', 'normal');
  data.keywords.forEach(keyword => {
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = margin;
    }

    const count = data.keywordCounts[keyword.word] || 0;
    const density = ((count / data.documentStats.totalWords) * 100).toFixed(2);
    
    xPosition = margin;
    const rowData = [keyword.word, count.toString(), density, keyword.color];
    
    rowData.forEach((cell, index) => {
      pdf.text(cell, xPosition, yPosition);
      xPosition += colWidths[index];
    });
    yPosition += 8;
  });

  // Add chart if provided
  if (chartElement) {
    try {
      const canvas = await html2canvas(chartElement, { 
        backgroundColor: '#ffffff',
        scale: 2 
      });
      const imgData = canvas.toDataURL('image/png');
      
      pdf.addPage();
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Keyword Distribution Chart', margin, margin);
      
      const imgWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', margin, margin + 20, imgWidth, imgHeight);
    } catch (error) {
      console.error('Error adding chart to PDF:', error);
    }
  }

  // Save the PDF
  const timestamp = new Date().toISOString().split('T')[0];
  pdf.save(`keyword-analysis-report-${timestamp}.pdf`);
};

export const generateWordDocument = async (data: ExportData) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Title
        new Paragraph({
          text: 'Keyword Analysis Report',
          heading: HeadingLevel.TITLE,
          spacing: { after: 300 }
        }),

        // Document info
        new Paragraph({
          children: [
            new TextRun({ text: 'Document: ', bold: true }),
            new TextRun(data.document.filename)
          ],
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: 'Analysis Date: ', bold: true }),
            new TextRun(new Date().toLocaleDateString())
          ],
          spacing: { after: 400 }
        }),

        // Statistics section
        new Paragraph({
          text: 'Document Statistics',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: `Total Words: ${data.documentStats.totalWords.toLocaleString()}`, break: 1 }),
            new TextRun({ text: `Total Characters: ${data.documentStats.totalCharacters.toLocaleString()}`, break: 1 }),
            new TextRun({ text: `Average Words per Sentence: ${data.documentStats.avgWordsPerSentence.toFixed(1)}`, break: 1 }),
            new TextRun({ text: `Estimated Reading Time: ${data.documentStats.readingTime} minutes`, break: 1 })
          ],
          spacing: { after: 400 }
        }),

        // Keywords section
        new Paragraph({
          text: 'Keyword Analysis',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }),

        // Keywords table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: 'Keyword', bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: 'Count', bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: 'Density %', bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: 'Color', bold: true })] })
              ]
            }),
            ...data.keywords.map(keyword => {
              const count = data.keywordCounts[keyword.word] || 0;
              const density = ((count / data.documentStats.totalWords) * 100).toFixed(2);
              
              return new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(keyword.word)] }),
                  new TableCell({ children: [new Paragraph(count.toString())] }),
                  new TableCell({ children: [new Paragraph(`${density}%`)] }),
                  new TableCell({ children: [new Paragraph(keyword.color)] })
                ]
              });
            })
          ]
        })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `keyword-analysis-report-${new Date().toISOString().split('T')[0]}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateExcelReport = (data: ExportData) => {
  const workbook = XLSX.utils.book_new();

  // Summary sheet
  const summaryData = [
    ['Keyword Analysis Report'],
    [''],
    ['Document Information'],
    ['Filename', data.document.filename],
    ['Analysis Date', new Date().toLocaleDateString()],
    ['Upload Date', data.document.uploadDate.toLocaleDateString()],
    [''],
    ['Document Statistics'],
    ['Total Words', data.documentStats.totalWords],
    ['Total Characters', data.documentStats.totalCharacters],
    ['Average Words per Sentence', data.documentStats.avgWordsPerSentence.toFixed(1)],
    ['Estimated Reading Time (minutes)', data.documentStats.readingTime],
    [''],
    ['Summary'],
    ['Total Keywords Analyzed', data.keywords.length],
    ['Total Keyword Occurrences', Object.values(data.keywordCounts).reduce((sum, count) => sum + count, 0)]
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  // Keywords detailed sheet
  const keywordData = [
    ['Keyword', 'Count', 'Density (%)', 'Color', 'Frequency Rank']
  ];

  const sortedKeywords = [...data.keywords].sort((a, b) => {
    const countA = data.keywordCounts[a.word] || 0;
    const countB = data.keywordCounts[b.word] || 0;
    return countB - countA;
  });

  sortedKeywords.forEach((keyword, index) => {
    const count = data.keywordCounts[keyword.word] || 0;
    const density = ((count / data.documentStats.totalWords) * 100).toFixed(2);
    keywordData.push([keyword.word, count, density, keyword.color, index + 1]);
  });

  const keywordSheet = XLSX.utils.aoa_to_sheet(keywordData);
  XLSX.utils.book_append_sheet(workbook, keywordSheet, 'Keyword Details');

  // Raw data sheet
  const rawData = [
    ['All Data Export'],
    [''],
    ['Document Content Length', data.document.content.length],
    ['Analysis Timestamp', new Date().toISOString()],
    [''],
    ['Keyword', 'Word', 'Count', 'Color', 'ID']
  ];

  data.keywords.forEach(keyword => {
    const count = data.keywordCounts[keyword.word] || 0;
    rawData.push(['Keyword', keyword.word, count, keyword.color, keyword.id]);
  });

  const rawSheet = XLSX.utils.aoa_to_sheet(rawData);
  XLSX.utils.book_append_sheet(workbook, rawSheet, 'Raw Data');

  // Export the file
  const timestamp = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `keyword-analysis-report-${timestamp}.xlsx`);
};

export const generateComparisonReport = (
  documents: DocumentData[],
  keywords: Keyword[],
  keywordCounts: Record<string, Record<string, number>>,
  format: 'pdf' | 'excel' | 'word'
) => {
  const comparisonData = {
    documents,
    keywords,
    keywordCounts,
    analysisDate: new Date(),
    totalDocuments: documents.length,
    totalKeywords: keywords.length
  };

  if (format === 'excel') {
    generateComparisonExcel(comparisonData);
  } else if (format === 'pdf') {
    generateComparisonPDF(comparisonData);
  } else if (format === 'word') {
    generateComparisonWord(comparisonData);
  }
};

const generateComparisonExcel = (data: any) => {
  const workbook = XLSX.utils.book_new();

  // Summary sheet
  const summaryData = [
    ['Document Comparison Report'],
    [''],
    ['Analysis Information'],
    ['Number of Documents', data.totalDocuments],
    ['Number of Keywords', data.totalKeywords],
    ['Analysis Date', data.analysisDate.toLocaleDateString()],
    [''],
    ['Documents Analyzed']
  ];

  data.documents.forEach((doc: DocumentData, index: number) => {
    const totalWords = doc.content.trim().split(/\s+/).length;
    summaryData.push([`Document ${index + 1}`, doc.filename, `${totalWords} words`]);
  });

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  // Comparison matrix
  const matrixData = [['Keyword', ...data.documents.map((doc: DocumentData) => doc.filename)]];
  
  data.keywords.forEach((keyword: Keyword) => {
    const row = [keyword.word];
    data.documents.forEach((doc: DocumentData) => {
      row.push(data.keywordCounts[doc.filename]?.[keyword.word] || 0);
    });
    matrixData.push(row);
  });

  const matrixSheet = XLSX.utils.aoa_to_sheet(matrixData);
  XLSX.utils.book_append_sheet(workbook, matrixSheet, 'Comparison Matrix');

  const timestamp = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `document-comparison-${timestamp}.xlsx`);
};

const generateComparisonPDF = async (data: any) => {
  const pdf = new jsPDF();
  const margin = 20;
  let yPosition = margin;

  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Document Comparison Report', margin, yPosition);
  yPosition += 20;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Analysis Date: ${data.analysisDate.toLocaleDateString()}`, margin, yPosition);
  yPosition += 10;
  pdf.text(`Documents Analyzed: ${data.totalDocuments}`, margin, yPosition);
  yPosition += 10;
  pdf.text(`Keywords Tracked: ${data.totalKeywords}`, margin, yPosition);
  yPosition += 20;

  // Document list
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Documents:', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  data.documents.forEach((doc: DocumentData, index: number) => {
    const totalWords = doc.content.trim().split(/\s+/).length;
    pdf.text(`${index + 1}. ${doc.filename} (${totalWords.toLocaleString()} words)`, margin + 10, yPosition);
    yPosition += 8;
  });

  const timestamp = new Date().toISOString().split('T')[0];
  pdf.save(`document-comparison-${timestamp}.pdf`);
};

const generateComparisonWord = async (data: any) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: 'Document Comparison Report',
          heading: HeadingLevel.TITLE,
          spacing: { after: 300 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: 'Analysis Date: ', bold: true }),
            new TextRun(data.analysisDate.toLocaleDateString())
          ],
          spacing: { after: 200 }
        }),

        new Paragraph({
          text: 'Documents Analyzed',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }),

        ...data.documents.map((doc: DocumentData, index: number) => {
          const totalWords = doc.content.trim().split(/\s+/).length;
          return new Paragraph({
            children: [
              new TextRun({ text: `${index + 1}. `, bold: true }),
              new TextRun(`${doc.filename} (${totalWords.toLocaleString()} words)`)
            ]
          });
        })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `document-comparison-${new Date().toISOString().split('T')[0]}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
