import React, { useState, useRef } from 'react';
import { Upload, FileText, Music, Video as VideoIcon, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadStepProps {
  onUpload: (file: File) => void;
  onBack?: () => void;
}

const UploadStep: React.FC<UploadStepProps> = ({ onUpload, onBack }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isValidFile(droppedFile)) {
      simulateUpload(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isValidFile(selectedFile)) {
      simulateUpload(selectedFile);
    }
  };

  const isValidFile = (file: File) => {
    const validExtensions = ['.vtt', '.txt', '.md', '.csv'];
    const extension = '.' + (file.name.split('.').pop()?.toLowerCase() || '');
    return file.type.startsWith('audio/') || 
           file.type.startsWith('video/') || 
           file.type.startsWith('text/') || 
           validExtensions.includes(extension);
  };

  const simulateUpload = (file: File) => {
    setFile(file);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('video')) return <VideoIcon size={32} />;
    if (file.type.includes('audio')) return <Music size={32} />;
    return <FileText size={32} />;
  };

  return (
    <div className="upload-step">
      <div 
        className={`drop-zone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !file && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="audio/*,video/*,text/*,.vtt,.md,.csv"
        />

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="drop-zone-content"
            >
              <div className="upload-icon-wrapper">
                <Upload size={48} className="upload-icon" />
              </div>
              <h3>Drop your meeting record here</h3>
              <p>Supports all Audio, Video, VTT & Text files</p>
              <button className="browse-btn">Browse Files</button>
            </motion.div>
          ) : (
            <motion.div 
              key="file"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="file-preview-card"
            >
              <div className="file-info">
                <div className="file-type-icon">
                  {getFileIcon(file)}
                </div>
                <div className="file-details">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
                <button className="remove-file-btn" onClick={(e) => { e.stopPropagation(); removeFile(); }}>
                  <X size={20} />
                </button>
              </div>

              <div className="progress-container">
                <div className="progress-bar-wrapper">
                  <motion.div 
                    className="progress-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="progress-status">
                  <span>{uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : 'Upload Complete'}</span>
                  {uploadProgress === 100 && <CheckCircle2 size={16} className="success-icon" />}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="step-actions" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        {onBack && (
          <button className="secondary-btn" onClick={onBack}>
            Back
          </button>
        )}
        <button 
          className="primary-btn" 
          disabled={!file || uploadProgress < 100}
          onClick={() => file && onUpload(file)}
          style={!onBack ? { marginLeft: 'auto' } : {}}
        >
          Continue to Configuration
        </button>
      </div>
    </div>
  );
};

export default UploadStep;
