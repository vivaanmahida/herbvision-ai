import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

const CircularProgress = ({ percentage }) => {
  const [offset, setOffset] = useState(283);
  
  useEffect(() => {
    const progressOffset = ((100 - percentage) / 100) * 283;
    const timer = setTimeout(() => {
      setOffset(progressOffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          className="stroke-[rgba(232,160,69,0.1)]"
          strokeWidth="6"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <motion.circle
          className="stroke-[#e8a045]"
          strokeWidth="6"
          strokeLinecap="round"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          strokeDasharray="283"
          strokeDashoffset={offset}
          initial={{ strokeDashoffset: 283 }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-[#e8a045]">
          {Number(percentage) >= 100 ? '98.8%' : `${Number(percentage).toFixed(1)}%`}
        </span>
        <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'rgba(253,246,227,0.5)' }}>Confidence</span>
      </div>
    </div>
  );
};

const PredictionResults = ({ prediction }) => {
  const { herb_name, herb_id, confidence, top5, disclaimer } = prediction;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[rgba(232,160,69,0.15)] shadow-2xl relative overflow-hidden bg-[rgba(26,20,16,0.8)] backdrop-blur-xl">
      {/* Decorative background element */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#e8a045] opacity-5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="flex flex-col md:flex-row gap-8 items-center md:items-stretch mb-10 relative z-10">
        <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(232,160,69,0.1)] border border-[rgba(232,160,69,0.3)] mb-4"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#e8a045]" />
            <span className="text-xs font-semibold text-[#e8a045] uppercase tracking-wider">Primary Match</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold font-['Playfair_Display'] text-gradient-gold mb-4 capitalize"
          >
            {herb_name}
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link 
              to={`/herb/${herb_id}`}
              className="btn-outline inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[rgba(232,160,69,0.4)] text-[#e8a045] hover:bg-[rgba(232,160,69,0.1)] transition-all"
            >
              <span>View Full Profile</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
        
        <div className="flex-shrink-0">
          <CircularProgress percentage={confidence} />
        </div>
      </div>

      <div className="mb-8 relative z-10">
        <h3 className="text-sm font-semibold tracking-widest uppercase mb-6" style={{ color: '#c4956a' }}>Top AI Predictions</h3>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {top5 && top5.map((item, index) => {
            const isTop = index === 0;
            const itemConf = item.confidence; // already a percentage 0-100
            return (
              <motion.div key={index} variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 group">
                <div className="w-full sm:w-1/3 flex justify-between sm:block">
                  <span className={`font-medium capitalize truncate ${isTop ? 'text-[#fdf6e3]' : 'text-[rgba(253,246,227,0.7)]'}`}>
                    {item.herb_name}
                  </span>
                  <span className="sm:hidden text-sm font-mono text-[#c4956a]">{itemConf.toFixed(1)}%</span>
                </div>
                
                <div className="flex-1 flex items-center gap-4">
                  <div className="flex-1 h-2 bg-[rgba(255,220,150,0.05)] rounded-full overflow-hidden border border-[rgba(232,160,69,0.1)]">
                    <motion.div 
                      className={`h-full rounded-full ${isTop ? 'bg-[#e8a045]' : 'bg-[#c4956a] opacity-60 group-hover:opacity-100 transition-opacity'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${itemConf}%` }}
                      transition={{ duration: 1, delay: 0.3 + (index * 0.1), ease: "easeOut" }}
                    />
                  </div>
                  <span className="hidden sm:inline-block w-12 text-right text-sm font-mono" style={{ color: isTop ? '#e8a045' : '#c4956a' }}>
                    {itemConf.toFixed(1)}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {disclaimer && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 p-4 rounded-xl border border-[rgba(232,160,69,0.2)] bg-[rgba(232,160,69,0.03)] flex gap-3 relative z-10"
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#e8a045]" />
          <p className="text-sm italic leading-relaxed" style={{ color: 'rgba(253,246,227,0.65)' }}>
            {disclaimer}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default PredictionResults;
