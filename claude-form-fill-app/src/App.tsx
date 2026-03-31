
import React, { useState } from 'react';
import FileUpload from './components/FileUpload';

const annex3Questions = [
    { question: 'Is Background (existing knowledge) of TNO required to achieve the TNO Results or do you (basically) start from scratch? If yes, please describe/specify the Background.', answer: '' },
    { question: 'Does TNO have the required access rights to the needed Background? In other words: is TNO not limited to use and give access rights to its Background due to other contractual obligations (e.g. licenses)?', answer: '' },
    { question: 'Do partners need access rights to TNO Background for the implementation of the Project?', answer: '' },
    { question: 'Do partners need access rights to TNO Background to be able to use their Results after the Project?', answer: '' },
    { question: 'Does TNO need access rights to Background or Results of partners for the implementation of the Project?', answer: '' },
    { question: 'What will be the Results (in terms of IPR/Foreground) for TNO?', answer: '' },
    { question: 'Do partners need access rights to the TNO Results to be able to use their Results of the project after the Project?', answer: '' },
    { question: 'Will TNO realize the Results on its own or will other Partners also create and own part of these Results (resulting in Joint IP)? Please specify.', answer: '' },
    { question: 'Will the TNO Results be able to operate on itself after the project or is access to Background or Results of other Partners necessary to be able to use these Results?', answer: '' },
];

const App: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [answers, setAnswers] = useState(annex3Questions);
    const [openIndexes, setOpenIndexes] = useState<number[]>([]);

    const toggleOpen = (idx: number) => {
        setOpenIndexes((prev) =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    };

    const handleFileSelected = (file: File) => {
        setSelectedFile(file);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#226eb1', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif' }}>
            <main style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}>
                <div style={{ width: '100%', maxWidth: '600px' }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#000' }}>EPIFs Assistant</h1>
                        <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Upload your document and get instant answers</p>
                    </div>

                    {/* Upload Card */}
                    <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
                        <FileUpload onFileSelected={handleFileSelected} selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
                        {selectedFile && (
                            <button
                                style={{
                                    marginTop: '1rem',
                                    width: '100%',
                                    padding: '0.5rem',
                                    backgroundColor: '#4f46e5',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.375rem',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    fontSize: '0.875rem'
                                }}
                            >
                                Analyse
                            </button>
                        )}
                    </div>

                    {/* Questions List - Always Visible */}
                    <div>
                        <h2 style={{ fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#111111', marginBottom: '1rem' }}>Annex 3 Questions</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {answers.map((item, idx) => {
                                const isOpen = openIndexes.includes(idx);
                                return (
                                    <div
                                        key={idx}
                                        style={{
                                            backgroundColor: '#1e293b',
                                            border: '1px solid #334155',
                                            borderRadius: '0.375rem',
                                            padding: '1rem',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => toggleOpen(idx)}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                                            <span style={{ fontSize: '0.875rem', flex: 1 }}>{item.question}</span>
                                            <span style={{ color: '#4f46e5', fontSize: '1rem', flexShrink: 0 }}>{isOpen ? '−' : '+'}</span>
                                        </div>
                                        {isOpen && (
                                            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #334155', fontSize: '0.875rem', color: '#cbd5e1' }}>
                                                {selectedFile ? (item.answer || '(No answer)') : '(No answer)'}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        {!selectedFile && (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
                                Upload a file above to see answers populated here
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer style={{ textAlign: 'center', padding: '1rem', color: '#64748b', fontSize: '0.75rem', borderTop: '1px solid #334155' }}>
                © {new Date().getFullYear()} EPIFs Assistant
            </footer>
        </div>
    );
}

export default App;