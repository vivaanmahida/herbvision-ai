import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Leaf, Sparkles, Filter, ArrowRight, Sprout, Heart, Shield, Wind, Flame, Droplet } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

const HerbCatalog = ({ onSelectHerb }) => {
  const [herbs, setHerbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    const fetchHerbs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/herbs`);
        setHerbs(res.data || []);
      } catch (err) {
        console.error('Failed to load herbs list:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHerbs();
  }, []);

  const filterCategories = [
    { id: 'All', label: 'All Herbs' },
    { id: 'Adaptogen', label: '🌿 Adaptogens' },
    { id: 'Immunity', label: '🛡️ Immunity' },
    { id: 'Respiratory', label: '🫁 Respiratory' },
    { id: 'Vata', label: '💨 Vata Balancers' },
    { id: 'Pitta', label: '🔥 Pitta Balancers' },
    { id: 'Kapha', label: '💧 Kapha Balancers' },
  ];

  const filteredHerbs = herbs.filter(herb => {
    // Text search matching
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch = !query || 
      herb.name?.toLowerCase().includes(query) ||
      herb.scientific_name?.toLowerCase().includes(query) ||
      herb.sanskrit_name?.toLowerCase().includes(query) ||
      herb.hindi_name?.toLowerCase().includes(query) ||
      herb.botanical_family?.toLowerCase().includes(query) ||
      herb.tags?.some(tag => tag.toLowerCase().includes(query));

    // Category filter matching
    if (!matchesSearch) return false;
    if (selectedFilter === 'All') return true;

    if (['Vata', 'Pitta', 'Kapha'].includes(selectedFilter)) {
      const balances = herb.dosha?.balances || [];
      return balances.some(b => b.toLowerCase().includes(selectedFilter.toLowerCase()));
    }

    const tags = herb.tags || [];
    return tags.some(t => t.toLowerCase().includes(selectedFilter.toLowerCase()));
  });

  return (
    <section id="catalog" className="py-24 container mx-auto px-4 max-w-7xl">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(232,160,69,0.3)] bg-[rgba(232,160,69,0.05)] mb-4">
            <Sparkles className="w-4 h-4 text-[#e8a045]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#e8a045]">Ayurvedic Knowledge Base</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#fdf6e3] font-serif" style={{ fontFamily: '"Playfair Display", serif' }}>
            Explore 20+ Medicinal Herbs
          </h2>
          <div className="w-24 h-1 bg-[#e8a045] mx-auto mb-6 rounded-full" />
          <p className="max-w-2xl mx-auto text-base" style={{ color: 'rgba(253,246,227,0.65)' }}>
            Browse our complete database of authentic Ayurvedic herbs. Discover botanical profiles, traditional uses, dosha balances, and cultivation guides.
          </p>
        </motion.div>
      </div>

      {/* Search & Filter Bar */}
      <div className="max-w-4xl mx-auto mb-12 space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c4956a]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by herb name (e.g. Tulsi, Ashwagandha), botanical name, or benefit..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[rgba(255,220,150,0.05)] border border-[rgba(232,160,69,0.2)] text-[#fdf6e3] placeholder-[rgba(233,246,227,0.4)] outline-none focus:border-[#e8a045] focus:bg-[rgba(255,220,150,0.08)] transition-all shadow-lg"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {filterCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedFilter === cat.id
                  ? 'bg-gradient-to-r from-[#e8a045] to-[#d4862a] text-[#1a1410] font-semibold shadow-md'
                  : 'bg-[rgba(255,220,150,0.04)] border border-[rgba(232,160,69,0.15)] text-[rgba(253,246,227,0.7)] hover:text-[#fdf6e3] hover:border-[rgba(232,160,69,0.4)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Herb Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 rounded-2xl animate-pulse bg-[rgba(255,220,150,0.05)] border border-[rgba(232,160,69,0.1)]" />
          ))}
        </div>
      ) : filteredHerbs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-[rgba(232,160,69,0.15)] bg-[rgba(255,220,150,0.03)]">
          <Leaf className="w-12 h-12 text-[#c4956a] mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium text-[#fdf6e3] mb-1">No herbs match your search</p>
          <p className="text-sm" style={{ color: 'rgba(253,246,227,0.5)' }}>Try adjusting your search terms or filters.</p>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredHerbs.map((herb, idx) => (
              <motion.div
                key={herb.id || idx}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="glass-card-hover rounded-2xl overflow-hidden border border-[rgba(232,160,69,0.18)] bg-[rgba(26,20,16,0.7)] flex flex-col justify-between group"
              >
                {/* Header / Image area */}
                <div className="relative h-44 bg-[rgba(0,0,0,0.3)] overflow-hidden flex items-center justify-center p-4">
                  {herb.image_url ? (
                    <img
                      src={herb.image_url}
                      alt={herb.name}
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#1a1410] ${herb.image_url ? 'hidden' : 'flex'}`}>
                    <div className="w-14 h-14 rounded-2xl bg-[rgba(232,160,69,0.1)] border border-[rgba(232,160,69,0.2)] flex items-center justify-center">
                      <Sprout className="w-8 h-8 text-[#e8a045]" />
                    </div>
                  </div>
                  
                  {/* Family Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider bg-[#1a1410]/80 border border-[rgba(232,160,69,0.3)] text-[#e8c9a0]">
                    {herb.botanical_family || herb.family}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold font-serif text-[#e8a045] group-hover:text-[#fbbf24] transition-colors" style={{ fontFamily: '"Playfair Display", serif' }}>
                      {herb.name}
                    </h3>
                    <p className="text-xs italic text-[rgba(253,246,227,0.65)] mb-3">
                      {herb.scientific_name}
                    </p>
                    
                    {/* Sanskrit / Hindi pill */}
                    {herb.sanskrit_name && (
                      <p className="text-xs text-[rgba(253,246,227,0.5)] mb-3">
                        Sanskrit: <span className="text-[#e8c9a0] font-medium">{herb.sanskrit_name}</span>
                      </p>
                    )}

                    {/* Dosha Badges */}
                    {herb.dosha?.balances && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {herb.dosha.balances.map((d, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md text-[10px] font-semibold border"
                            style={{
                              backgroundColor: d.toLowerCase().includes('vata') ? 'rgba(139,92,246,0.15)' :
                                               d.toLowerCase().includes('pitta') ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)',
                              borderColor: d.toLowerCase().includes('vata') ? 'rgba(139,92,246,0.3)' :
                                           d.toLowerCase().includes('pitta') ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.3)',
                              color: d.toLowerCase().includes('vata') ? '#c084fc' :
                                     d.toLowerCase().includes('pitta') ? '#fca5a5' : '#93c5fd',
                            }}
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Tags */}
                    {herb.tags && (
                      <div className="flex flex-wrap gap-1">
                        {herb.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-[rgba(232,160,69,0.08)] text-[#c4956a] border border-[rgba(232,160,69,0.15)]">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* View Details Button */}
                  <button
                    onClick={() => onSelectHerb(herb)}
                    className="w-full py-2.5 rounded-xl border border-[rgba(232,160,69,0.3)] bg-[rgba(232,160,69,0.05)] text-[#e8a045] font-semibold text-xs flex items-center justify-center gap-2 group-hover:bg-gradient-to-r group-hover:from-[#e8a045] group-hover:to-[#d4862a] group-hover:text-[#1a1410] transition-all cursor-pointer shadow-sm"
                  >
                    <span>View Herb Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
};

export default HerbCatalog;
