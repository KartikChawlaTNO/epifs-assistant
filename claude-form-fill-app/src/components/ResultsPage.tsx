import React from 'react';

interface ResultsPageProps {
  file: File;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ file }) => {
  return (
    <div className="results-page">
      <h2>Results for: <span className="file-name">{file.name}</span></h2>
      <div className="results-placeholder">
        <p>Results will be shown here after processing the uploaded document.</p>
      </div>
    </div>
  );
};

export default ResultsPage;
