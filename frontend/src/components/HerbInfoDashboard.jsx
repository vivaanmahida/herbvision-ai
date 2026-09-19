import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, MapPin, List, AlertTriangle, Droplets, Sun, Wind, Sprout, Mountain, Thermometer, Scissors } from 'lucide-react';

const glassCardStyle = {
  backgroundColor: 'rgba(255,220,150,0.07)',
  borderColor: 'rgba(232,160,69,0.15)',
  borderWidth: '1px'
};

const mutedText = { color: 'rgba(253,246,227,0.65)' };
const saffronText = { color: '#e8a045' };

const SkeletonLoader = () => (
  <div className="w-full max-w-5xl mx-auto p-6 space-y-8 animate-pulse">
    <div className="h-64 rounded-3xl" style={{ backgroundColor: 'rgba(255,220,150,0.07)' }}></div>
    <div className="flex gap-4">
      {[1,2,3,4].map(i => <div key={i} className="h-10 w-32 rounded-lg" style={{ backgroundColor: 'rgba(255,220,150,0.07)' }}></div>)}
    </div>
    <div className="h-96 rounded-2xl" style={{ backgroundColor: 'rgba(255,220,150,0.04)' }}></div>
  </div>
);

const HerbInfoDashboard = ({ herbData: initialHerbData, id }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [herbData, setHerbData] = useState(initialHerbData);
  const [loading, setLoading] = useState(!initialHerbData);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!initialHerbData && id) {
      setLoading(true);
      // Simulate fetch
      setTimeout(() => {
        // Mock data if fetch fails/for demo
        setHerbData({
          herb_name: "Tulsi (Holy Basil)",
          scientific_name: "Ocimum tenuiflorum",
          sanskrit_name: "Tulasi",
          hindi_name: "Tulsi",
          family: "Lamiaceae",
          image_url: "https://example.com/tulsi.jpg", // placeholder
          description: "Tulsi is revered in Ayurveda as an 'Elixir of Life'. It is a widely grown, sacred plant in India, known for its strong medicinal properties, distinct aroma, and adaptogenic benefits.",
          parts_used: ["Leaves", "Seeds", "Roots"],
          habitat: "Native to the Indian subcontinent, widespread as a cultivated plant throughout the Southeast Asian tropics.",
          tags: ["Adaptogen", "Immunity", "Respiratory"],
          dosha: {
            balances: ["Kapha", "Vata"],
            aggravates: ["Pitta (in excess)"]
          },
          properties: {
            rasa: "Katu (Pungent), Tikta (Bitter)",
            virya: "Ushna (Heating)",
            vipaka: "Katu (Pungent)"
          },
          traditional_uses: [
            "Relieves cough and cold symptoms",
            "Reduces stress and anxiety (adaptogen)",
            "Promotes healthy digestion",
            "Supports the immune system"
          ],
          cultivation: {
            climate: "Tropical/Subtropical",
            soil: "Well-drained, loamy",
            water: "Moderate, do not overwater",
            sunlight: "Full sun to partial shade",
            propagation: "Seeds or stem cuttings",
            harvesting: "Leaves can be harvested year-round"
          },
          safety: "Generally safe for most people. High doses may have a mild blood-thinning effect or affect blood sugar levels. Pregnant women should consult a practitioner."
        });
        setLoading(false);
      }, 1000);
    }
  }, [initialHerbData, id]);

  if (loading) return <SkeletonLoader />;
  if (error) return (
    <div className="p-8 text-center rounded-xl border" style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>
      Failed to load herb data.
    </div>
  );
  if (!herbData) return null;

  // Normalize API field names → component field names
  // API returns: name, botanical_family, cultivation.watering
  // Component expects: herb_name, family, cultivation.water
  const herb = {
    ...herbData,
    herb_name: herbData.herb_name || herbData.name || 'Unknown Herb',
    family: herbData.family || herbData.botanical_family || '',
    cultivation: herbData.cultivation ? {
      ...herbData.cultivation,
      water: herbData.cultivation.water || herbData.cultivation.watering || '',
    } : {},
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'ayurveda', label: 'Ayurvedic Uses' },
    { id: 'cultivation', label: 'Cultivation' },
    { id: 'safety', label: 'Safety' }
  ];

  const tabContentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 text-[#fdf6e3]">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl flex flex-col md:flex-row backdrop-blur-md" style={glassCardStyle}>
        <div className="w-full md:w-1/3 h-64 md:h-auto relative" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
          {herb.image_url ? (
            <div className="w-full h-full p-4 flex items-center justify-center">
              <img
                src={herb.image_url}
                alt={herb.herb_name}
                className="w-full h-full object-cover rounded-xl border"
                style={{ borderColor: 'rgba(232,160,69,0.3)' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="absolute inset-0 items-center justify-center hidden flex-col gap-3">
                <Sprout className="w-20 h-20 opacity-30 text-[#e8a045]" />
                <span className="text-xs font-medium" style={{ color: 'rgba(232,160,69,0.5)' }}>{herb.herb_name}</span>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <Sprout className="w-20 h-20 opacity-30 text-[#e8a045]" />
              <span className="text-xs font-medium" style={{ color: 'rgba(232,160,69,0.5)' }}>{herb.herb_name}</span>
            </div>
          )}
        </div>
        <div className="p-8 md:p-10 flex-1 flex flex-col justify-center relative">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <Leaf className="w-32 h-32 text-[#e8a045]" />
          </div>
          
          <div className="mb-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider border" style={{ color: '#d4862a', backgroundColor: 'rgba(212,134,42,0.1)', borderColor: 'rgba(212,134,42,0.2)' }}>
              FAMILY: {herb.family?.toUpperCase()}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-2 font-serif" style={{ fontFamily: '"Playfair Display", serif', color: '#e8a045' }}>
            {herb.herb_name}
          </h1>
          <p className="text-xl italic mb-6" style={mutedText}>
            {herb.scientific_name}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {herb.sanskrit_name && (
              <span className="px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: '#e8a045', color: '#1a1410' }}>
                Sanskrit: {herb.sanskrit_name}
              </span>
            )}
            {herb.hindi_name && (
              <span className="px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: '#e8a045', color: '#1a1410' }}>
                Hindi: {herb.hindi_name}
              </span>
            )}
            {herb.gujarati_name && (
              <span className="px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: '#e8a045', color: '#1a1410' }}>
                Gujarati: {herb.gujarati_name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 p-1 rounded-xl backdrop-blur-md hide-scrollbar" style={{ backgroundColor: 'rgba(255,220,150,0.03)', border: '1px solid rgba(232,160,69,0.1)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative px-6 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            style={{ color: activeTab === tab.id ? '#1a1410' : 'rgba(253,246,227,0.65)' }}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-lg shadow-lg"
                style={{ backgroundColor: '#e8a045' }}
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" variants={tabContentVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              <div className="p-6 md:p-8 rounded-2xl" style={glassCardStyle}>
                <h3 className="text-lg font-serif mb-4" style={{ fontFamily: '"Playfair Display", serif', color: '#e8a045' }}>Description</h3>
                <p className="leading-relaxed" style={{ color: 'rgba(253,246,227,0.85)' }}>{herb.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl" style={glassCardStyle}>
                  <h3 className="text-sm font-medium uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: '#c4956a' }}>
                    <Leaf className="w-4 h-4 text-[#e8a045]" /> Plant Parts Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(herb.plant_parts_used || herb.parts_used)?.map((part, i) => (
                      <span key={i} className="px-4 py-2 rounded-full text-sm border flex items-center gap-2" style={{ backgroundColor: 'rgba(232,160,69,0.1)', borderColor: 'rgba(232,160,69,0.3)', color: '#fdf6e3' }}>
                        <Leaf className="w-3 h-3 text-[#d4862a]" /> {part}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl" style={glassCardStyle}>
                  <h3 className="text-sm font-medium uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: '#c4956a' }}>
                    <MapPin className="w-4 h-4 text-[#e8a045]" /> Habitat
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(253,246,227,0.85)' }}>{herb.habitat}</p>
                </div>
              </div>

              {herb.tags && (
                <div className="flex flex-wrap gap-2">
                  {herb.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded-md text-xs border" style={{ backgroundColor: 'rgba(212,134,42,0.1)', color: '#d4862a', borderColor: 'rgba(212,134,42,0.2)' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'ayurveda' && (
            <motion.div key="ayurveda" variants={tabContentVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              
              <div className="p-6 rounded-2xl" style={glassCardStyle}>
                <h3 className="text-lg font-serif mb-4" style={{ fontFamily: '"Playfair Display", serif', color: '#e8a045' }}>Dosha Balance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-xs uppercase mb-3 block font-semibold tracking-wider" style={mutedText}>Balances</span>
                    <div className="flex flex-wrap gap-2">
                      {herb.dosha?.balances?.map((d, i) => {
                        let colorStr = '#8b5cf6'; // Vata purple default
                        if(d.toLowerCase().includes('pitta')) colorStr = '#ef4444'; // Pitta red
                        else if(d.toLowerCase().includes('kapha')) colorStr = '#3b82f6'; // Kapha blue
                        return (
                          <span key={i} className="px-3 py-1 rounded-full text-sm font-medium border" style={{ color: colorStr, backgroundColor: `${colorStr}22`, borderColor: `${colorStr}44` }}>
                            {d}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs uppercase mb-3 block font-semibold tracking-wider" style={mutedText}>May Aggravate</span>
                    <div className="flex flex-wrap gap-2">
                       {(herb.dosha?.may_aggravate || herb.dosha?.aggravates)?.map((d, i) => (
                        <span key={i} className="px-3 py-1 rounded-full text-sm font-medium border" style={{ color: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.15)', borderColor: 'rgba(245,158,11,0.3)' }}>
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Rasa (Taste)',            value: herb.dosha?.rasa  || herb.properties?.rasa },
                  { label: 'Virya (Potency)',          value: herb.dosha?.virya || herb.properties?.virya },
                  { label: 'Vipaka (Post-digestive)',  value: herb.dosha?.vipaka || herb.properties?.vipaka }
                ].map((prop, idx) => (
                  <div key={idx} className="p-5 rounded-2xl flex flex-col justify-center items-center text-center" style={glassCardStyle}>
                    <span className="text-sm font-medium mb-2" style={{ color: '#c4956a' }}>{prop.label}</span>
                    <span className="font-medium text-lg" style={{ color: '#fdf6e3' }}>{prop.value}</span>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-2xl" style={glassCardStyle}>
                <h3 className="text-lg font-serif mb-4 flex items-center gap-2" style={{ fontFamily: '"Playfair Display", serif', color: '#e8a045' }}>
                  <List className="w-5 h-5 text-[#c4956a]" /> Traditional Uses
                </h3>
                <ul className="space-y-4">
                  {herb.traditional_uses?.map((use, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5" style={{ backgroundColor: 'rgba(232,160,69,0.2)', color: '#e8a045' }}>
                        {i + 1}
                      </span>
                      <span className="leading-relaxed" style={{ color: 'rgba(253,246,227,0.85)' }}>{use}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </motion.div>
          )}

          {activeTab === 'cultivation' && (
            <motion.div key="cultivation" variants={tabContentVariants} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              
              {[
                { icon: Thermometer, label: 'Climate',     value: herb.cultivation?.climate },
                { icon: Mountain,    label: 'Soil',         value: herb.cultivation?.soil },
                { icon: Droplets,    label: 'Water',        value: herb.cultivation?.water },
                { icon: Sun,         label: 'Sunlight',     value: herb.cultivation?.sunlight },
                { icon: Sprout,      label: 'Propagation',  value: herb.cultivation?.propagation },
                { icon: Scissors,    label: 'Harvesting',   value: herb.cultivation?.harvesting }
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-2xl flex flex-col items-center text-center gap-3 transition-colors" style={glassCardStyle}>
                  <div className="p-3 rounded-xl shadow-inner" style={{ backgroundColor: 'rgba(26,20,16,0.5)', color: '#c4956a' }}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-widest mb-1" style={mutedText}>{item.label}</h4>
                    <p className="text-sm" style={{ color: '#fdf6e3' }}>{item.value || 'Information not available'}</p>
                  </div>
                </div>
              ))}

            </motion.div>
          )}

          {activeTab === 'safety' && (
            <motion.div key="safety" variants={tabContentVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              
              <div className="p-6 md:p-8 rounded-2xl relative overflow-hidden" style={{ backgroundColor: 'rgba(245,158,11,0.05)', borderColor: 'rgba(245,158,11,0.2)', borderWidth: '1px' }}>
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-amber-700"></div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <AlertTriangle className="w-8 h-8 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif mb-2 text-amber-400" style={{ fontFamily: '"Playfair Display", serif' }}>Safety Notes & Precautions</h3>
                    <p className="leading-relaxed text-sm md:text-base" style={{ color: 'rgba(253,246,227,0.85)' }}>
                       {herb.safety_notes || herb.safety || 'No specific safety notes available for this herb.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl text-center border" style={{ backgroundColor: 'rgba(255,220,150,0.03)', borderColor: 'rgba(232,160,69,0.1)' }}>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(253,246,227,0.4)' }}>Disclaimer</p>
                <p className="text-xs" style={{ color: 'rgba(253,246,227,0.5)' }}>
                  This information is provided for educational purposes only and is not intended to substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified Ayurvedic practitioner before using herbal remedies.
                </p>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HerbInfoDashboard;
