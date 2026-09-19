import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Bot, Send, Sparkles, User, Leaf, AlertCircle, RefreshCw, HelpCircle } from 'lucide-react';
import VoiceSearch from '../components/VoiceSearch';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Namaste! 🙏 I am your HerbVision AI Knowledge Assistant. How can I help you explore Ayurvedic herbs today?',
      sources: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "What are the medicinal benefits of Tulsi?",
    "Which herbs help reduce stress and anxiety?",
    "How does Ashwagandha balance Vata dosha?",
    "What herbs support skin health and blood detox?",
    "What is the difference between Ginger and Turmeric?",
    "Are there any safety notes for Neem?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (queryToSend) => {
    const text = (queryToSend || inputQuery).trim();
    if (!text || isLoading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryToSend) setInputQuery('');
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/chat`, {
        query: text
      });

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: res.data.answer || 'I could not retrieve an answer for that query.',
        sources: res.data.sources || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Sorry, I ran into an issue connecting to the knowledge base. Please try again in a moment.',
        sources: [],
        isError: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1410] text-[#fdf6e3] font-sans pb-16 flex flex-col">
      {/* Header */}
      <section className="py-8 bg-[#221b14] border-b border-[rgba(232,160,69,0.15)] text-center px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 text-left">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#e8a045] to-[#d4862a] flex items-center justify-center text-[#1a1410] shadow-lg">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-serif text-[#e8a045]" style={{ fontFamily: '"Playfair Display", serif' }}>
                AI Knowledge Assistant
              </h1>
              <p className="text-xs text-[rgba(253,246,227,0.6)]">
                Retrieval-Augmented Generation (RAG) powered by Gemini & ChromaDB
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setMessages([{
              id: Date.now(),
              sender: 'ai',
              text: 'Namaste! 🙏 Chat history cleared. Ask me anything about Ayurvedic herbs!',
              sources: [],
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }])}
            className="px-3.5 py-1.5 rounded-xl border border-[rgba(232,160,69,0.3)] text-xs text-[#c4956a] hover:text-[#fdf6e3] hover:border-[#e8a045] transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Chat</span>
          </button>
        </div>
      </section>

      {/* Main Chat Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col space-y-6">
        
        {/* Messages Window */}
        <div className="flex-1 glass-card rounded-3xl p-6 border border-[rgba(232,160,69,0.15)] bg-[rgba(26,20,16,0.85)] flex flex-col space-y-4 overflow-y-auto max-h-[600px] shadow-2xl">
          <AnimatePresence mode="popLayout">
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-[rgba(232,160,69,0.15)] border border-[rgba(232,160,69,0.3)] flex items-center justify-center flex-shrink-0 mt-1">
                    <Leaf className="w-4 h-4 text-[#e8a045]" />
                  </div>
                )}

                <div className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-[#e8a045] to-[#d4862a] text-[#1a1410] font-medium rounded-tr-none shadow-md'
                    : msg.isError
                    ? 'bg-red-500/10 border border-red-500/30 text-red-200 rounded-tl-none'
                    : 'bg-[rgba(255,220,150,0.05)] border border-[rgba(232,160,69,0.15)] text-[#fdf6e3] rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  
                  {/* Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-[rgba(232,160,69,0.15)] flex flex-wrap items-center gap-1.5 text-xs text-[#c4956a]">
                      <span className="font-semibold text-[10px] uppercase">Sources:</span>
                      {msg.sources.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-full bg-[rgba(232,160,69,0.1)] border border-[rgba(232,160,69,0.2)] text-[10px] text-[#e8a045]">
                          🌿 {s}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className={`text-[10px] mt-1.5 text-right ${msg.sender === 'user' ? 'text-[#1a1410]/70' : 'text-[rgba(253,246,227,0.4)]'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-[rgba(255,220,150,0.1)] border border-[rgba(232,160,69,0.2)] flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-[#e8a045]" />
                  </div>
                )}
              </motion.div>
            ))}

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 items-center text-sm text-[#c4956a] p-2">
                <div className="w-8 h-8 rounded-full bg-[rgba(232,160,69,0.15)] border border-[rgba(232,160,69,0.3)] flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-[#e8a045] animate-spin" />
                </div>
                <span>Searching knowledge base & generating answer...</span>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-[#c4956a] flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#e8a045]" /> Suggested Queries
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="text-xs px-3 py-1.5 rounded-xl border border-[rgba(232,160,69,0.2)] bg-[rgba(255,220,150,0.03)] text-[rgba(253,246,227,0.8)] hover:text-[#fdf6e3] hover:border-[#e8a045] hover:bg-[rgba(232,160,69,0.08)] transition-all text-left cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything about Ayurvedic herbs, benefits, dosage, or doshas..."
              className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-[rgba(255,220,150,0.05)] border border-[rgba(232,160,69,0.2)] text-[#fdf6e3] placeholder-[rgba(253,246,227,0.4)] outline-none focus:border-[#e8a045] focus:bg-[rgba(255,220,150,0.08)] transition-all shadow-lg"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <VoiceSearch onTranscript={(text) => setInputQuery(text)} />
            </div>
          </div>

          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="btn-gold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>

      </div>
    </div>
  );
}
