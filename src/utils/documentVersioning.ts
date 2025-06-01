
export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  content: string;
  filename: string;
  createdAt: Date;
  changes: string[];
  author?: string;
}

export interface VersionedDocument {
  id: string;
  currentVersion: number;
  versions: DocumentVersion[];
  metadata: {
    title: string;
    description?: string;
    tags: string[];
  };
}

const STORAGE_KEY = 'wordlens-document-versions';

export class DocumentVersionManager {
  private static instance: DocumentVersionManager;
  private versionedDocuments: Map<string, VersionedDocument> = new Map();

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): DocumentVersionManager {
    if (!DocumentVersionManager.instance) {
      DocumentVersionManager.instance = new DocumentVersionManager();
    }
    return DocumentVersionManager.instance;
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        Object.entries(data).forEach(([id, doc]: [string, any]) => {
          this.versionedDocuments.set(id, {
            ...doc,
            versions: doc.versions.map((v: any) => ({
              ...v,
              createdAt: new Date(v.createdAt)
            }))
          });
        });
      }
    } catch (error) {
      console.error('Error loading document versions:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const data = Object.fromEntries(this.versionedDocuments);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving document versions:', error);
    }
  }

  createVersionedDocument(filename: string, content: string, author?: string): string {
    const id = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const versionId = `v-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const firstVersion: DocumentVersion = {
      id: versionId,
      documentId: id,
      version: 1,
      content,
      filename,
      createdAt: new Date(),
      changes: ['Initial version'],
      author
    };

    const versionedDoc: VersionedDocument = {
      id,
      currentVersion: 1,
      versions: [firstVersion],
      metadata: {
        title: filename,
        tags: []
      }
    };

    this.versionedDocuments.set(id, versionedDoc);
    this.saveToStorage();
    return id;
  }

  addVersion(documentId: string, content: string, changes: string[], author?: string): DocumentVersion | null {
    const doc = this.versionedDocuments.get(documentId);
    if (!doc) return null;

    const newVersion = doc.currentVersion + 1;
    const versionId = `v-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const version: DocumentVersion = {
      id: versionId,
      documentId,
      version: newVersion,
      content,
      filename: doc.versions[0].filename,
      createdAt: new Date(),
      changes,
      author
    };

    doc.versions.push(version);
    doc.currentVersion = newVersion;
    
    this.saveToStorage();
    return version;
  }

  getDocument(documentId: string): VersionedDocument | null {
    return this.versionedDocuments.get(documentId) || null;
  }

  getCurrentVersion(documentId: string): DocumentVersion | null {
    const doc = this.getDocument(documentId);
    if (!doc) return null;
    
    return doc.versions.find(v => v.version === doc.currentVersion) || null;
  }

  getVersion(documentId: string, version: number): DocumentVersion | null {
    const doc = this.getDocument(documentId);
    if (!doc) return null;
    
    return doc.versions.find(v => v.version === version) || null;
  }

  getAllVersions(documentId: string): DocumentVersion[] {
    const doc = this.getDocument(documentId);
    return doc ? doc.versions.sort((a, b) => b.version - a.version) : [];
  }

  compareVersions(documentId: string, version1: number, version2: number): {
    added: string[];
    removed: string[];
    modified: string[];
  } {
    const v1 = this.getVersion(documentId, version1);
    const v2 = this.getVersion(documentId, version2);
    
    if (!v1 || !v2) {
      return { added: [], removed: [], modified: [] };
    }

    const words1 = v1.content.toLowerCase().split(/\s+/);
    const words2 = v2.content.toLowerCase().split(/\s+/);
    
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    const added = Array.from(set2).filter(word => !set1.has(word));
    const removed = Array.from(set1).filter(word => !set2.has(word));
    const modified = v1.changes.concat(v2.changes);
    
    return { added, removed, modified };
  }

  getAllDocuments(): VersionedDocument[] {
    return Array.from(this.versionedDocuments.values()).sort((a, b) => {
      const aLatest = Math.max(...a.versions.map(v => v.createdAt.getTime()));
      const bLatest = Math.max(...b.versions.map(v => v.createdAt.getTime()));
      return bLatest - aLatest;
    });
  }

  deleteDocument(documentId: string): boolean {
    const deleted = this.versionedDocuments.delete(documentId);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }
}
