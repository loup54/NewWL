-- Create documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  size INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_id UUID REFERENCES auth.users(id)
);

-- Create document_analyses table
CREATE TABLE document_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  themes JSONB NOT NULL,
  keyword_matches JSONB NOT NULL,
  readability_scores JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create document_comparisons table
CREATE TABLE document_comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document1_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  document2_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  theme_similarity JSONB NOT NULL,
  keyword_overlap JSONB NOT NULL,
  readability_comparison JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_document_analyses_document_id ON document_analyses(document_id);
CREATE INDEX idx_document_comparisons_documents ON document_comparisons(document1_id, document2_id);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_comparisons ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own documents"
  ON documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own document analyses"
  ON document_analyses FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM documents
    WHERE documents.id = document_analyses.document_id
    AND documents.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own document analyses"
  ON document_analyses FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM documents
    WHERE documents.id = document_analyses.document_id
    AND documents.user_id = auth.uid()
  ));

CREATE POLICY "Users can view their own document comparisons"
  ON document_comparisons FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM documents
    WHERE (documents.id = document_comparisons.document1_id OR documents.id = document_comparisons.document2_id)
    AND documents.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own document comparisons"
  ON document_comparisons FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM documents
    WHERE (documents.id = document_comparisons.document1_id OR documents.id = document_comparisons.document2_id)
    AND documents.user_id = auth.uid()
  )); 