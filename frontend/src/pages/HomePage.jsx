import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ScanEye, BookOpen, Bot, Info, ArrowRight, Leaf, Sparkles, Shield, Heart } from 'lucide-react';
import HeroSection from '../components/HeroSection';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function HomePage() {
  const [featuredHerbs, setFeaturedHerbs] = useState([]);

  useEffect(() => {
    const fetchHerbs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/herbs`);
        if (res.data && res.data.length > 0) {
          setFeaturedHerbs(res.data.slice(0, 4)); // Show first 4 popular herbs
        }
      } catch (err) {
        console.error('Failed to load featured herbs:', err);
      }
    };
    fetchHerbs();
  }, []);

  const featureCards = [
    {
      title: 'AI Herb Identifier',
      subtitle: 'Identify herbs instantly with Computer Vision & Grad-CAM visual heatmaps.',
      path: '/identify',
      icon: ScanEye,
      buttonText: 'Start Upload',
      badge: 'Vision AI',
    },
    {
      title: '20+ Herbs Directory',
      subtitle: 'Browse authentic botanical profiles, doshas, traditional uses & cultivation.',
      path: '/knowledge-base',
      icon: BookOpen,
      buttonText: 'Browse Catalog',
      badge: 'Database',
    },
    {
      title: 'AI Knowledge Assistant',
      subtitle: 'Ask questions grounded in Ayurvedic knowledge via RAG & voice search.',
      path: '/assistant',
      icon: Bot,
      buttonText: 'Chat with AI',
      badge: 'Gemini RAG',
    },
    {
      title: 'Ayurvedic Principles',
      subtitle: 'Learn about Tridoshas, Rasayana, and modern computer vision architecture.',
      path: '/about',
      icon: Info,
      buttonText: 'Learn More',
      badge: 'Education',
    },
  ];

  return (
    <div className="min-h-screen bg-[#1a1410] text-[#fdf6e3] font-sans">
      <main>
        {/* Hero Section */}
        <section id="hero">
          <HeroSection />
        </section>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(232,160,69,0.2)] to-transparent" />

        {/* Feature Navigation Cards Section */}
        <section className="py-24 container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(232,160,69,0.3)] bg-[rgba(232,160,69,0.05)] mb-4">
                <Sparkles className="w-4 h-4 text-[#e8a045]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#e8a045]">Core Platform Modules</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 font-serif text-[#fdf6e3]" style={{ fontFamily: '"Playfair Display", serif' }}>
                Everything You Need for <span className="text-gradient-gold">Herbal Wisdom</span>
              </h2>
              <div className="w-24 h-1 bg-[#e8a045] mx-auto mb-6 rounded-full" />
              <p className="max-w-2xl mx-auto text-base text-[rgba(253,246,227,0.7)]">
                Choose a module below to identify unknown plants, explore our complete database, or chat with our RAG AI assistant.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card-hover rounded-3xl p-6 border border-[rgba(232,160,69,0.18)] bg-[rgba(26,20,16,0.7)] flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[rgba(232,160,69,0.12)] border border-[rgba(232,160,69,0.25)] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <card.icon className="w-6 h-6 text-[#e8a045]" />
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[rgba(232,160,69,0.08)] border border-[rgba(232,160,69,0.2)] text-[#e8c9a0]">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-serif text-[#e8a045] mb-2 group-hover:text-[#fbbf24] transition-colors" style={{ fontFamily: '"Playfair Display", serif' }}>
                    {card.title}
                  </h3>
                  <p className="text-sm text-[rgba(253,246,227,0.7)] leading-relaxed mb-6">
                    {card.subtitle}
                  </p>
                </div>

                <Link
                  to={card.path}
                  className="w-full py-3 rounded-xl border border-[rgba(232,160,69,0.3)] bg-[rgba(232,160,69,0.05)] text-[#e8a045] font-semibold text-sm flex items-center justify-center gap-2 group-hover:bg-gradient-to-r group-hover:from-[#e8a045] group-hover:to-[#d4862a] group-hover:text-[#1a1410] transition-all shadow-md"
                >
                  <span>{card.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Herbs Preview Section */}
        {featuredHerbs.length > 0 && (
          <>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(232,160,69,0.2)] to-transparent" />
            <section className="py-24 container mx-auto px-4 max-w-7xl bg-gradient-to-b from-[#1a1410] to-[#221b14]">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#c4956a] font-semibold mb-2 block">Featured Botanical Profiles</span>
                  <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#e8a045]" style={{ fontFamily: '"Playfair Display", serif' }}>
                    Popular Ayurvedic Herbs
                  </h2>
                </div>
                <Link to="/knowledge-base" className="mt-4 md:mt-0 text-sm font-semibold text-[#e8a045] hover:text-[#fbbf24] flex items-center gap-2">
                  <span>View All 20+ Herbs</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredHerbs.map((herb) => (
                  <Link
                    key={herb.id}
                    to={`/herb/${herb.id}`}
                    className="glass-card-hover rounded-2xl overflow-hidden border border-[rgba(232,160,69,0.18)] bg-[rgba(26,20,16,0.7)] flex flex-col justify-between group"
                  >
                    <div className="relative h-48 bg-[#140f0c] overflow-hidden">
                      <img
                        src={herb.image_url || `/images/herbs/${herb.id}.jpg`}
                        alt={herb.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = `/images/herbs/${herb.id}.jpg`;
                        }}
                      />
                    </div>

                    <div className="p-5">
                      <h3 className="text-xl font-bold font-serif text-[#e8a045] mb-1" style={{ fontFamily: '"Playfair Display", serif' }}>
                        {herb.name}
                      </h3>
                      <p className="text-xs italic text-[rgba(253,246,227,0.6)] mb-3">
                        {herb.scientific_name}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-[#c4956a]">
                        <span>Sanskrit: {herb.sanskrit_name || 'N/A'}</span>
                        <ArrowRight className="w-4 h-4 text-[#e8a045] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="py-12 border-t mt-auto" style={{ backgroundColor: '#140f0c', borderColor: 'rgba(232,160,69,0.15)' }}>
        <div className="container mx-auto px-4 flex flex-col items-center gap-4 text-center">
          <h3 className="text-xl font-serif text-[#e8a045]" style={{ fontFamily: '"Playfair Display", serif' }}>HerbVision AI</h3>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-[#e8a045]/30" />
            <Leaf className="w-4 h-4 text-[#e8a045]" />
            <div className="h-px w-8 bg-[#e8a045]/30" />
          </div>
          <p className="text-sm mt-2 max-w-md text-[rgba(253,246,227,0.65)]">
            This information is provided for educational purposes only and is not intended to substitute for professional medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
