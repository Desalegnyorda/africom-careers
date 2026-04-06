import React, { useState } from 'react';
import { FaCloudUploadAlt, FaFilePdf, FaTimes } from 'react-icons/fa';

interface ResumeUploadProps {
  setFile: (f: File | null) => void;
  currentFile?: File | null;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ setFile, currentFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');

  const validateFile = (file: File): boolean => {
    // Reset error
    setError('');

    // Check file type
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return false;
    }

    // Check file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      return false;
    }

    return true;
  };

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setFile(null);
      return;
    }

    if (validateFile(file)) {
      setFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = () => {
    setFile(null);
    setError('');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (currentFile) {
    return (
      <div className="border-2 border-green-200 bg-green-50 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FaFilePdf className="text-4xl text-red-500" />
            <div>
              <p className="font-medium text-gray-800">{currentFile.name}</p>
              <p className="text-sm text-gray-500">{formatFileSize(currentFile.size)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
            title="Remove file"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer relative ${
          isDragging
            ? 'border-blue-400 bg-blue-50'
            : 'border-blue-100 hover:bg-blue-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
          className="absolute inset-0 opacity-0 cursor-pointer"
          accept=".pdf"
        />
        <FaCloudUploadAlt className="mx-auto text-5xl text-blue-200 mb-4" />
        <p className="text-gray-600 font-medium">
          {isDragging ? 'Drop your CV here' : 'Click to upload or drag and drop'}
        </p>
        <p className="text-xs text-gray-400 mt-1">PDF only, Maximum size 5MB</p>
      </div>
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;