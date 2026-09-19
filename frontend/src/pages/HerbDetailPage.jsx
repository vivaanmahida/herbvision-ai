import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import axios from 'axios';

import HerbInfoDashboard from '../components/HerbInfoDashboard';
import RAGChatbot from '../components/RAGChatbot';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function HerbDetailPage() {
  const { id } = useParams();
  const [herbData, setHerbData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHerbDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/api/herb/${id}`);
        setHerbData(response.data);
        document.title = `${response.data.name || 'Herb'} — HerbVision AI`;
      } catch (err) {
        console.error('Failed to fetch herb:', err);
        setError('Could not load herb details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchHerbDetails();
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-[#1a1410] text-[#fdf6e3] font-sans selection:bg-[#e8a045]/30 pb-24">
      {/* Header Bar */}
      <header className="sticky top-16 z-30 bg-[#1a1410]/90 backdrop-blur-md border-b border-[rgba(232,160,69,0.15)] py-4">
        <div className="container mx-auto px-4 max-w-6xl flex items-center justify-between">
          <Link 
            to="/knowledge-base" 
            className="flex items-center gap-2 text-[#c4956a] hover:text-[#e8a045] transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Knowledge Base
          </Link>

          {herbData && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[rgba(232,160,69,0.1)] border border-[rgba(232,160,69,0.25)] text-[#e8a045]">
              {herbData.name} ({herbData.scientific_name})
            </span>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="w-12 h-12 border-4 border-[#e8a045]/30 border-t-[#e8a045] rounded-full animate-spin" />
            <p className="text-[#c4956a] text-sm animate-pulse">Loading herb profile...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center max-w-lg mx-auto mt-12">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4 opacity-80" />
            <h3 className="text-xl font-medium text-red-200 mb-2">Error Loading Data</h3>
            <p className="text-red-300/70">{error}</p>
            <Link 
              to="/knowledge-base" 
              className="inline-block mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors border border-white/10"
            >
              Back to Catalog
            </Link>
          </div>
        ) : herbData ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HerbInfoDashboard herbData={herbData} />
          </motion.div>
        ) : null}
      </main>

      {/* Floating Chatbot */}
      <RAGChatbot 
        herbName={herbData?.name} 
        herbId={id} 
      />
    </div>
  );
}
