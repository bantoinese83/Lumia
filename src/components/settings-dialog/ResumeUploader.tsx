import React, { useState, useRef } from 'react';
import { GeminiService, DocumentAnalysis } from '../../services/geminiService';
import './resume-uploader.scss';

interface ResumeUploaderProps {
  onAnalysisComplete: (analysis: DocumentAnalysis) => void;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onAnalysisComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const geminiService = GeminiService.getInstance();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setFileName(file.name);

      const analysis = await geminiService.analyzeResume(file);
      onAnalysisComplete(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze resume');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setFileName(file.name);

      const analysis = await geminiService.analyzeResume(file);
      onAnalysisComplete(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze resume');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="form-group resume-uploader">
      <label>Resume Upload</label>
      <div
        className={`upload-area ${isUploading ? 'uploading' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        
        {isUploading ? (
          <div className="upload-status">
            <div className="spinner"></div>
            <p>Analyzing resume...</p>
          </div>
        ) : fileName ? (
          <div className="upload-status">
            <span className="material-symbols-outlined success">task_alt</span>
            <p>{fileName}</p>
          </div>
        ) : (
          <div className="upload-prompt">
            <span className="material-symbols-outlined">upload_file</span>
            <p>Drop your resume here or click to upload</p>
            <span className="file-type">PDF files only</span>
          </div>
        )}
      </div>
      
      {error && (
        <div className="error-message">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}
    </div>
  );
}; 