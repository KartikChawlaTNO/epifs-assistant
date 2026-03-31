import { analyseDocument } from './documentAnalysis';
import { Question } from '../types';

describe('documentAnalysis Service', () => {
  const mockQuestions: Question[] = [
    { question: 'Test question 1', answer: '' },
    { question: 'Test question 2', answer: '' }
  ];

  it('analyzes document and returns answers', async () => {
    const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    
    const result = await analyseDocument({
      file: mockFile,
      questions: mockQuestions
    });

    expect(result.answers).toHaveLength(mockQuestions.length);
    expect(result.answers[0].question).toBe('Test question 1');
    expect(result.answers[0].answer).toBeTruthy();
  });

  it('calls progress callback during processing', async () => {
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const progressCallback = jest.fn();

    await analyseDocument({
      file: mockFile,
      questions: mockQuestions,
      onProgress: progressCallback
    });

    expect(progressCallback).toHaveBeenCalled();
    expect(progressCallback).toHaveBeenCalledWith(expect.any(Number));
    // Should be called with 100 at the end
    expect(progressCallback).toHaveBeenCalledWith(100);
  });

  it('handles text file content', async () => {
    const textContent = 'Sample document content';
    const mockFile = new File([textContent], 'test.txt', { type: 'text/plain' });

    const result = await analyseDocument({
      file: mockFile,
      questions: mockQuestions
    });

    expect(result.answers).toBeDefined();
    expect(result.answers.length).toBe(mockQuestions.length);
  });

  it('processes different file types', async () => {
    const pdfFile = new File(['pdf'], 'test.pdf', { type: 'application/pdf' });
    const docxFile = new File(['docx'], 'test.docx', { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });

    const pdfResult = await analyseDocument({ file: pdfFile, questions: mockQuestions });
    const docxResult = await analyseDocument({ file: docxFile, questions: mockQuestions });

    expect(pdfResult.answers).toBeDefined();
    expect(docxResult.answers).toBeDefined();
  });

  it('generates contextual answers based on question content', async () => {
    const questionsWithKeywords: Question[] = [
      { question: 'Is background knowledge required?', answer: '' },
      { question: 'Do partners need access rights?', answer: '' }
    ];

    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const result = await analyseDocument({
      file: mockFile,
      questions: questionsWithKeywords
    });

    // Check that answers contain contextual information
    const backgroundAnswer = result.answers[0].answer.toLowerCase();
    expect(backgroundAnswer).toContain('background');

    const accessAnswer = result.answers[1].answer.toLowerCase();
    expect(accessAnswer).toContain('access');
  });
});
