
interface StoredDocument {
  id: string;
  filename: string;
  content: string;
  uploadDate: Date;
  lastModified: Date;
  size: number;
}

interface StoredKeywords {
  id: string;
  keywords: Array<{
    id: string;
    word: string;
    color: string;
    count: number;
  }>;
  lastModified: Date;
}

const DB_NAME = 'WordLensDB';
const DB_VERSION = 1;
const DOCUMENTS_STORE = 'documents';
const KEYWORDS_STORE = 'keywords';

class OfflineStorage {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(DOCUMENTS_STORE)) {
          const documentsStore = db.createObjectStore(DOCUMENTS_STORE, { keyPath: 'id' });
          documentsStore.createIndex('filename', 'filename', { unique: false });
          documentsStore.createIndex('uploadDate', 'uploadDate', { unique: false });
        }

        if (!db.objectStoreNames.contains(KEYWORDS_STORE)) {
          db.createObjectStore(KEYWORDS_STORE, { keyPath: 'id' });
        }
      };
    });
  }

  async saveDocument(document: StoredDocument): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([DOCUMENTS_STORE], 'readwrite');
      const store = transaction.objectStore(DOCUMENTS_STORE);
      const request = store.put(document);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getDocument(id: string): Promise<StoredDocument | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([DOCUMENTS_STORE], 'readonly');
      const store = transaction.objectStore(DOCUMENTS_STORE);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllDocuments(): Promise<StoredDocument[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([DOCUMENTS_STORE], 'readonly');
      const store = transaction.objectStore(DOCUMENTS_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteDocument(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([DOCUMENTS_STORE], 'readwrite');
      const store = transaction.objectStore(DOCUMENTS_STORE);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async saveKeywords(keywords: StoredKeywords): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([KEYWORDS_STORE], 'readwrite');
      const store = transaction.objectStore(KEYWORDS_STORE);
      const request = store.put(keywords);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getKeywords(id: string): Promise<StoredKeywords | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([KEYWORDS_STORE], 'readonly');
      const store = transaction.objectStore(KEYWORDS_STORE);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }
}

export const offlineStorage = new OfflineStorage();
export type { StoredDocument, StoredKeywords };
