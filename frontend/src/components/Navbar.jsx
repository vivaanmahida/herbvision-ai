import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Menu, X, Sparkles, ScanEye, BookOpen, Bot, Info } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Identify Herb', path: '/identify', icon: ScanEye },
    { label: 'Knowledge Base', path: '/knowledge-base', icon: BookOpen },
    { label: 'AI Assistant', path: '/assistant', icon: Bot },
    { label: 'About', path: '/about', icon: Info },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(26,20,16,0.95)'
          : 'rgba(26,20,16,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: scrolled
          ? '1px solid rgba(232,160,69,0.25)'
          : '1px solid rgba(232,160,69,0.1)',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.5)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-md"
              style={{ background: 'linear-gradient(135deg, #e8a045, #d4862a)' }}
            >
              <Leaf className="w-5 h-5 text-[#1a1410]" />
            </div>
            <span
              className="font-bold text-xl tracking-tight"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                background: 'linear-gradient(135deg, #e8a045 0%, #fbbf24 40%, #d4862a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              HerbVision AI
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#e8a045] bg-[rgba(232,160,69,0.12)] border border-[rgba(232,160,69,0.25)] font-semibold'
                      : 'text-[rgba(253,246,227,0.75)] hover:text-[#e8a045] hover:bg-[rgba(232,160,69,0.06)]'
                  }`}
                >
                  {link.icon && <link.icon className={`w-4 h-4 ${isActive ? 'text-[#e8a045]' : 'opacity-70'}`} />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/identify"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md"
              style={{
                background: 'linear-gradient(135deg, #e8a045, #d4862a)',
                color: '#1a1410',
              }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Identify Herb</span>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg transition-colors text-[rgba(253,246,227,0.8)]"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-[rgba(232,160,69,0.15)] bg-[#1a1410]/98"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? 'text-[#e8a045] bg-[rgba(232,160,69,0.12)] font-semibold'
                        : 'text-[rgba(253,246,227,0.8)] hover:text-[#e8a045] hover:bg-[rgba(232,160,69,0.06)]'
                    }`}
                  >
                    {link.icon && <link.icon className="w-5 h-5 text-[#e8a045]" />}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              <Link
                to="/identify"
                className="w-full flex items-center justify-center gap-2 mt-3 py-3 rounded-xl font-semibold text-base shadow-md"
                style={{ background: 'linear-gradient(135deg, #e8a045, #d4862a)', color: '#1a1410' }}
              >
                <Sparkles className="w-4 h-4" />
                <span>Identify Herb Now</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
