import React, { useRef, useState } from 'react';
import { FileUploadProps } from '../types';
import { ACCEPTED_FILE_TYPES, ACCEPTED_MIME_TYPES, MAX_FILE_SIZE } from '../constants/questions';

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected, selectedFile, setSelectedFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`;
    }

    // Check file type
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    
    if (!hasValidExtension) {
      return 'Invalid file type. Please upload PDF, DOC, DOCX, or TXT files only';
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validationError = validateFile(file);
      
      if (validationError) {
        setError(validationError);
        return;
      }
      
      onFileSelected(file);
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
    setError(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validationError = validateFile(file);
      
      if (validationError) {
        setError(validationError);
        return;
      }
      
      onFileSelected(file);
    }
  };

  const truncateFileName = (name: string, maxLength: number = 30): string => {
    if (name.length <= maxLength) return name;
    const extension = name.split('.').pop() || '';
    const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
    const truncatedName = nameWithoutExt.substring(0, maxLength - extension.length - 4);
    return `${truncatedName}...${extension}`;
  };

  return (
    <>
      {!selectedFile && (
        <>
          <div
            className={`w-full min-w-0 box-border border-2 border-dashed rounded-md p-8 flex flex-col items-center gap-3 cursor-pointer transition-all ${
              dragActive 
                ? 'border-indigo-500 bg-slate-900' 
                : error 
                  ? 'border-red-500 bg-red-900/10'
                  : 'border-slate-600 bg-transparent hover:border-indigo-500 hover:bg-slate-900'
            }`}
            tabIndex={0}
            onClick={handleBoxClick}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleBoxClick()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            role="button"
            aria-label="File upload area. Click to select a file or drag and drop"
            aria-describedby="file-upload-description"
          >
            <input
              type="file"
              accept={ACCEPTED_FILE_TYPES}
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              tabIndex={-1}
              aria-label="File input"
            />
            <span className="text-4xl" aria-hidden="true">📤</span>
            <span className="font-medium text-sm text-slate-200">Drop your file here or click to browse</span>
            <span id="file-upload-description" className="text-xs text-slate-400">
              PDF, DOCX, or TXT (max {MAX_FILE_SIZE / 1024 / 1024}MB)
            </span>
          </div>
          {error && (
            <div className="mt-3 p-3 bg-red-900/20 border border-red-800 rounded-md text-red-300 text-sm" role="alert">
              <span className="font-semibold">Error: </span>{error}
            </div>
          )}
        </>
      )}
      {selectedFile && (
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 py-2 px-3 rounded-md bg-slate-700 text-sm text-slate-300">
            <span aria-hidden="true">📄</span>
            <span title={selectedFile.name}>{truncateFileName(selectedFile.name)}</span>
            <span className="text-slate-500 text-xs">({(selectedFile.size / 1024).toFixed(1)}KB)</span>
            <button
              type="button"
              className="ml-2 bg-transparent border-none text-slate-500 hover:text-indigo-400 cursor-pointer text-base font-bold transition-colors"
              aria-label={`Remove file ${selectedFile.name}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
                setError(null);
              }}
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