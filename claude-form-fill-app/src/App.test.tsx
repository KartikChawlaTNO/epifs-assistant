import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock the document analysis service
jest.mock('./services/documentAnalysis', () => ({
  analyseDocument: jest.fn(({ onProgress }) => {
    // Simulate progress updates
    if (onProgress) {
      onProgress(50);
      onProgress(100);
    }
    return Promise.resolve({
      answers: [
        { question: 'Question 1', answer: 'Answer 1' },
        { question: 'Question 2', answer: 'Answer 2' }
      ]
    });
  })
}));

describe('App Component', () => {
  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('EPIFs Assistant')).toBeInTheDocument();
  });

  it('displays upload prompt when no file is selected', () => {
    render(<App />);
    expect(screen.getByText(/Upload a file above to see answers/i)).toBeInTheDocument();
  });

  it('shows Analyse button when file is selected', async () => {
    render(<App />);
    
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/File input/i);
    
    fireEvent.change(input, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Analyse document/i })).toBeInTheDocument();
    });
  });

  it('processes document when Analyse is clicked', async () => {
    render(<App />);
    
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/File input/i);
    
    fireEvent.change(input, { target: { files: [mockFile] } });

    const analyseButton = await screen.findByRole('button', { name: /Analyse document/i });
    fireEvent.click(analyseButton);

    await waitFor(() => {
      expect(screen.getByText(/Document analyzed successfully/i)).toBeInTheDocument();
    });
  });

  it('displays questions list', () => {
    render(<App />);
    expect(screen.getByText(/Annex 3 Questions/i)).toBeInTheDocument();
  });

  it('toggles question expansion on click', () => {
    render(<App />);
    
    const questions = screen.getAllByRole('button');
    const firstQuestion = questions.find(q => q.getAttribute('aria-expanded') === 'false');
    
    if (firstQuestion) {
      fireEvent.click(firstQuestion);
      expect(firstQuestion.getAttribute('aria-expanded')).toBe('true');
    }
  });

  it('shows progress bar during processing', async () => {
    render(<App />);
    
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/File input/i);
    
    fireEvent.change(input, { target: { files: [mockFile] } });

    const analyseButton = await screen.findByRole('button', { name: /Analyse document/i });
    fireEvent.click(analyseButton);

    await waitFor(() => {
      expect(screen.getByText(/Processing document/i)).toBeInTheDocument();
    });
  });
});
