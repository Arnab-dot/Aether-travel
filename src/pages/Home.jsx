import React from 'react';
import { motion } from 'framer-motion';
import { Plane, ArrowRight, Sparkles, Heart, Shield, Users, Zap } from 'lucide-react';
import VideoBackground from '../components/VideoBackground';
import Marquee from '../components/Marquee';

const Home = ({ onStart, onNavigate }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-16 bg-[#050505] text-[#f3f2ed]">
        {/* Film Grain */}
        <div className="film-grain" />
        
        {/* Video Background */}
        <VideoBackground />
        
        {/* Floating Background Blobs - Burnt Orange */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#cc5500] rounded-full mix-blend-overlay filter blur-[150px] opacity-10 animate-pulse-slow z-10"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#f3f2ed] rounded-full mix-blend-overlay filter blur-[150px] opacity-5 animate-pulse-slow delay-1000 z-10"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="mb-8 inline-block">
                    <span className="px-4 py-2 border border-[#cc5500] bg-[#0a0a0a]/50 backdrop-blur-md text-[10px] font-sans tracking-[0.3em] text-[#cc5500] uppercase flex items-center gap-2 rounded-full">
                        <Sparkles size={12} /> Friends Travel Together
                    </span>
                </div>

                <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6 leading-tight text-[#f3f2ed]">
                    Where <br/>
                    <span className="text-gradient-accent italic">
                        Stories Begin
                    </span>
                </h1>
                <p className="text-xl md:text-2xl text-[#f3f2ed]/50 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                    Plan adventures with your people. <span className="text-[#f3f2ed] font-serif italic">Zero friction. Pure memories.</span>
                </p>
                
                <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                    {localStorage.getItem('user_type') === 'ADMIN' ? (
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onNavigate('create')}
                            className="btn-primary flex items-center gap-2"
                        >
                            Create Squad <Zap size={16} />
                        </motion.button>
                    ) : localStorage.getItem('user_type') === 'MEMBER' ? (
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onNavigate('join')}
                            className="btn-primary flex items-center gap-2"
                        >
                            Join Squad <Plane size={16} className="transform -rotate-45" />
                        </motion.button>
                    ) : (
                         <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onStart}
                            className="btn-primary flex items-center gap-2"
                        >
                            Start Journey <ArrowRight size={16} />
                        </motion.button>
                    )}
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onNavigate('about')}
                        className="btn-outline flex items-center gap-2"
                    >
                        Our Story <ArrowRight size={16} />
                    </motion.button>
                </div>
            </motion.div>
        </div>

        {/* Marquee Banner */}
        <div className="w-full mt-24 mb-16 rotate-1 opacity-40">
            <Marquee items={[
                "PLAN TOGETHER",
                "TRAVEL TOGETHER",
                "MEMORIES FOREVER",
                "FRIENDS FIRST",
                "ADVENTURES AWAIT",
                "AETHER"
            ]} />
        </div>

        {/* Why Travel Together Section */}
        <div className="max-w-7xl mx-auto px-4 mb-32 relative z-10 text-left w-full">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#cc5500] rounded-full opacity-10 filter blur-3xl animate-pulse"></div>
                    <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-[#f3f2ed] leading-tight">
                        Why We <br/> <span className="text-[#cc5500] italic">Travel?</span>
                    </h2>
                    <p className="text-xl text-[#f3f2ed]/50 font-light leading-relaxed mb-8">
                        The destination is just the excuse. The real journey is with your people. 
                        <br/><br/>
                        <span className="text-[#f3f2ed] font-sans text-sm uppercase tracking-wider flex items-center gap-2"><Sparkles size={14} className="text-[#cc5500]"/> Shared Moments:</span> Experiences are amplified together.
                        <br/>
                        <span className="text-[#f3f2ed] font-sans text-sm uppercase tracking-wider flex items-center gap-2"><Heart size={14} className="text-[#cc5500]"/> Deep Bonds:</span> Discover new sides of your friends.
                        <br/>
                        <span className="text-[#f3f2ed] font-sans text-sm uppercase tracking-wider flex items-center gap-2"><Shield size={14} className="text-[#cc5500]"/> Safety Net:</span> Explore further. It's safer together.
                    </p>
                    <button 
                        onClick={() => onNavigate('about')}
                        className="btn-outline flex items-center gap-2"
                    >
                        Read Manifesto <ArrowRight size={14} />
                    </button>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative h-[500px] w-full"
                >
                    <div className="absolute inset-0 glass-panel flex items-center justify-center p-8 rounded-xl">
                        <div className="grid grid-cols-2 gap-4 w-full h-full">
                             <div className="relative overflow-hidden group rounded-lg border border-white/10 hover:border-[#cc5500]/50 transition-all">
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all z-10"></div>
                                <div className="absolute bottom-4 left-4 font-sans text-[#f3f2ed] text-xs uppercase tracking-widest z-20">Laughter</div>
                                <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500" alt="Friends" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all group-hover:scale-105" />
                             </div>
                             <div className="relative overflow-hidden group rounded-lg border border-white/10 hover:border-[#cc5500]/50 transition-all translate-y-8">
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all z-10"></div>
                                <div className="absolute bottom-4 left-4 font-sans text-[#f3f2ed] text-xs uppercase tracking-widest z-20">Adventure</div>
                                <img src="https://images.unsplash.com/photo-476514525535-07fb3b4ae5f1?w=500" alt="Adventure" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all group-hover:scale-105" />
                             </div>
                             <div className="relative overflow-hidden group rounded-lg border border-white/10 hover:border-[#cc5500]/50 transition-all -translate-y-8">
                                 <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all z-10"></div>
                                <div className="absolute bottom-4 left-4 font-sans text-[#f3f2ed] text-xs uppercase tracking-widest z-20">Discovery</div>
                                <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500" alt="Discovery" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all group-hover:scale-105" />
                             </div>
                             <div className="relative overflow-hidden group rounded-lg border border-white/10 hover:border-[#cc5500]/50 transition-all">
                                 <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all z-10"></div>
                                <div className="absolute bottom-4 left-4 font-sans text-[#f3f2ed] text-xs uppercase tracking-widest z-20">Freedom</div>
                                <img src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=500" alt="Freedom" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all group-hover:scale-105" />
                             </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid md:grid-cols-4 gap-6 w-full max-w-7xl z-10 px-4 mb-20">
            {[
                { title: "Squad Sync", icon: <Users size={24} />, desc: "Build your crew instantly." },
                { title: "Vibe Match", icon: <Sparkles size={24} />, desc: "AI finds your perfect spots." },
                { title: "Smart Plans", icon: <Zap size={24} />, desc: "Data-driven itineraries." },
                { title: "Zero Drama", icon: <Heart size={24} />, desc: "Decisions made fair & easy." }
            ].map((feature, idx) => (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="glass-card p-8 text-left rounded-xl group"
                >
                    <div className="mb-4 text-[#f3f2ed]/50 group-hover:text-[#cc5500] transition-colors">{feature.icon}</div>
                    <h3 className="text-lg font-serif italic mb-2 text-[#f3f2ed]">{feature.title}</h3>
                    <p className="text-[#f3f2ed]/40 font-sans text-xs tracking-wide">{feature.desc}</p>
                </motion.div>
            ))}
        </div>
    </div>
  );
};

export default Home;

