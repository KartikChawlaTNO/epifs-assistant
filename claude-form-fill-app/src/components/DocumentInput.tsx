import React, { useState } from 'react';

const DocumentInput: React.FC<{ onSubmit: (document: string) => void }> = ({ onSubmit }) => {
    const [document, setDocument] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDocument(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(document);
        setDocument('');
    };

    return (
        <form onSubmit={handleSubmit} className="document-input">
            <textarea
                value={document}
                onChange={handleChange}
                placeholder="Input your document here..."
                rows={10}
                className="document-textarea"
            />
            <button type="submit" className="submit-button">Submit</button>
        </form>
    );
};

export default DocumentInput;