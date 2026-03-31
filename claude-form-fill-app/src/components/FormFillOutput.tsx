import React from 'react';

interface FormFillOutputProps {
    outputData: Record<string, any>;
}

const FormFillOutput: React.FC<FormFillOutputProps> = ({ outputData }) => {
    return (
        <div className="form-fill-output">
            <h2>Automated Form Fill Output</h2>
            <div>
                {Object.entries(outputData).map(([key, value]) => (
                    <div key={key} className="output-item">
                        <strong>{key}:</strong> {value}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FormFillOutput;