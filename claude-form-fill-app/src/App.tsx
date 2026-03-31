
import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ErrorBoundary from './components/ErrorBoundary';
import { ANNEX_3_QUESTIONS } from './constants/questions';
import { Question, ProcessingState } from './types';
import { analyseDocument } from './services/documentAnalysis';

const App: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [answers, setAnswers] = useState<Question[]>(ANNEX_3_QUESTIONS);
    const [openIndexes, setOpenIndexes] = useState<number[]>([]);
    const [processingState, setProcessingState] = useState<ProcessingState>({
        isProcessing: false,
        error: null,
        progress: 0,
        successMessage: null
    });

    const toggleOpen = (idx: number) => {
        setOpenIndexes((prev) =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    };

    const handleFileSelected = (file: File) => {
        setSelectedFile(file);
        setProcessingState({ isProcessing: false, error: null, progress: 0, successMessage: null });
        // Reset answers to empty
        setAnswers(ANNEX_3_QUESTIONS);
    };

    const handleAnalyse = async () => {
        if (!selectedFile) return;
        
        setProcessingState({ isProcessing: true, error: null, progress: 0, successMessage: null });
        
        try {
            const result = await analyseDocument({
                file: selectedFile,
                questions: answers,
                onProgress: (progress) => {
                    setProcessingState(prev => ({ ...prev, progress }));
                }
            });
            
            setAnswers(result.answers);
            setProcessingState({ 
                isProcessing: false, 
                error: null, 
                progress: 100,
                successMessage: 'Document analyzed successfully!'
            });
            
            // Clear success message after 5 seconds
            setTimeout(() => {
                setProcessingState(prev => ({ ...prev, successMessage: null }));
            }, 5000);
        } catch (error) {
            setProcessingState({ 
                isProcessing: false, 
                error: error instanceof Error ? error.message : 'Failed to process document. Please try again.',
                progress: 0,
                successMessage: null
            });
        }
    };

    return (
        <ErrorBoundary>
            <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200 font-sans">
                <main className="flex-1 flex justify-center p-8 px-4">
                    <div className="w-full max-w-2xl">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold mb-2 text-white">EPIFs Assistant</h1>
                            <p className="text-sm text-slate-400">Upload your document and get instant answers</p>
                        </div>

                        {/* Upload Card */}
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
                            <FileUpload 
                                onFileSelected={handleFileSelected} 
                                selectedFile={selectedFile} 
                                setSelectedFile={setSelectedFile} 
                            />
                            {selectedFile && (
                                <>
                                    <button
                                        onClick={handleAnalyse}
                                        disabled={processingState.isProcessing}
                                        className="mt-4 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white border-none rounded-md cursor-pointer font-medium text-sm transition-colors"
                                        aria-label="Analyse document"
                                    >
                                        {processingState.isProcessing ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" 
                                                      role="status" 
                                                      aria-label="Processing"></span>
                                                Processing...
                                            </span>
                                        ) : (
                                            'Analyse'
                                        )}
                                    </button>
                                    
                                    {/* Progress Bar */}
                                    {processingState.isProcessing && (
                                        <div className="mt-4">
                                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                                <span>Processing document</span>
                                                <span>{processingState.progress}%</span>
                                            </div>
                                            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                                                <div 
                                                    className="bg-indigo-600 h-full transition-all duration-300 ease-out"
                                                    style={{ width: `${processingState.progress}%` }}
                                                    role="progressbar"
                                                    aria-valuenow={processingState.progress}
                                                    aria-valuemin={0}
                                                    aria-valuemax={100}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                            {processingState.error && (
                                <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-md text-red-300 text-sm" role="alert">
                                    <span className="font-semibold">Error: </span>{processingState.error}
                                </div>
                            )}
                            {processingState.successMessage && (
                                <div className="mt-4 p-3 bg-green-900/20 border border-green-800 rounded-md text-green-300 text-sm" role="alert">
                                    <span className="font-semibold">✓ </span>{processingState.successMessage}
                                </div>
                            )}
                        </div>

                        {/* Questions List - Always Visible */}
                        <div>
                            <h2 className="text-xs font-semibold tracking-wider uppercase text-slate-300 mb-4">Annex 3 Questions</h2>
                            <div className="flex flex-col gap-3">
                                {answers.map((item, idx) => {
                                    const isOpen = openIndexes.includes(idx);
                                    return (
                                        <div
                                            key={idx}
                                            className="bg-slate-800 border border-slate-700 rounded-md p-4 cursor-pointer hover:border-slate-600 transition-colors"
                                            onClick={() => toggleOpen(idx)}
                                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleOpen(idx)}
                                            role="button"
                                            tabIndex={0}
                                            aria-expanded={isOpen}
                                            aria-label={`Question ${idx + 1}: ${item.question}`}
                                        >
                                            <div className="flex justify-between items-start gap-3">
                                                <span className="text-sm flex-1">{item.question}</span>
                                                <span 
                                                    className="text-indigo-400 text-base flex-shrink-0 font-bold"
                                                    aria-hidden="true"
                                                >
                                                    {isOpen ? '−' : '+'}
                                                </span>
                                            </div>
                                            {isOpen && (
                                                <div className="mt-3 pt-3 border-t border-slate-700 text-sm text-slate-300">
                                                    {item.answer ? item.answer : <em className="text-slate-500">(No answer yet - upload and analyse a document)</em>}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            {!selectedFile && (
                                <div className="p-8 text-center text-slate-500 text-sm">
                                    Upload a file above to see answers populated here
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="text-center py-4 text-slate-500 text-xs border-t border-slate-800">
                    © {new Date().getFullYear()} EPIFs Assistant
                </footer>
            </div>
        </ErrorBoundary>
    );
}

export default App;