import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Leaf, Target, ScanEye, Brain } from 'lucide-react';

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 50, damping: 15 }
    }
  };

  const floatingEmojis = ['🌿', '🫚', '🌸', '🍂', '🌻', '🫛', '🌾'];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#1a1410] overflow-hidden flex flex-col justify-center pt-20">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,134,42,0.1)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(196,149,106,0.08)_0%,transparent_50%)] pointer-events-none" />
      
      {/* Decorative Circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[rgba(232,160,69,0.08)] rounded-full pointer-events-none" />

      {/* Floating Emojis */}
      {floatingEmojis.map((emoji, index) => (
        <motion.div
          key={index}
          className="absolute text-4xl select-none pointer-events-none opacity-20"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 6 + index,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            top: `${20 + (index * 12)}%`,
            left: `${10 + (index * 13)}%`,
          }}
        >
          {emoji}
        </motion.div>
      ))}

      <div className="container mx-auto px-4 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(232,160,69,0.3)] bg-[rgba(232,160,69,0.05)] glass-card">
            <span className="w-2 h-2 rounded-full bg-[#e8a045] animate-pulse" />
            <span className="text-[#e8c9a0] text-sm font-medium tracking-wide">AI-Powered Ayurvedic Intelligence</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-serif font-semibold mb-6 tracking-tight text-[#fdf6e3] leading-tight" style={{ fontFamily: '"Playfair Display", serif' }}>
            Identify. Learn. <span className="text-gradient-gold">Heal.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-[rgba(253,246,227,0.7)] max-w-2xl mx-auto mb-12 font-sans font-light leading-relaxed">
            Bridge the gap between ancient herbal wisdom and modern Computer Vision AI
          </motion.p>

          {/* Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-20 justify-center">
            <Link 
              to="/identify"
              className="btn-gold group flex items-center justify-center gap-2 text-base px-8 py-3.5"
            >
              <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
              Upload Herb Image
            </Link>
            <Link 
              to="/knowledge-base"
              className="btn-outline group flex items-center justify-center gap-2 text-base px-8 py-3.5"
            >
              <BookOpen className="w-5 h-5" />
              Explore 80 Herbs
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {[
              { icon: Leaf, label: '80 Herbs Database' },
              { icon: Target, label: '95%+ Accuracy' },
              { icon: ScanEye, label: 'Grad-CAM AI' },
              { icon: Brain, label: 'Gemini RAG' },
            ].map((stat, i) => (
              <div 
                key={i} 
                onClick={() => i === 0 && scrollToSection('catalog')}
                className="glass-card-hover p-4 flex flex-col items-center justify-center gap-2 group cursor-pointer"
              >
                <stat.icon className="w-6 h-6 text-[#e8a045] group-hover:scale-110 transition-transform" />
                <span className="text-[#e8c9a0] font-medium font-sans text-sm">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
