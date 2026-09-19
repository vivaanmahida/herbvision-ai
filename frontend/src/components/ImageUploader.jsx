import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudUpload, AlertCircle, Loader, X, FileImage } from 'lucide-react';

const ImageUploader = ({ onPrediction }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setError(null);
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onPrediction(response.data, file);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze the image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        {...getRootProps()} 
        className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 cursor-pointer overflow-hidden
          ${isDragActive ? 'border-[#e8a045] bg-[rgba(232,160,69,0.04)]' : 'border-[rgba(232,160,69,0.2)] bg-[#1a1410] hover:border-[rgba(232,160,69,0.5)]'}
        `}
      >
        <input {...getInputProps()} />
        
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#1a1410]/90 backdrop-blur-sm">
            <Loader className="w-10 h-10 text-[#e8a045] animate-spin mb-4" />
            <p className="text-[#fdf6e3] font-medium text-lg">Analyzing Herb...</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="upload-prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center space-y-4 py-10"
            >
              <div className="p-4 rounded-full bg-[rgba(232,160,69,0.05)] border border-[rgba(232,160,69,0.15)]">
                <CloudUpload className="w-12 h-12 text-[#e8a045]" />
              </div>
              <div>
                <p className="text-xl font-medium text-[#fdf6e3] mb-2">Drag & Drop Image Here</p>
                <p className="text-sm" style={{ color: 'rgba(253,246,227,0.65)' }}>or click to browse from device</p>
              </div>
              <p className="text-xs" style={{ color: 'rgba(253,246,227,0.4)' }}>Supports JPG, PNG, WEBP up to 5MB</p>
            </motion.div>
          ) : (
            <motion.div
              key="file-preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center"
            >
              <div className="relative mb-6 p-2 rounded-xl border border-[rgba(232,160,69,0.3)] bg-[rgba(255,220,150,0.02)] inline-block">
                <button 
                  onClick={clearFile}
                  className="absolute -top-3 -right-3 p-1.5 rounded-full bg-[#1a1410] border border-[rgba(232,160,69,0.4)] text-[#e8a045] hover:bg-[rgba(232,160,69,0.1)] transition-colors z-20"
                >
                  <X className="w-4 h-4" />
                </button>
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-h-64 rounded-lg object-contain"
                />
              </div>
              <div className="flex items-center space-x-2 text-sm px-4 py-2 rounded-full border border-[rgba(232,160,69,0.15)] bg-[rgba(255,220,150,0.05)] text-[#fdf6e3]">
                <FileImage className="w-4 h-4 text-[#c4956a]" />
                <span className="truncate max-w-[200px]" style={{ color: 'rgba(253,246,227,0.65)' }}>{file.name}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, mt: 0 }}
            animate={{ opacity: 1, height: 'auto', mt: 16 }}
            exit={{ opacity: 0, height: 0, mt: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center space-x-2 p-4 rounded-xl border" style={{ backgroundColor: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.2)', color: '#fca5a5' }}>
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="mt-6 flex justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: file ? 1 : 0, y: file ? 0 : 10, pointerEvents: file ? 'auto' : 'none' }}
      >
        <button 
          onClick={handleSubmit}
          disabled={loading || !file}
          className="btn-gold w-full sm:w-auto px-8 py-3 text-lg font-medium rounded-xl flex items-center justify-center space-x-2"
        >
          <CloudUpload className="w-5 h-5" />
          <span>Identify Herb</span>
        </button>
      </motion.div>
    </div>
  );
};

export default ImageUploader;
