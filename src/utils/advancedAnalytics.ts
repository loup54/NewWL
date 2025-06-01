
import { Keyword } from '@/pages/Index';

export interface AdvancedDocumentStats {
  totalWords: number;
  totalCharacters: number;
  totalSentences: number;
  totalParagraphs: number;
  avgWordsPerSentence: number;
  avgSentencesPerParagraph: number;
  readingTime: number;
  complexityScore: number;
  wordFrequency: Record<string, number>;
  mostCommonWords: string[];
}

export interface KeywordTrend {
  keyword: string;
  count: number;
  density: number;
  positions: number[];
}

export const calculateAdvancedStats = (content: string): AdvancedDocumentStats => {
  if (!content || typeof content !== 'string') {
    return {
      totalWords: 0,
      totalCharacters: 0,
      totalSentences: 0,
      totalParagraphs: 0,
      avgWordsPerSentence: 0,
      avgSentencesPerParagraph: 0,
      readingTime: 0,
      complexityScore: 0,
      wordFrequency: {},
      mostCommonWords: []
    };
  }

  const words = content.trim().split(/\s+/).filter(word => word.length > 0);
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  const totalWords = words.length;
  const totalCharacters = content.length;
  const totalSentences = sentences.length;
  const totalParagraphs = Math.max(paragraphs.length, 1);
  
  const avgWordsPerSentence = totalSentences > 0 ? Math.round((totalWords / totalSentences) * 100) / 100 : 0;
  const avgSentencesPerParagraph = totalParagraphs > 0 ? Math.round((totalSentences / totalParagraphs) * 100) / 100 : 0;
  
  // Reading time calculation (average 200 words per minute)
  const readingTime = Math.ceil(totalWords / 200);
  
  // Word frequency analysis
  const wordFrequency: Record<string, number> = {};
  words.forEach(word => {
    const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
    if (cleanWord.length > 2) {
      wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
    }
  });
  
  // Most common words (excluding common stop words)
  const stopWords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use']);
  
  const mostCommonWords = Object.entries(wordFrequency)
    .filter(([word]) => !stopWords.has(word))
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([word]) => word);
  
  // Complexity score calculation
  const avgWordLength = words.reduce((sum, word) => {
    const cleanWord = word.replace(/[^\w]/g, '');
    return sum + cleanWord.length;
  }, 0) / totalWords;
  
  const complexityScore = Math.min(100, Math.round(
    (avgWordsPerSentence * 2) + 
    (avgWordLength * 5) + 
    (totalSentences > 0 ? (totalWords / totalSentences) : 0)
  ));
  
  return {
    totalWords,
    totalCharacters,
    totalSentences,
    totalParagraphs,
    avgWordsPerSentence,
    avgSentencesPerParagraph,
    readingTime,
    complexityScore,
    wordFrequency,
    mostCommonWords
  };
};

export const analyzeKeywordTrends = (content: string, keywords: Keyword[]): KeywordTrend[] => {
  if (!content || !keywords || !Array.isArray(keywords)) {
    return [];
  }

  const words = content.toLowerCase().split(/\s+/);
  const totalWords = words.length;
  
  return keywords.map(keyword => {
    const positions: number[] = [];
    let count = 0;
    
    words.forEach((word, index) => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord === keyword.word.toLowerCase()) {
        count++;
        positions.push(index);
      }
    });
    
    const density = totalWords > 0 ? (count / totalWords) * 100 : 0;
    
    return {
      keyword: keyword.word,
      count,
      density: Math.round(density * 100) / 100,
      positions
    };
  });
};

export const calculateKeywordDensity = (content: string, keyword: string): number => {
  if (!content || !keyword) return 0;
  
  const words = content.toLowerCase().split(/\s+/);
  const totalWords = words.length;
  
  if (totalWords === 0) return 0;
  
  const keywordCount = words.filter(word => {
    const cleanWord = word.replace(/[^\w]/g, '');
    return cleanWord === keyword.toLowerCase();
  }).length;
  
  return Math.round((keywordCount / totalWords) * 10000) / 100;
};
