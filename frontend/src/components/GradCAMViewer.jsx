import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Leaf } from 'lucide-react';

const GradCAMViewer = ({ originalImage, gradcamImage, explanation }) => {
  const [blend, setBlend] = useState(50);

  return (
    <div className="glass-card mt-8 p-6 sm:p-8 rounded-3xl border border-[rgba(232,160,69,0.15)] bg-[rgba(26,20,16,0.6)] backdrop-blur-md">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-[rgba(232,160,69,0.1)] border border-[rgba(232,160,69,0.2)]">
          <BrainCircuit className="w-6 h-6 text-[#e8a045]" />
        </div>
        <h3 className="text-xl font-semibold text-[#fdf6e3]">AI Explainability — Grad-CAM</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col space-y-3"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#c4956a] px-3 py-1 rounded-full bg-[rgba(255,220,150,0.05)] border border-[rgba(232,160,69,0.1)]">
              Original Image
            </span>
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-[rgba(232,160,69,0.2)] aspect-square bg-[#1a1410]">
            <img 
              src={originalImage} 
              alt="Original uploaded herb" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col space-y-3"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#e8a045] px-3 py-1 rounded-full bg-[rgba(232,160,69,0.1)] border border-[rgba(232,160,69,0.3)]">
              Attention Heatmap
            </span>
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-[rgba(232,160,69,0.3)] aspect-square bg-[#1a1410] shadow-[0_0_30px_rgba(232,160,69,0.1)]">
            {/* Blend implementation */}
            <img 
              src={originalImage} 
              alt="Original" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <img 
              src={gradcamImage} 
              alt="Grad-CAM Heatmap" 
              className="absolute inset-0 w-full h-full object-cover mix-blend-screen transition-opacity duration-200"
              style={{ opacity: blend / 100 }}
            />
          </div>
        </motion.div>
      </div>

      <div className="mb-10 max-w-xl mx-auto">
        <div className="flex justify-between text-xs font-medium mb-3 px-1" style={{ color: 'rgba(253,246,227,0.7)' }}>
          <span>Image Only</span>
          <span>Heatmap Overlay: {blend}%</span>
          <span>Heatmap Only</span>
        </div>
        <div className="relative flex items-center w-full h-8 group">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={blend} 
            onChange={(e) => setBlend(parseInt(e.target.value))}
            className="absolute z-20 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="absolute z-10 w-full h-1.5 rounded-full overflow-hidden bg-[rgba(255,220,150,0.1)] border border-[rgba(232,160,69,0.1)]">
            <div 
              className="h-full bg-gradient-to-r from-[#c4956a] to-[#e8a045]" 
              style={{ width: `${blend}%` }}
            ></div>
          </div>
          {/* Custom thumb visual */}
          <div 
            className="absolute z-10 w-5 h-5 rounded-full bg-[#fdf6e3] shadow-[0_0_10px_rgba(232,160,69,0.6)] border-2 border-[#e8a045] pointer-events-none group-hover:scale-110 transition-transform"
            style={{ left: `calc(${blend}% - 10px)` }}
          ></div>
        </div>
        <p className="text-center text-xs mt-3 italic" style={{ color: 'rgba(253,246,227,0.5)' }}>
          Slide to adjust heatmap opacity
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-5 border border-[rgba(232,160,69,0.2)] bg-[rgba(255,220,150,0.03)]"
      >
        <div className="flex gap-4 items-start">
          <div className="p-2 rounded-full bg-[rgba(232,160,69,0.1)] flex-shrink-0 mt-0.5">
            <Leaf className="w-5 h-5 text-[#c4956a]" />
          </div>
          <div>
            <h4 className="text-[#e8a045] font-medium mb-1.5 flex items-center gap-2">
              How the AI saw this herb
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[rgba(232,160,69,0.15)] text-[#e8a045] border border-[rgba(232,160,69,0.2)]">
                Info
              </span>
            </h4>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(253,246,227,0.8)' }}>
              {explanation || "The highlighted regions represent the morphological features (such as leaf venation, margins, or textures) that most strongly influenced the neural network's classification decision."}
            </p>
            <p className="text-xs inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[rgba(232,160,69,0.08)] border border-[rgba(232,160,69,0.15)] text-[#c4956a]">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-red-500 to-yellow-400"></span>
              Warm regions indicate areas that influenced the prediction most
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GradCAMViewer;
