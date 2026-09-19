import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Leaf, AlertCircle, Bot, Sparkles } from 'lucide-react';
import axios from 'axios';
import VoiceSearch from './VoiceSearch';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function RAGChatbot({ herbName, herbId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{
    id: 1,
    role: 'assistant',
    text: herbName
      ? `Namaste! 🙏 I'm your Ayurvedic guide. Ask me anything about **${herbName}** — its uses, dosha effects, cultivation, or safety.`
      : `Namaste! 🙏 I'm HerbVision's AI assistant trained on Ayurvedic knowledge. Upload a herb image to identify it, or ask me anything about medicinal plants!`,
    sources: []
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const suggestedQuestions = herbName
    ? [
        `What are the uses of ${herbName}?`,
        `What dosha does ${herbName} balance?`,
        `How do I grow ${herbName}?`,
        `Is ${herbName} safe during pregnancy?`,
      ]
    : [
        'Tell me about Tulsi (Holy Basil)',
        'What herbs reduce stress & anxiety?',
        'Best herbs for digestion?',
        'What is Ashwagandha good for?',
      ];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = useCallback(async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isTyping) return;

    setInput('');
    setError(null);
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: query }]);
    setIsTyping(true);

    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        query,
        herb_name: herbName || null,
        herb_id: herbId || null,
      });

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        text: response.data.answer || 'I could not find an answer to that.',
        sources: response.data.sources || [],
      }]);
    } catch (err) {
      console.error('Chat error:', err);
      setError('Connection failed. Please check if the backend is running.');
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, herbName, herbId]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleSuggestionClick = useCallback((question) => {
    handleSend(question);
  }, [handleSend]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute bottom-20 right-0 w-[400px] h-[540px] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: 'linear-gradient(160deg, #221b14 0%, #1a1410 100%)',
              border: '1px solid rgba(232,160,69,0.2)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(232,160,69,0.1)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 shrink-0"
              style={{ background: 'rgba(232,160,69,0.08)', borderBottom: '1px solid rgba(232,160,69,0.15)' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #e8a045, #d4862a)' }}
                >
                  <Leaf className="w-4 h-4 text-[#1a1410]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#fdf6e3] text-sm leading-tight">HerbVision Assistant</h3>
                  {herbName
                    ? <p className="text-[10px] text-[#e8a045]/80">Focused on: {herbName}</p>
                    : <p className="text-[10px] text-[#fdf6e3]/50">Ayurvedic Knowledge AI</p>
                  }
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full transition-colors text-[#fdf6e3]/60 hover:text-[#fdf6e3] hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: 'thin' }}>
              {/* Suggested questions */}
              {messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2 mb-2"
                >
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSuggestionClick(q)}
                      className="text-xs px-3 py-1.5 rounded-full transition-all text-left cursor-pointer"
                      style={{
                        background: 'rgba(232,160,69,0.08)',
                        border: '1px solid rgba(232,160,69,0.25)',
                        color: '#e8a045',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(232,160,69,0.18)';
                        e.currentTarget.style.borderColor = 'rgba(232,160,69,0.5)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(232,160,69,0.08)';
                        e.currentTarget.style.borderColor = 'rgba(232,160,69,0.25)';
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Message bubbles */}
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
                >
                  {msg.role === 'assistant' && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1"
                      style={{ background: 'linear-gradient(135deg, #e8a045, #d4862a)' }}
                    >
                      <Leaf className="w-3 h-3 text-[#1a1410]" />
                    </div>
                  )}
                  <div
                    className="max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm"
                    style={
                      msg.role === 'user'
                        ? {
                            background: 'linear-gradient(135deg, #e8a045, #d4862a)',
                            color: '#1a1410',
                            borderBottomRightRadius: '4px',
                            fontWeight: 500,
                          }
                        : {
                            background: 'rgba(255,220,150,0.06)',
                            border: '1px solid rgba(232,160,69,0.12)',
                            color: '#fdf6e3',
                            borderBottomLeftRadius: '4px',
                          }
                    }
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-white/10 text-[10px] opacity-60 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        Sources: {msg.sources.join(', ')}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg, #e8a045, #d4862a)' }}
                  >
                    <Leaf className="w-3 h-3 text-[#1a1410]" />
                  </div>
                  <div
                    className="px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center"
                    style={{ background: 'rgba(255,220,150,0.06)', border: '1px solid rgba(232,160,69,0.12)' }}
                  >
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.7, delay }}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: '#e8a045' }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div
                  className="flex items-center gap-2 text-sm p-3 rounded-xl"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div
              className="p-3 shrink-0"
              style={{ borderTop: '1px solid rgba(232,160,69,0.12)', background: 'rgba(0,0,0,0.2)' }}
            >
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about any herb..."
                  disabled={isTyping}
                  className="flex-1 text-sm outline-none rounded-full px-4 py-2.5 transition-all"
                  style={{
                    background: 'rgba(255,220,150,0.05)',
                    border: '1px solid rgba(232,160,69,0.2)',
                    color: '#fdf6e3',
                    opacity: isTyping ? 0.7 : 1,
                  }}
                />
                <VoiceSearch onTranscript={(text) => handleSend(text)} />
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all"
                  style={{
                    background: (!input.trim() || isTyping)
                      ? 'rgba(232,160,69,0.3)'
                      : 'linear-gradient(135deg, #e8a045, #d4862a)',
                    cursor: (!input.trim() || isTyping) ? 'not-allowed' : 'pointer',
                    color: '#1a1410',
                  }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-center mt-2 text-[10px]" style={{ color: 'rgba(253,246,227,0.35)' }}>
                For educational purposes only · Not medical advice
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-2.5 px-5 py-3 rounded-full font-semibold text-sm shadow-lg"
        style={{
          background: isOpen
            ? 'rgba(232,160,69,0.15)'
            : 'linear-gradient(135deg, #e8a045, #d4862a)',
          color: isOpen ? '#e8a045' : '#1a1410',
          border: isOpen ? '1px solid rgba(232,160,69,0.4)' : 'none',
          boxShadow: '0 4px 20px rgba(232,160,69,0.35)',
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span>Ask AI</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
