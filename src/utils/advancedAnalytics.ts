
export interface AdvancedDocumentStats {
  totalWords: number;
  totalCharacters: number;
  totalSentences: number;
  totalParagraphs: number;
  avgWordsPerSentence: number;
  avgSentencesPerParagraph: number;
  readingTime: number; // in minutes
  complexityScore: number; // 0-100
  wordFrequency: Record<string, number>;
  longestWords: string[];
  mostCommonWords: string[];
}

export interface KeywordTrend {
  keyword: string;
  density: number; // percentage
  frequency: number;
  positions: number[];
  context: string[];
}

export const calculateAdvancedStats = (content: string): AdvancedDocumentStats => {
  if (!content.trim()) {
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
      longestWords: [],
      mostCommonWords: []
    };
  }

  const cleanContent = content.replace(/\s+/g, ' ').trim();
  
  // Basic counts
  const totalCharacters = cleanContent.length;
  const words = cleanContent.toLowerCase().match(/\b\w+\b/g) || [];
  const totalWords = words.length;
  const sentences = cleanContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const totalSentences = sentences.length;
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const totalParagraphs = Math.max(paragraphs.length, 1);

  // Averages
  const avgWordsPerSentence = totalSentences > 0 ? totalWords / totalSentences : 0;
  const avgSentencesPerParagraph = totalParagraphs > 0 ? totalSentences / totalParagraphs : 0;

  // Reading time (average 200 words per minute)
  const readingTime = totalWords / 200;

  // Word frequency analysis
  const wordFrequency: Record<string, number> = {};
  words.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });

  // Common words to filter out
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them']);

  // Filter and sort words
  const filteredWords = Object.entries(wordFrequency)
    .filter(([word]) => !commonWords.has(word) && word.length > 2)
    .sort(([, a], [, b]) => b - a);

  const mostCommonWords = filteredWords.slice(0, 10).map(([word]) => word);
  const longestWords = words
    .filter(word => !commonWords.has(word))
    .sort((a, b) => b.length - a.length)
    .slice(0, 10)
    .filter((word, index, arr) => arr.indexOf(word) === index);

  // Complexity score (based on sentence length, word length, and vocabulary diversity)
  const avgWordLength = totalWords > 0 ? words.reduce((sum, word) => sum + word.length, 0) / totalWords : 0;
  const vocabularyDiversity = totalWords > 0 ? Object.keys(wordFrequency).length / totalWords : 0;
  const complexityScore = Math.min(100, 
    (avgWordsPerSentence * 2) + 
    (avgWordLength * 8) + 
    (vocabularyDiversity * 100)
  );

  return {
    totalWords,
    totalCharacters,
    totalSentences,
    totalParagraphs,
    avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
    avgSentencesPerParagraph: Math.round(avgSentencesPerParagraph * 10) / 10,
    readingTime: Math.round(readingTime * 10) / 10,
    complexityScore: Math.round(complexityScore),
    wordFrequency,
    longestWords,
    mostCommonWords
  };
};

export const analyzeKeywordTrends = (content: string, keywords: Array<{word: string}>): KeywordTrend[] => {
  const cleanContent = content.toLowerCase();
  const words = cleanContent.split(/\s+/);
  const totalWords = words.length;

  return keywords.map(keyword => {
    const keywordLower = keyword.word.toLowerCase();
    const regex = new RegExp(`\\b${keywordLower}\\b`, 'gi');
    const matches = Array.from(cleanContent.matchAll(regex));
    
    const positions = matches.map(match => match.index || 0);
    const frequency = matches.length;
    const density = totalWords > 0 ? (frequency / totalWords) * 100 : 0;

    // Get context around each keyword
    const context = matches.slice(0, 3).map(match => {
      const start = Math.max(0, (match.index || 0) - 50);
      const end = Math.min(content.length, (match.index || 0) + keywordLower.length + 50);
      return content.substring(start, end).trim();
    });

    return {
      keyword: keyword.word,
      density: Math.round(density * 100) / 100,
      frequency,
      positions,
      context
    };
  });
};
