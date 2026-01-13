import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Clock, Sparkles, ArrowLeft } from 'lucide-react';

const ComingSoon = ({ featureName = "This Feature", onBack }) => {
    return (
        <div className="min-h-screen pt-24 px-4 bg-[#050505] text-[#f3f2ed] flex items-center justify-center relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#cc5500]/5 via-transparent to-[#cc5500]/10 pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#cc5500]/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-900/20 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
            
            {/* Film Grain */}
            <div className="film-grain" />

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-2xl w-full text-center z-10 relative"
            >
                {/* Icon Container */}
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 mx-auto mb-8 relative"
                >
                    <div className="absolute inset-0 bg-[#cc5500]/20 rounded-2xl blur-xl animate-pulse" />
                    <div className="relative w-full h-full bg-gradient-to-br from-[#cc5500] to-orange-800 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-900/30">
                        <Rocket size={40} className="text-white" />
                    </div>
                </motion.div>

                {/* Main Heading */}
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-[#cc5500] font-mono text-xs tracking-[0.3em] uppercase mb-4"
                >
                    Under Development
                </motion.p>

                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight"
                >
                    <span className="text-[#cc5500]">{featureName}</span>
                    <br />
                    <span className="text-[#f3f2ed]">Coming Soon</span>
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-[#f3f2ed]/50 text-lg max-w-lg mx-auto leading-relaxed mb-12 font-light"
                >
                    We're crafting something extraordinary. This feature is currently being 
                    developed with meticulous attention to detail to ensure the best 
                    experience for you and your travel companions.
                </motion.p>

                {/* Status Cards */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="grid md:grid-cols-3 gap-4 mb-12"
                >
                    <div className="glass-card p-6 rounded-xl border border-white/5 hover:border-[#cc5500]/30 transition-all group">
                        <Clock size={24} className="text-[#cc5500] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="font-serif text-lg text-[#f3f2ed] mb-1">In Progress</h3>
                        <p className="text-[#f3f2ed]/40 text-sm">Active development</p>
                    </div>
                    <div className="glass-card p-6 rounded-xl border border-white/5 hover:border-[#cc5500]/30 transition-all group">
                        <Sparkles size={24} className="text-[#cc5500] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="font-serif text-lg text-[#f3f2ed] mb-1">Premium Design</h3>
                        <p className="text-[#f3f2ed]/40 text-sm">Worth the wait</p>
                    </div>
                    <div className="glass-card p-6 rounded-xl border border-white/5 hover:border-[#cc5500]/30 transition-all group">
                        <Rocket size={24} className="text-[#cc5500] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="font-serif text-lg text-[#f3f2ed] mb-1">Launching Soon</h3>
                        <p className="text-[#f3f2ed]/40 text-sm">Stay tuned</p>
                    </div>
                </motion.div>

                {/* What to Expect */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="glass-panel p-8 rounded-2xl border border-white/10 mb-8 text-left"
                >
                    <h3 className="text-xl font-serif text-[#f3f2ed] mb-4 flex items-center gap-2">
                        <span className="text-[#cc5500]">[INFO]</span> What to Expect
                    </h3>
                    <ul className="space-y-3 text-[#f3f2ed]/60 font-mono text-sm">
                        <li className="flex items-start gap-3">
                            <span className="text-[#cc5500] mt-1">*</span>
                            <span>Seamless integration with your existing travel plans</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#cc5500] mt-1">*</span>
                            <span>AI-powered recommendations tailored to your group</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#cc5500] mt-1">*</span>
                            <span>Real-time collaboration with your travel companions</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#cc5500] mt-1">*</span>
                            <span>Premium design that matches the Aether experience</span>
                        </li>
                    </ul>
                </motion.div>

                {/* Back Button */}
                {onBack && (
                    <motion.button 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        onClick={onBack}
                        className="inline-flex items-center gap-2 text-[#f3f2ed]/50 hover:text-[#cc5500] transition-colors font-mono text-sm uppercase tracking-widest"
                    >
                        <ArrowLeft size={16} />
                        Return to Previous Page
                    </motion.button>
                )}

                {/* Footer Note */}
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="mt-12 text-[#f3f2ed]/30 font-mono text-xs tracking-widest uppercase"
                >
                    Aether - Friends. Travel. Legends.
                </motion.p>
            </motion.div>
        </div>
    );
};

export default ComingSoon;
