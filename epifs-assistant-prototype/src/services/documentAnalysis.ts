import { Question } from '../types';

export interface AnalyseDocumentRequest {
  file: File;
  questions: Question[];
  onProgress?: (progress: number) => void;
}

export interface AnalyseDocumentResponse {
  answers: Question[];
}

/**
 * Converts a File to base64 string for API transmission
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remove data URL prefix (e.g., "data:application/pdf;base64,")
      const base64Content = base64.split(',')[1];
      resolve(base64Content);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Reads file as text (for text files)
 */
async function fileToText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * Analyzes a document using AI API to answer the provided questions
 * 
 * NOTE: This is a placeholder implementation. In production, you would:
 * 1. Send the file to your backend server
 * 2. Your backend would process the file (extract text, handle PDFs, etc.)
 * 3. Your backend would call AI API with the document content and questions
 * 4. Return the answers
 * 
 * For now, this simulates an API call with mock responses.
 */
export async function analyseDocument({
  file,
  questions,
  onProgress
}: AnalyseDocumentRequest): Promise<AnalyseDocumentResponse> {
  
  // Simulate progress updates
  if (onProgress) onProgress(10);
  
  // Simulate file upload delay
  await new Promise(resolve => setTimeout(resolve, 500));
  if (onProgress) onProgress(30);
  
  try {
    // In a real implementation, you would:
    // 1. Convert file to appropriate format
    // 2. Send to your backend API
    // 3. Backend extracts text from document
    // 4. Backend calls AI API
    
    // For text files, we can read the content
    let documentContent = '';
    if (file.type === 'text/plain') {
      documentContent = await fileToText(file);
    } else {
      // For other file types (PDF, DOCX), you'd need backend processing
      documentContent = `[Document: ${file.name}] - Content extraction would be done by backend`;
    }
    
    if (onProgress) onProgress(50);
    
    // TODO: Replace with actual API call
    // Example API call structure:
    /*
    const response = await fetch('/api/analyse-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        fileContent: await fileToBase64(file),
        questions: questions.map(q => q.question)
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return { answers: data.answers };
    */
    
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (onProgress) onProgress(80);
    
    // Mock responses based on document content
    const mockAnswers = questions.map((q, idx) => {
      let answer = '';
      
      // Generate contextual mock answers
      if (q.question.toLowerCase().includes('background')) {
        answer = `Based on the document "${file.name}", TNO requires existing knowledge in artificial intelligence and machine learning technologies. The background includes prior research in neural networks and data processing systems.`;
      } else if (q.question.toLowerCase().includes('access rights')) {
        answer = 'Yes, TNO has full access rights to the required background IP. There are no contractual limitations.';
      } else if (q.question.toLowerCase().includes('partners need access')) {
        answer = 'Partners will need limited access rights for implementation purposes only, not for commercial exploitation.';
      } else if (q.question.toLowerCase().includes('results') && q.question.toLowerCase().includes('ipr')) {
        answer = 'The TNO results will consist of software modules, algorithms, and technical documentation related to the project deliverables.';
      } else if (q.question.toLowerCase().includes('joint ip')) {
        answer = 'TNO will develop most results independently. Some components may be jointly owned with Partner A for the integration layer.';
      } else if (q.question.toLowerCase().includes('operate on itself')) {
        answer = 'The TNO results will be functional standalone, though integration with partner APIs may enhance capabilities.';
      } else {
        answer = `Response to question ${idx + 1} based on document analysis would appear here. This is a placeholder pending actual AI API integration.`;
      }
      
      return {
        question: q.question,
        answer: answer
      };
    });
    
    if (onProgress) onProgress(100);
    
    return {
      answers: mockAnswers
    };
    
  } catch (error) {
    throw new Error(`Failed to analyze document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Configuration for AI API (to be set via environment variables)
 */
export const API_CONFIG = {
  // Set these in your .env file:
  // REACT_APP_API_ENDPOINT=https://your-backend.com/api
  // REACT_APP_AI_API_KEY=your-api-key
  endpoint: process.env.REACT_APP_API_ENDPOINT || '/api',
  maxRetries: 3,
  timeout: 60000, // 60 seconds
};
