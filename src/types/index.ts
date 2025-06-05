
export interface Keyword {
  id: string;
  word: string;
  color: string;
  count: number;
}

export interface DocumentData {
  id: string;
  content: string;
  filename: string;
  uploadDate: Date;
  fileSize?: number;
  fileType?: string;
}
