# WordLens: Intelligent Document Analysis Tool

## Overview
WordLens is an intelligent document analysis tool that helps users analyze and compare documents using AI-powered theme extraction, keyword analysis, and readability metrics.

## Core Features

### Document Analysis
- **Theme Extraction**: Identifies key themes in documents using OpenAI's GPT-4
- **Keyword Analysis**: Tracks keyword frequency and context
- **Readability Metrics**: Calculates various readability scores:
  - Flesch-Kincaid Grade Level
  - Flesch Reading Ease
  - Coleman-Liau Index
  - Automated Readability Index

### Document Comparison
- **Theme Similarity**: Compares themes between documents
- **Keyword Overlap**: Analyzes shared and unique keywords
- **Readability Comparison**: Side-by-side comparison of readability metrics

### User Interface
- **Document Upload**: Drag-and-drop interface for file uploads
- **Analysis Display**: Clear visualization of analysis results
- **Comparison View**: Intuitive comparison of multiple documents
- **Responsive Design**: Works on desktop and mobile devices

## Technical Implementation

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Component-based architecture
- Responsive design patterns

### AI Integration
- OpenAI GPT-4 for theme extraction
- Custom prompts for analysis and comparison
- Error handling and retry mechanisms

### Data Processing
- File type validation
- Content extraction
- Theme and keyword processing
- Readability calculations

## Proposed Improvements

### Document Processing
- [ ] Implement proper file type validation and parsing
- [ ] Add file size limits and validation
- [ ] Add progress indicators for large file uploads
- [ ] Support for more document formats

### Analysis Features
- [ ] Add "Save Analysis" feature for local storage
- [ ] Implement history view of previous analyses
- [ ] Add export functionality (PDF/CSV)
- [ ] Batch processing for multiple documents

### UI/UX Improvements
- [ ] Add loading states for all operations
- [ ] Implement error boundaries
- [ ] Add tooltips for readability metrics
- [ ] Add "Clear" button for comparisons
- [ ] Improve mobile responsiveness

### Performance
- [ ] Implement basic caching of analysis results
- [ ] Add debouncing for file uploads
- [ ] Optimize theme extraction process
- [ ] Add lazy loading for large documents

### Database Integration (Planned)
- [ ] Supabase integration for data persistence
- [ ] User authentication and authorization
- [ ] Document storage and retrieval
- [ ] Analysis history tracking
- [ ] User preferences storage

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- OpenAI API key
- Supabase account (for upcoming integration)

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   ```
   REACT_APP_OPENAI_API_KEY=your_api_key
   ```
4. Start the development server: `npm start`

### Usage
1. Upload a document using the drag-and-drop interface
2. Click "Analyze" to process the document
3. View the analysis results
4. For comparison, upload a second document and click "Compare"

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details. 