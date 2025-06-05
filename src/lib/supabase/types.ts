export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string
          name: string
          type: string
          size: number
          content: string
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          size: number
          content: string
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          size?: number
          content?: string
          created_at?: string
          user_id?: string
        }
      }
      document_analyses: {
        Row: {
          id: string
          document_id: string
          themes: Json
          keyword_matches: Json
          readability_scores: Json
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          themes: Json
          keyword_matches: Json
          readability_scores: Json
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          themes?: Json
          keyword_matches?: Json
          readability_scores?: Json
          created_at?: string
        }
      }
      document_comparisons: {
        Row: {
          id: string
          document1_id: string
          document2_id: string
          theme_similarity: Json
          keyword_overlap: Json
          readability_comparison: Json
          created_at: string
        }
        Insert: {
          id?: string
          document1_id: string
          document2_id: string
          theme_similarity: Json
          keyword_overlap: Json
          readability_comparison: Json
          created_at?: string
        }
        Update: {
          id?: string
          document1_id?: string
          document2_id?: string
          theme_similarity?: Json
          keyword_overlap?: Json
          readability_comparison?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 