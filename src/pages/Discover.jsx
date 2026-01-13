
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Search } from 'lucide-react';

const Discover = () => {
    const destinations = [
        { title: "Tropical Paradise", tag: "Beach", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80", desc: "Ancient temples, vibrant reefs, and sunsets that melt your heart." },
        { title: "Neon Nights", tag: "City", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80", desc: "A cyberpunk dreamscape where tradition meets the future." },
        { title: "Mountain High", tag: "Adventure", image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=600&q=80", desc: "Peak experiences for the adrenaline seekers." },
        { title: "Coastal Vibes", tag: "Party", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80", desc: "Sun, sand, and endless parties under the stars." },
        { title: "Romantic Escape", tag: "Culture", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80", desc: "The city of lights, love, and croissants." },
        { title: "Wild Elements", tag: "Nature", image: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=600&q=80", desc: "Fire and ice. Waterfalls and volcanoes." }
    ];

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 bg-[#050505] text-[#f3f2ed] relative overflow-hidden">
             {/* Film Grain */}
             <div className="film-grain" />
             
             {/* Ambient BG */}
             <div className="absolute inset-0 bg-[#020202]" />
             <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[#cc5500]/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#cc5500] rounded-full text-[#cc5500] text-xs font-sans uppercase tracking-widest mb-4">
                        <Sparkles size={14} className="animate-pulse" /> Destinations
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif text-[#f3f2ed] mb-6">
                        Explore the <span className="text-[#cc5500] italic">World</span>
                    </h1>
                    <p className="text-[#f3f2ed]/40 font-sans text-sm">Curated spots for every kind of traveler.</p>

                    {/* Search Bar */}
                    <div className="max-w-md mx-auto mt-8 relative group">
                        <input 
                            type="text" 
                            placeholder="Search destinations..." 
                            className="glass-input w-full px-6 py-4 pl-12 text-sm"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f3f2ed]/30 group-focus-within:text-[#cc5500] transition-colors" size={18} />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {destinations.map((dest, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            className="glass-card rounded-xl overflow-hidden group"
                        >
                            {/* Image Area */}
                            <div className="h-56 w-full relative overflow-hidden">
                                <img 
                                    src={dest.image} 
                                    alt={dest.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
                                <div className="absolute top-4 right-4 bg-[#0a0a0a]/80 border border-[#cc5500]/50 px-3 py-1 text-xs font-sans text-[#cc5500] uppercase tracking-widest rounded-full z-10">
                                    {dest.tag}
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <h3 className="text-xl font-serif text-[#f3f2ed] mb-3 group-hover:text-[#cc5500] transition-colors">{dest.title}</h3>
                                <p className="text-[#f3f2ed]/40 font-sans text-sm leading-relaxed mb-4">
                                    {dest.desc}
                                </p>
                                <button className="text-[#cc5500] font-sans text-xs tracking-wide uppercase hover:text-[#f3f2ed] transition-colors flex items-center gap-2">
                                    Explore <ArrowRight size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Discover;

