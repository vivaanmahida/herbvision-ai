import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles } from 'lucide-react';
import HerbCatalog from '../components/HerbCatalog';
import RAGChatbot from '../components/RAGChatbot';

export default function KnowledgeBasePage() {
  const navigate = useNavigate();

  const handleSelectHerb = (herb) => {
    if (herb && (herb.id || herb.herb_id)) {
      navigate(`/herb/${herb.id || herb.herb_id}`);
    }
  };

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
              <BookOpen className="w-4 h-4 text-[#e8a045]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#e8a045]">Ayurvedic Directory</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif text-[#e8a045]" style={{ fontFamily: '"Playfair Display", serif' }}>
              20+ Herbs Knowledge Base
            </h1>
            <p className="max-w-xl mx-auto text-base text-[rgba(253,246,227,0.7)]">
              Search and explore authentic botanical profiles, dosha balances, plant parts used, and traditional Ayurvedic remedies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Catalog Component */}
      <main className="container mx-auto px-4 py-8">
        <HerbCatalog onSelectHerb={handleSelectHerb} />
      </main>

      {/* Floating Chatbot */}
      <RAGChatbot />
    </div>
  );
}
