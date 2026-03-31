import React, { useRef, useState } from 'react';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected, selectedFile, setSelectedFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  return (
    <>
      {!selectedFile && (
        <div
          style={{
            width: '100%',
            minWidth: 0,
            boxSizing: 'border-box',
            border: '2px dashed #475569',
            borderRadius: '0.375rem',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#4f46e5';
            e.currentTarget.style.backgroundColor = '#0f172a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#475569';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          tabIndex={0}
          onClick={handleBoxClick}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleBoxClick()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          aria-label="File upload area"
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,text/plain"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
            tabIndex={-1}
          />
          <span style={{ fontSize: '2rem' }}>📤</span>
          <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>Drop your file here or click</span>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>PDF, DOCX, or TXT</span>
        </div>
      )}
      {selectedFile && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.375rem',
            backgroundColor: '#334155',
            fontSize: '0.875rem',
            color: '#cbd5e1'
          }}>
            <span>📄</span>
            <span>{selectedFile.name.substring(0, 20)}</span>
            <span style={{ color: '#64748b', fontSize: '0.75rem' }}>({(selectedFile.size / 1024).toFixed(1)}KB)</span>
            <button
              type="button"
              style={{
                marginLeft: '0.5rem',
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#4f46e5')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
              aria-label="Remove file"
              onClick={() => setSelectedFile(null)}
            >
              ✕
            </button>
          </span>
        </div>
      )}
    </>
  );
};

export default FileUpload;
