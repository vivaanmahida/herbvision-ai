import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoiceSearch({ onTranscript }) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Voice not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      setInterimTranscript(interim);

      if (final) {
        onTranscript(final);
        setIsListening(false);
        setInterimTranscript('');
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      setInterimTranscript('');
      // Ignore no-speech errors to not spam the user
      if (event.error !== 'no-speech') {
        setError('Microphone error');
        setTimeout(() => setError(null), 3000);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onTranscript]);

  const toggleListen = () => {
    if (error && error === 'Voice not supported') return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setError(null);
      setInterimTranscript('');
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
        setError('Failed to start');
      }
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      {isListening && (
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute inset-0 bg-red-500 rounded-full"
        />
      )}
      
      <button
        onClick={toggleListen}
        disabled={error === 'Voice not supported'}
        title={error || (isListening ? 'Stop listening' : 'Start voice search')}
        className={`relative z-10 p-2 rounded-full transition-colors shrink-0 ${
          isListening 
            ? 'bg-red-500 text-white' 
            : 'bg-white/5 text-[#faf6f0] hover:bg-white/10'
        } ${error === 'Voice not supported' ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {(isListening || error) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className={`absolute bottom-full mb-2 right-0 md:-right-4 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs backdrop-blur-md border ${
              error 
                ? 'bg-red-500/20 text-red-200 border-red-500/30 flex items-center gap-1' 
                : 'bg-[#0b1f10]/90 text-[#faf6f0] border-[#d4a853]/30'
            }`}
          >
            {error ? (
              <>
                <AlertCircle className="w-3 h-3" />
                {error}
              </>
            ) : (
              interimTranscript || 'Listening...'
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
