import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Sparkles, ScanEye, Brain } from 'lucide-react';

import ImageUploader from '../components/ImageUploader';
import PredictionResults from '../components/PredictionResults';
import GradCAMViewer from '../components/GradCAMViewer';
import HerbInfoDashboard from '../components/HerbInfoDashboard';
import FeedbackPanel from '../components/FeedbackPanel';
import RAGChatbot from '../components/RAGChatbot';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function IdentifyPage() {
  const [prediction, setPrediction] = useState(null);
  const [herbData, setHerbData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const resultsRef = useRef(null);

  const handlePredictionComplete = async (result, file) => {
    if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl);

    setPrediction(result);
    setUploadedImage(file);

    if (file instanceof File || file instanceof Blob) {
      setUploadedImageUrl(URL.createObjectURL(file));
    } else if (typeof file === 'string') {
      setUploadedImageUrl(file);
    }

    if (result && result.herb_id) {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/herb/${result.herb_id}`);
        setHerbData(response.data);
      } catch (err) {
        console.error('Failed to fetch herb details:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (prediction && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [prediction]);

  return (
    <div className="min-h-screen bg-[#1a1410] text-[#fdf6e3] font-sans pb-24">
      {/* Header Banner */}
      <section className="py-16 bg-gradient-to-b from-[#221b14] to-[#1a1410] border-b border-[rgba(232,160,69,0.15)] text-center px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(232,160,69,0.3)] bg-[rgba(232,160,69,0.05)] mb-4">
              <ScanEye className="w-4 h-4 text-[#e8a045]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#e8a045]">AI Herb Identification</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif text-[#e8a045]" style={{ fontFamily: '"Playfair Display", serif' }}>
              Upload Herb & Classify
            </h1>
            <p className="max-w-xl mx-auto text-base text-[rgba(253,246,227,0.7)]">
              Powered by Computer Vision AI, Grad-CAM attention visualizer, and zero-shot neural classifiers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Uploader Container */}
      <section className="py-16 container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <ImageUploader onPrediction={handlePredictionComplete} />
        </motion.div>
      </section>

      {/* Results View */}
      {prediction && (
        <div ref={resultsRef} className="pt-8">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(232,160,69,0.2)] to-transparent" />
          
          <section className="py-16 container mx-auto px-4 bg-gradient-to-b from-[#1a1410] to-[#1e1713]">
            <div className="max-w-6xl mx-auto space-y-16">
              
              {/* Predictions & Grad-CAM */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <PredictionResults prediction={prediction} />
                <GradCAMViewer 
                  originalImage={uploadedImageUrl} 
                  gradcamImage={prediction.gradcam_image}
                  explanation={prediction.heatmap_explanation}
                />
              </div>

              {/* Herb Profile Dashboard */}
              {isLoading ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-[#e8a045]/30 border-t-[#e8a045] rounded-full animate-spin" />
                </div>
              ) : herbData ? (
                <HerbInfoDashboard herbData={herbData} />
              ) : null}

              {/* Feedback */}
              <div className="max-w-lg mx-auto">
                <FeedbackPanel 
                  predictedHerb={prediction.herb_name} 
                  confidence={prediction.confidence}
                  herbId={prediction.herb_id}
                />
              </div>

            </div>
          </section>
        </div>
      )}

      {/* Floating Chatbot */}
      <RAGChatbot 
        herbName={prediction?.herb_name} 
        herbId={prediction?.herb_id} 
      />
    </div>
  );
}
