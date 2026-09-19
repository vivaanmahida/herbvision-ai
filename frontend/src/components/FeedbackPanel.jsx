import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Send } from 'lucide-react';

// Props: predictedHerb (string), confidence (number), herbId (number)
const FeedbackPanel = ({ predictedHerb, confidence, herbId }) => {
  const [feedbackState, setFeedbackState] = useState('initial'); // 'initial', 'incorrect_form', 'submitting', 'success', 'error'
  const [suggestedHerb, setSuggestedHerb] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const submitFeedback = async (isCorrect, suggestion = '') => {
    setFeedbackState('submitting');
    setErrorMsg('');

    try {
      await axios.post('/api/feedback', {
        predicted_herb: predictedHerb,
        confidence: confidence,
        is_correct: isCorrect,
        suggested_herb: suggestion || null,
      });
      setFeedbackState('success');
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.error || 'Failed to submit feedback.';
      setErrorMsg(msg);
      setFeedbackState('error');
    }
  };

  const handleCorrect = () => submitFeedback(true);
  const handleIncorrectClick = () => setFeedbackState('incorrect_form');
  const handleSuggestionSubmit = (e) => {
    e.preventDefault();
    submitFeedback(false, suggestedHerb);
  };

  return (
    <div className="glass-card mt-8 p-6 rounded-2xl border" style={{ borderColor: 'rgba(232,160,69,0.15)' }}>
      <div className="text-center mb-6">
        <p className="text-sm font-semibold tracking-wider uppercase mb-1" style={{ color: '#c4956a' }}>Help Us Improve</p>
        <h3 className="text-xl font-medium text-[#fdf6e3]">Was this identification correct?</h3>
        {predictedHerb && (
          <p className="text-sm mt-1" style={{ color: 'rgba(253,246,227,0.5)' }}>
            Identified as: <span style={{ color: '#e8a045' }}>{predictedHerb}</span>
          </p>
        )}
      </div>

      <AnimatePresence mode="wait">
        {feedbackState === 'initial' && (
          <motion.div
            key="initial"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex justify-center gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCorrect}
              className="flex flex-col items-center justify-center w-32 h-32 rounded-2xl border transition-colors group cursor-pointer"
              style={{ backgroundColor: 'rgba(52,211,153,0.05)', borderColor: 'rgba(52,211,153,0.2)' }}
            >
              <div className="text-4xl mb-3 group-hover:-translate-y-1 transition-transform duration-300">👍</div>
              <span style={{ color: '#6ee7b7' }} className="font-medium">Correct</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleIncorrectClick}
              className="flex flex-col items-center justify-center w-32 h-32 rounded-2xl border transition-colors group cursor-pointer"
              style={{ backgroundColor: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)' }}
            >
              <div className="text-4xl mb-3 group-hover:-translate-y-1 transition-transform duration-300">👎</div>
              <span style={{ color: '#fca5a5' }} className="font-medium">Incorrect</span>
            </motion.button>
          </motion.div>
        )}

        {feedbackState === 'incorrect_form' && (
          <motion.div
            key="incorrect_form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-md mx-auto"
          >
            <form onSubmit={handleSuggestionSubmit} className="flex flex-col space-y-4">
              <label className="text-sm font-medium" style={{ color: 'rgba(253,246,227,0.8)' }}>
                What is the correct herb? <span style={{ color: 'rgba(253,246,227,0.4)' }}>(optional)</span>
              </label>
              <input
                type="text"
                value={suggestedHerb}
                onChange={(e) => setSuggestedHerb(e.target.value)}
                placeholder="e.g. Tulsi, Neem, Turmeric..."
                className="w-full px-4 py-3 rounded-xl outline-none text-[#fdf6e3] transition-all"
                style={{
                  backgroundColor: 'rgba(255,220,150,0.05)',
                  border: '1px solid rgba(232,160,69,0.2)',
                  color: '#fdf6e3',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#e8a045'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(232,160,69,0.2)'; }}
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFeedbackState('initial')}
                  className="flex-1 py-2 rounded-xl border transition-colors"
                  style={{ borderColor: 'rgba(232,160,69,0.3)', color: '#c4956a' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #e8a045, #d4862a)',
                    color: '#1a1410',
                    fontWeight: 600,
                  }}
                >
                  <Send className="w-4 h-4" />
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {feedbackState === 'submitting' && (
          <motion.div
            key="submitting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center py-6"
          >
            <div className="w-8 h-8 rounded-full border-2 border-t-[#e8a045] border-r-[#e8a045] border-b-transparent border-l-transparent animate-spin mb-3" />
            <p style={{ color: '#c4956a' }}>Submitting your feedback...</p>
          </motion.div>
        )}

        {feedbackState === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4 border"
              style={{ backgroundColor: 'rgba(232,160,69,0.15)', borderColor: 'rgba(232,160,69,0.3)' }}
            >
              <CheckCircle className="w-8 h-8 text-[#e8a045]" />
            </motion.div>
            <h4 className="text-xl font-medium text-[#fdf6e3] mb-2">Thank You! 🙏</h4>
            <p style={{ color: 'rgba(253,246,227,0.65)' }}>Your feedback helps improve HerbVision AI's accuracy.</p>
          </motion.div>
        )}

        {feedbackState === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center py-4"
          >
            <div
              className="p-4 rounded-xl border flex flex-col items-center max-w-sm text-center"
              style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)' }}
            >
              <AlertCircle className="w-8 h-8 mb-2" style={{ color: '#fca5a5' }} />
              <p style={{ color: '#fca5a5' }} className="font-medium mb-4">{errorMsg}</p>
              <button
                onClick={() => setFeedbackState('initial')}
                className="px-4 py-2 rounded-lg border text-sm transition-colors"
                style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#fca5a5' }}
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedbackPanel;
