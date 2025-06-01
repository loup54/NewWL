
export const getKeywordSuggestions = (content: string): string[] => {
  if (!content) return [];
  
  // Common keywords for diversity, inclusion, and respect analysis
  const commonKeywords = [
    'respect', 'inclusion', 'diversity', 'equity', 'belonging', 'tolerance',
    'acceptance', 'understanding', 'empathy', 'collaboration', 'teamwork',
    'fairness', 'justice', 'equality', 'opportunity', 'bias', 'discrimination',
    'harassment', 'culture', 'values', 'ethics', 'integrity', 'trust',
    'communication', 'feedback', 'support', 'mentorship', 'development',
    'growth', 'innovation', 'creativity', 'perspective', 'voice', 'opinion'
  ];
  
  const words = content.toLowerCase().split(/\s+/);
  const wordFrequency: Record<string, number> = {};
  
  // Count word frequencies
  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '');
    if (cleanWord.length > 3) {
      wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
    }
  });
  
  // Filter suggestions based on content and frequency
  const suggestions = commonKeywords.filter(keyword => {
    return words.some(word => word.includes(keyword)) && wordFrequency[keyword] >= 1;
  });
  
  // Add high-frequency words from content
  const frequentWords = Object.entries(wordFrequency)
    .filter(([word, count]) => count >= 3 && word.length > 4)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
  
  return [...new Set([...suggestions, ...frequentWords])].slice(0, 10);
};

export const keywordCategories = {
  diversity: {
    name: 'Diversity & Inclusion',
    keywords: ['diversity', 'inclusion', 'equity', 'belonging', 'bias', 'discrimination']
  },
  respect: {
    name: 'Respect & Values',
    keywords: ['respect', 'tolerance', 'acceptance', 'understanding', 'empathy', 'values']
  },
  collaboration: {
    name: 'Collaboration',
    keywords: ['collaboration', 'teamwork', 'communication', 'feedback', 'support']
  },
  development: {
    name: 'Growth & Development',
    keywords: ['mentorship', 'development', 'growth', 'innovation', 'creativity']
  }
};
