
import { getKeywordSuggestions } from './keywordSuggestions';

export interface KeywordSuggestion {
  word: string;
  confidence: number;
  category: string;
  context: string[];
  relatedWords: string[];
}

export interface SuggestionContext {
  documentType?: string;
  domain?: string;
  existingKeywords?: string[];
}

export const getAdvancedKeywordSuggestions = (
  content: string,
  context?: SuggestionContext
): KeywordSuggestion[] => {
  if (!content) return [];

  const words = content.toLowerCase().split(/\s+/);
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Domain-specific keyword patterns
  const domainPatterns = {
    hr: {
      keywords: ['employee', 'staff', 'team', 'manager', 'supervisor', 'workplace', 'policy', 'procedure'],
      indicators: ['human resources', 'hr', 'personnel', 'workforce']
    },
    legal: {
      keywords: ['compliance', 'regulation', 'law', 'legal', 'contract', 'agreement', 'liability'],
      indicators: ['legal', 'court', 'law', 'attorney', 'compliance']
    },
    technical: {
      keywords: ['system', 'process', 'method', 'implementation', 'framework', 'architecture'],
      indicators: ['technical', 'system', 'software', 'development', 'implementation']
    },
    business: {
      keywords: ['strategy', 'goal', 'objective', 'performance', 'revenue', 'customer', 'market'],
      indicators: ['business', 'company', 'organization', 'corporate', 'enterprise']
    }
  };

  // Detect document domain
  const detectedDomain = detectDocumentDomain(content, domainPatterns);
  
  // Get basic suggestions
  const basicSuggestions = getKeywordSuggestions(content);
  
  // Enhanced suggestions with context
  const enhancedSuggestions: KeywordSuggestion[] = [];

  // Analyze word frequency and context
  const wordFrequency = calculateWordFrequency(words);
  const bigramFrequency = calculateBigramFrequency(words);
  
  // Generate suggestions based on frequency and context
  Object.entries(wordFrequency).forEach(([word, frequency]) => {
    if (word.length > 3 && frequency >= 2) {
      const contexts = findWordContexts(word, sentences);
      const relatedWords = findRelatedWords(word, bigramFrequency);
      const confidence = calculateConfidence(word, frequency, contexts, detectedDomain);
      
      if (confidence > 0.3) {
        enhancedSuggestions.push({
          word,
          confidence,
          category: categorizeWord(word, detectedDomain),
          context: contexts.slice(0, 3),
          relatedWords
        });
      }
    }
  });

  // Add domain-specific suggestions
  if (detectedDomain && domainPatterns[detectedDomain as keyof typeof domainPatterns]) {
    const domainKeywords = domainPatterns[detectedDomain as keyof typeof domainPatterns].keywords;
    domainKeywords.forEach(keyword => {
      if (words.includes(keyword) && !enhancedSuggestions.find(s => s.word === keyword)) {
        enhancedSuggestions.push({
          word: keyword,
          confidence: 0.8,
          category: detectedDomain,
          context: findWordContexts(keyword, sentences).slice(0, 2),
          relatedWords: []
        });
      }
    });
  }

  // Filter out existing keywords
  const existingKeywords = context?.existingKeywords || [];
  const filteredSuggestions = enhancedSuggestions.filter(
    s => !existingKeywords.includes(s.word)
  );

  // Sort by confidence and return top suggestions
  return filteredSuggestions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 15);
};

const detectDocumentDomain = (content: string, patterns: any): string | null => {
  const lowerContent = content.toLowerCase();
  
  for (const [domain, pattern] of Object.entries(patterns)) {
    const indicators = (pattern as any).indicators;
    const score = indicators.reduce((sum: number, indicator: string) => {
      return sum + (lowerContent.includes(indicator) ? 1 : 0);
    }, 0);
    
    if (score >= 2) {
      return domain;
    }
  }
  
  return null;
};

const calculateWordFrequency = (words: string[]): Record<string, number> => {
  const frequency: Record<string, number> = {};
  const stopWords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use']);
  
  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '');
    if (cleanWord.length > 2 && !stopWords.has(cleanWord)) {
      frequency[cleanWord] = (frequency[cleanWord] || 0) + 1;
    }
  });
  
  return frequency;
};

const calculateBigramFrequency = (words: string[]): Record<string, string[]> => {
  const bigrams: Record<string, string[]> = {};
  
  for (let i = 0; i < words.length - 1; i++) {
    const word1 = words[i].replace(/[^\w]/g, '');
    const word2 = words[i + 1].replace(/[^\w]/g, '');
    
    if (word1.length > 2 && word2.length > 2) {
      if (!bigrams[word1]) bigrams[word1] = [];
      bigrams[word1].push(word2);
      
      if (!bigrams[word2]) bigrams[word2] = [];
      bigrams[word2].push(word1);
    }
  }
  
  return bigrams;
};

const findWordContexts = (word: string, sentences: string[]): string[] => {
  return sentences
    .filter(sentence => sentence.toLowerCase().includes(word))
    .map(sentence => sentence.trim())
    .slice(0, 3);
};

const findRelatedWords = (word: string, bigramFrequency: Record<string, string[]>): string[] => {
  const related = bigramFrequency[word] || [];
  const frequency: Record<string, number> = {};
  
  related.forEach(relatedWord => {
    frequency[relatedWord] = (frequency[relatedWord] || 0) + 1;
  });
  
  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([relatedWord]) => relatedWord);
};

const calculateConfidence = (
  word: string,
  frequency: number,
  contexts: string[],
  domain: string | null
): number => {
  let confidence = Math.min(frequency / 10, 0.8); // Base confidence from frequency
  
  // Boost confidence if word appears in multiple contexts
  if (contexts.length > 1) confidence += 0.1;
  
  // Boost confidence for domain-specific words
  if (domain && word.includes(domain)) confidence += 0.2;
  
  // Boost confidence for meaningful words (longer words often more meaningful)
  if (word.length > 6) confidence += 0.1;
  
  return Math.min(confidence, 1.0);
};

const categorizeWord = (word: string, domain: string | null): string => {
  const categories = {
    emotion: ['happy', 'sad', 'angry', 'excited', 'frustrated', 'satisfied'],
    action: ['implement', 'develop', 'create', 'design', 'execute', 'manage'],
    quality: ['excellent', 'good', 'poor', 'outstanding', 'effective', 'efficient'],
    process: ['workflow', 'procedure', 'method', 'approach', 'strategy', 'framework']
  };
  
  for (const [category, words] of Object.entries(categories)) {
    if (words.some(w => word.includes(w) || w.includes(word))) {
      return category;
    }
  }
  
  return domain || 'general';
};

export const getKeywordSuggestionsWithContext = (
  content: string,
  documentType?: string,
  existingKeywords?: string[]
): KeywordSuggestion[] => {
  return getAdvancedKeywordSuggestions(content, {
    documentType,
    existingKeywords
  });
};
