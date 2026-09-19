import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Brain, ScanEye, ShieldAlert, Cpu, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-[#1a1410] text-[#fdf6e3] font-sans pb-24">
      {/* Header Banner */}
      <section className="py-20 bg-gradient-to-b from-[#221b14] to-[#1a1410] border-b border-[rgba(232,160,69,0.15)] text-center px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(232,160,69,0.3)] bg-[rgba(232,160,69,0.05)] mb-4">
              <Sparkles className="w-4 h-4 text-[#e8a045]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#e8a045]">About HerbVision AI</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif text-[#e8a045]" style={{ fontFamily: '"Playfair Display", serif' }}>
              Ancient Wisdom Meets Modern AI
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-[rgba(253,246,227,0.75)] font-light leading-relaxed">
              HerbVision AI bridges 5,000 years of traditional Ayurvedic herbal knowledge with state-of-the-art Computer Vision & Retrieval-Augmented Generation (RAG).
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 max-w-5xl space-y-16">
        
        {/* Core Pillars */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: ScanEye,
              title: "Computer Vision AI",
              desc: "Multi-prompt CLIP zero-shot classification and fine-tuned PyTorch ResNet models identify 20+ Ayurvedic herbs from leaf, flower, and stem features."
            },
            {
              icon: Brain,
              title: "Explainable Grad-CAM",
              desc: "Visualizes the model's visual attention heatmaps in real-time, highlighting exact leaf contours and botanical patterns driving predictions."
            },
            {
              icon: Cpu,
              title: "RAG Knowledge Assistant",
              desc: "Grounded by ChromaDB vector search and Google Gemini 2.0 LLMs to deliver accurate, non-hallucinated answers sourced from verified texts."
            }
          ].map((pillar, i) => (
            <motion.div key={i} variants={itemVariants} className="glass-card-hover p-8 rounded-3xl border border-[rgba(232,160,69,0.18)] bg-[rgba(26,20,16,0.7)] flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[rgba(232,160,69,0.12)] border border-[rgba(232,160,69,0.25)] flex items-center justify-center mb-6">
                <pillar.icon className="w-7 h-7 text-[#e8a045]" />
              </div>
              <h3 className="text-xl font-bold font-serif text-[#e8a045] mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>
                {pillar.title}
              </h3>
              <p className="text-sm text-[rgba(253,246,227,0.7)] leading-relaxed">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Ayurvedic Vision Mission */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8 md:p-12 rounded-3xl border border-[rgba(232,160,69,0.2)] bg-[rgba(34,27,20,0.6)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#c4956a] font-semibold mb-2 block">Our Mission</span>
              <h2 className="text-3xl font-bold font-serif text-[#e8a045] mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>
                Democratizing Herbal Intelligence
              </h2>
              <p className="text-sm text-[rgba(253,246,227,0.8)] leading-relaxed mb-4">
                Ayurveda classifies herbs based on Dosha balance (Vata, Pitta, Kapha), Rasa (Taste), Virya (Potency), and Vipaka (Post-digestive effect).
              </p>
              <p className="text-sm text-[rgba(253,246,227,0.8)] leading-relaxed mb-6">
                HerbVision AI provides accessible, instant identification and comprehensive educational breakdowns for practitioners, students, and wellness enthusiasts worldwide.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/identify" className="btn-gold px-6 py-2.5 rounded-xl text-sm font-semibold">
                  Try Herb Identification
                </Link>
                <Link to="/knowledge-base" className="btn-outline px-6 py-2.5 rounded-xl text-sm font-semibold">
                  Browse 20+ Herbs
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              {[
                "20+ Botanical Herb Classifications",
                "Grad-CAM Attention Heatmaps",
                "Vata, Pitta & Kapha Tridosha Analysis",
                "Cultivation Guides & Harvesting Tips",
                "RAG AI Chatbot Sourced Answers"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-[rgba(255,220,150,0.04)] border border-[rgba(232,160,69,0.15)]">
                  <CheckCircle2 className="w-5 h-5 text-[#e8a045] flex-shrink-0" />
                  <span className="text-sm font-medium text-[#fdf6e3]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Educational Disclaimer */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-8 rounded-3xl border border-amber-500/30 bg-amber-500/5 text-center max-w-3xl mx-auto">
          <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-amber-400 mb-2 font-serif" style={{ fontFamily: '"Playfair Display", serif' }}>
            Educational Purpose Disclaimer
          </h3>
          <p className="text-xs md:text-sm text-[rgba(253,246,227,0.7)] leading-relaxed">
            HerbVision AI is built strictly for educational and informational purposes. It is not intended to provide personalized medical diagnosis, prescription, or clinical treatment advice. Always consult a certified Ayurvedic doctor or healthcare professional before taking any herbal remedies.
          </p>
        </motion.div>

      </main>
    </div>
  );
}
