import { Document, DocumentAnalysis, Theme, KeywordMatch, ReadabilityScores, DocumentComparison } from '../types/document-analysis';
import { OpenAI } from 'openai';

export class DocumentAnalysisService {
  private openai: OpenAI;
  private readonly THEME_EXTRACTION_PROMPT = `
    Analyze the following document and extract the top 10 most important themes.
    For each theme, provide:
    1. Theme name (2-4 words)
    2. Brief description (1 sentence)
    3. Confidence score (0-100)
    4. Supporting quotes (1-2 examples)
    5. Category (topic, entity, or concept)

    Document content:
    {content}
  `;

  private readonly COMPARISON_PROMPT = `
    Compare the following two documents and identify:
    1. Shared themes
    2. Unique themes for each document
    3. Overall theme similarity score (0-1)

    Document 1:
    {doc1}

    Document 2:
    {doc2}
  `;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async analyzeDocument(document: Document): Promise<DocumentAnalysis> {
    try {
      // Extract themes using OpenAI
      const themes = await this.extractThemes(document.content);

      // Process keyword matches
      const keywordMatches = await this.processKeywordMatches(document.content);

      // Calculate readability scores
      const readabilityScores = await this.calculateReadabilityScores(document.content);

      return {
        id: crypto.randomUUID(),
        documentId: document.id,
        themes,
        keywordMatches,
        readabilityScores,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('Error analyzing document:', error);
      throw new Error('Failed to analyze document');
    }
  }

  async compareDocuments(doc1: Document, doc2: Document): Promise<DocumentComparison> {
    try {
      // Extract themes for both documents
      const [themes1, themes2] = await Promise.all([
        this.extractThemes(doc1.content),
        this.extractThemes(doc2.content),
      ]);

      // Get theme similarity using OpenAI
      const themeSimilarity = await this.compareThemes(doc1.content, doc2.content);

      // Compare keyword matches
      const [keywordMatches1, keywordMatches2] = await Promise.all([
        this.processKeywordMatches(doc1.content),
        this.processKeywordMatches(doc2.content),
      ]);

      // Calculate readability scores for both documents
      const [readability1, readability2] = await Promise.all([
        this.calculateReadabilityScores(doc1.content),
        this.calculateReadabilityScores(doc2.content),
      ]);

      // Process keyword overlap
      const keywordOverlap = this.processKeywordOverlap(keywordMatches1, keywordMatches2);

      return {
        id: crypto.randomUUID(),
        document1Id: doc1.id,
        document2Id: doc2.id,
        themeSimilarity,
        keywordOverlap,
        readabilityComparison: {
          doc1: readability1,
          doc2: readability2,
        },
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('Error comparing documents:', error);
      throw new Error('Failed to compare documents');
    }
  }

  private async extractThemes(documentContent: string): Promise<Theme[]> {
    const prompt = this.THEME_EXTRACTION_PROMPT.replace('{content}', documentContent);

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Parse the response and convert to Theme objects
    // This is a simplified version - you'll need to implement proper parsing
    const themes: Theme[] = [];
    const responseContent = response.choices[0].message.content;
    
    if (responseContent) {
      // Parse the content and create Theme objects
      // This is where you'd implement the actual parsing logic
      // For now, we'll return a placeholder
      themes.push({
        name: 'Sample Theme',
        description: 'A sample theme description',
        confidence: 85,
        examples: ['Example quote 1', 'Example quote 2'],
        category: 'topic',
      });
    }

    return themes;
  }

  private async compareThemes(doc1Content: string, doc2Content: string) {
    const prompt = this.COMPARISON_PROMPT
      .replace('{doc1}', doc1Content)
      .replace('{doc2}', doc2Content);

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Parse the response and extract theme comparison data
    // This is a simplified version - you'll need to implement proper parsing
    return {
      score: 0.75, // Example similarity score
      sharedThemes: ['Theme 1', 'Theme 2'],
      uniqueThemes: {
        doc1: ['Unique to Doc 1'],
        doc2: ['Unique to Doc 2'],
      },
    };
  }

  private processKeywordOverlap(matches1: KeywordMatch[], matches2: KeywordMatch[]) {
    const keywords1 = new Set(matches1.map(m => m.keyword));
    const keywords2 = new Set(matches2.map(m => m.keyword));

    const shared = Array.from(keywords1).filter(k => keywords2.has(k));
    const uniqueToDoc1 = Array.from(keywords1).filter(k => !keywords2.has(k));
    const uniqueToDoc2 = Array.from(keywords2).filter(k => !keywords1.has(k));

    const frequencyComparison: Record<string, { doc1: number; doc2: number }> = {};
    
    // Process shared keywords
    shared.forEach(keyword => {
      const match1 = matches1.find(m => m.keyword === keyword);
      const match2 = matches2.find(m => m.keyword === keyword);
      frequencyComparison[keyword] = {
        doc1: match1?.frequency || 0,
        doc2: match2?.frequency || 0,
      };
    });

    // Process unique keywords
    uniqueToDoc1.forEach(keyword => {
      const match = matches1.find(m => m.keyword === keyword);
      frequencyComparison[keyword] = {
        doc1: match?.frequency || 0,
        doc2: 0,
      };
    });

    uniqueToDoc2.forEach(keyword => {
      const match = matches2.find(m => m.keyword === keyword);
      frequencyComparison[keyword] = {
        doc1: 0,
        doc2: match?.frequency || 0,
      };
    });

    return {
      shared,
      uniqueToDoc1,
      uniqueToDoc2,
      frequencyComparison,
    };
  }

  private async processKeywordMatches(content: string): Promise<KeywordMatch[]> {
    // Implement keyword matching logic
    // This would include both exact matches and semantic similarity
    return [];
  }

  private async calculateReadabilityScores(content: string): Promise<ReadabilityScores> {
    // Implement readability score calculation
    // You can use libraries like textstat for this
    return {
      fleschKincaidGrade: 0,
      fleschReadingEase: 0,
      colemanLiauIndex: 0,
      automatedReadabilityIndex: 0,
      avgSentenceLength: 0,
      avgSyllablesPerWord: 0,
    };
  }
} 