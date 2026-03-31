export interface Question {
  question: string;
  answer: string;
}

export interface FileUploadProps {
  onFileSelected: (file: File) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}

export interface ProcessingState {
  isProcessing: boolean;
  error: string | null;
  progress: number;
  successMessage: string | null;
}
