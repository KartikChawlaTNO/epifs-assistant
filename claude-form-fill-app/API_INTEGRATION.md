# EPIFs Assistant - Claude Integration Guide

## Overview

This application helps analyze documents and automatically answer Annex 3 questions for TNO projects. The current implementation includes a **mock API service** that simulates document processing. This guide explains how to integrate with the real Claude API.

## Current Implementation Status

✅ **Completed Features:**
- React 18 with TypeScript
- Tailwind CSS styling
- File upload with drag-and-drop
- File validation (type & size)
- Error handling and boundaries
- Loading states with progress indicator
- Mock document analysis service
- Unit tests

## Architecture

```
src/
├── components/
│   ├── ErrorBoundary.tsx      # Error boundary wrapper
│   ├── FileUpload.tsx          # File upload component
│   └── *.test.tsx              # Component tests
├── services/
│   └── documentAnalysis.ts     # API service (currently mocked)
├── constants/
│   └── questions.ts            # Annex 3 questions definition
├── types/
│   └── index.ts                # TypeScript interfaces
└── App.tsx                     # Main application
```

## Integrating Claude API

### Option 1: Direct API Integration (Not Recommended for Production)

**⚠️ Warning:** Never expose your Claude API key in client-side code.

For development/testing only:

1. Create a `.env` file in the project root:
```env
REACT_APP_CLAUDE_API_KEY=your_api_key_here
REACT_APP_API_ENDPOINT=https://api.anthropic.com/v1/messages
```

2. Update `src/services/documentAnalysis.ts` to use the real API.

### Option 2: Backend Proxy (Recommended)

Create a backend service that:
1. Receives file uploads from the React app
2. Extracts text from documents (PDF, DOCX, etc.)
3. Calls Claude API securely
4. Returns answers to the client

#### Backend Requirements:
- File upload handling
- Document parsing (use libraries like `pdf-parse`, `mammoth` for DOCX)
- Claude API integration
- Error handling and rate limiting

#### Example Backend Flow:

```javascript
// Backend endpoint: POST /api/analyse-document
async function analyseDocument(req, res) {
  try {
    // 1. Extract text from uploaded file
    const documentText = await extractText(req.file);
    
    // 2. Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Analyze this document and answer the following questions:\n\n${documentText}\n\nQuestions:\n${questions.join('\n')}`
        }]
      })
    });
    
    const data = await response.json();
    
    // 3. Parse and return answers
    res.json({ answers: parseAnswers(data.content) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

#### Update Frontend Service:

Replace the mock implementation in `src/services/documentAnalysis.ts`:

```typescript
export async function analyseDocument({
  file,
  questions,
  onProgress
}: AnalyseDocumentRequest): Promise<AnalyseDocumentResponse> {
  
  if (onProgress) onProgress(10);
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('questions', JSON.stringify(questions));
  
  if (onProgress) onProgress(30);
  
  try {
    const response = await fetch(`${API_CONFIG.endpoint}/analyse-document`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    if (onProgress) onProgress(80);
    
    const data = await response.json();
    
    if (onProgress) onProgress(100);
    
    return { answers: data.answers };
  } catch (error) {
    throw new Error(`Failed to analyze document: ${error.message}`);
  }
}
```

## Document Processing Libraries

For backend text extraction:

**PDF:**
```bash
npm install pdf-parse
```

**DOCX:**
```bash
npm install mammoth
```

**Example:**
```javascript
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function extractText(file) {
  if (file.mimetype === 'application/pdf') {
    const dataBuffer = fs.readFileSync(file.path);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } else if (file.mimetype.includes('wordprocessingml')) {
    const result = await mammoth.extractRawText({ path: file.path });
    return result.value;
  }
  // text/plain
  return fs.readFileSync(file.path, 'utf8');
}
```

## Claude API Best Practices

1. **Prompt Engineering:**
   - Provide clear context about the document type
   - Structure questions clearly
   - Request structured output (JSON)

2. **Token Management:**
   - Claude 3 Sonnet: 200K context window
   - Estimate: ~4 chars = 1 token
   - Set appropriate max_tokens

3. **Error Handling:**
   - Rate limiting (429 errors)
   - Token limit exceeded (400 errors)
   - Implement retry logic with exponential backoff

4. **Security:**
   - Never expose API keys client-side
   - Validate file uploads
   - Sanitize user inputs
   - Implement authentication

## Environment Variables

Create `.env` file:
```env
# Frontend (React)
REACT_APP_API_ENDPOINT=http://localhost:3001/api

# Backend (Node.js)
CLAUDE_API_KEY=your_claude_api_key
PORT=3001
ALLOWED_ORIGINS=http://localhost:3000
MAX_FILE_SIZE=10485760
```

## Running Tests

```bash
npm test                  # Run all tests
npm test -- --coverage   # With coverage report
npm test -- --watch      # Watch mode
```

## Development

```bash
npm install              # Install dependencies
npm start                # Start dev server (port 3000)
npm run build            # Production build
npm test                 # Run tests
```

## Production Deployment

1. Build the React app: `npm run build`
2. Deploy `build/` folder to static hosting (Vercel, Netlify, etc.)
3. Deploy backend service separately
4. Configure CORS and environment variables
5. Set up monitoring and error tracking

## Security Considerations

- ✅ File type validation implemented
- ✅ File size limits (10MB)
- ⚠️ Add virus scanning for production
- ⚠️ Implement user authentication
- ⚠️ Add API rate limiting
- ⚠️ Encrypt sensitive data in transit/rest
- ⚠️ Add audit logging

## Next Steps

1. Set up backend server (Express, FastAPI, etc.)
2. Implement document text extraction
3. Integrate Claude API
4. Add user authentication
5. Deploy to production
6. Monitor usage and costs

## Support & Documentation

- [Claude API Documentation](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## License

MIT
