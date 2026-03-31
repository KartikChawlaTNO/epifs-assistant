import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FileUpload from './FileUpload';

describe('FileUpload Component', () => {
  const mockOnFileSelected = jest.fn();
  const mockSetSelectedFile = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders upload area when no file is selected', () => {
    render(
      <FileUpload
        onFileSelected={mockOnFileSelected}
        selectedFile={null}
        setSelectedFile={mockSetSelectedFile}
      />
    );

    expect(screen.getByText(/Drop your file here or click to browse/i)).toBeInTheDocument();
    expect(screen.getByText(/PDF, DOCX, or TXT/i)).toBeInTheDocument();
  });

  it('displays selected file information', () => {
    const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    Object.defineProperty(mockFile, 'size', { value: 1024 });

    render(
      <FileUpload
        onFileSelected={mockOnFileSelected}
        selectedFile={mockFile}
        setSelectedFile={mockSetSelectedFile}
      />
    );

    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(screen.getByText(/1\.0KB/i)).toBeInTheDocument();
  });

  it('validates file size', () => {
    const mockFile = new File(['test'], 'large.pdf', { type: 'application/pdf' });
    Object.defineProperty(mockFile, 'size', { value: 11 * 1024 * 1024 }); // 11MB

    render(
      <FileUpload
        onFileSelected={mockOnFileSelected}
        selectedFile={null}
        setSelectedFile={mockSetSelectedFile}
      />
    );

    const input = screen.getByLabelText(/File input/i);
    fireEvent.change(input, { target: { files: [mockFile] } });

    expect(screen.getByText(/File size exceeds/i)).toBeInTheDocument();
    expect(mockOnFileSelected).not.toHaveBeenCalled();
  });

  it('validates file type', () => {
    const mockFile = new File(['test'], 'test.exe', { type: 'application/x-msdownload' });

    render(
      <FileUpload
        onFileSelected={mockOnFileSelected}
        selectedFile={null}
        setSelectedFile={mockSetSelectedFile}
      />
    );

    const input = screen.getByLabelText(/File input/i);
    fireEvent.change(input, { target: { files: [mockFile] } });

    expect(screen.getByText(/Invalid file type/i)).toBeInTheDocument();
    expect(mockOnFileSelected).not.toHaveBeenCalled();
  });

  it('calls setSelectedFile when remove button is clicked', () => {
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });

    render(
      <FileUpload
        onFileSelected={mockOnFileSelected}
        selectedFile={mockFile}
        setSelectedFile={mockSetSelectedFile}
      />
    );

    const removeButton = screen.getByLabelText(/Remove file/i);
    fireEvent.click(removeButton);

    expect(mockSetSelectedFile).toHaveBeenCalledWith(null);
  });

  it('accepts valid file', () => {
    const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    Object.defineProperty(mockFile, 'size', { value: 1024 });

    render(
      <FileUpload
        onFileSelected={mockOnFileSelected}
        selectedFile={null}
        setSelectedFile={mockSetSelectedFile}
      />
    );

    const input = screen.getByLabelText(/File input/i);
    fireEvent.change(input, { target: { files: [mockFile] } });

    expect(mockOnFileSelected).toHaveBeenCalledWith(mockFile);
  });
});
