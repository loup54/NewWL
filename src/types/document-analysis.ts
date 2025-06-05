export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  size: number;
  content: string;
  uploadedAt: Date;
  processedAt?: Date;
  status: DocumentStatus;
  createdAt: Date;
}

export type DocumentType = 'pdf' | 'txt' | 'rtf' | 'html' | 'md' | 'docx' | 'csv';

export type DocumentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Theme {
  name: string;
  description: string;
  confidence: number;
  examples: string[];
  category: ThemeCategory;
}

export type ThemeCategory = 'topic' | 'entity' | 'concept';

export interface KeywordMatch {
  keyword: string;
  frequency: number;
  context: string[];
  relevance: number;
}

export interface DocumentAnalysis {
  id: string;
  documentId: string;
  themes: Theme[];
  keywordMatches: KeywordMatch[];
  readabilityScores: ReadabilityScores;
  createdAt: Date;
}

export interface ReadabilityScores {
  fleschKincaidGrade: number;
  fleschReadingEase: number;
  colemanLiauIndex: number;
  automatedReadabilityIndex: number;
  avgSentenceLength: number;
  avgSyllablesPerWord: number;
}

export interface ThemeSimilarity {
  score: number;
  sharedThemes: string[];
  uniqueThemes: {
    doc1: string[];
    doc2: string[];
  };
}

export interface KeywordOverlap {
  shared: string[];
  uniqueToDoc1: string[];
  uniqueToDoc2: string[];
  frequencyComparison: Record<string, {
    doc1: number;
    doc2: number;
  }>;
}

export interface ReadabilityComparison {
  doc1: ReadabilityScores;
  doc2: ReadabilityScores;
}

export interface DocumentComparison {
  id: string;
  document1Id: string;
  document2Id: string;
  themeSimilarity: ThemeSimilarity;
  keywordOverlap: KeywordOverlap;
  readabilityComparison: ReadabilityComparison;
  createdAt: Date;
} 