import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, Wand2 } from 'lucide-react';

const About = () => {
    const creator = { name: "Arnab", role: "Creator & Developer", color: "bg-[#cc5500]" };

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 bg-[#050505] text-[#f3f2ed] relative">
            {/* Film Grain */}
            <div className="film-grain" />
            
            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="text-[#cc5500] font-sans tracking-widest uppercase text-xs mb-4 block">Our Story</span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-[#f3f2ed]">
                        We Are <span className="text-[#cc5500] italic">Aether</span>
                    </h1>
                    <p className="text-xl text-[#f3f2ed]/50 max-w-3xl mx-auto font-light leading-relaxed">
                        Born from the chaos of group chats. We believe travel should be about 
                        <span className="font-bold text-[#f3f2ed]"> friends</span>, not spreadsheets.
                    </p>
                </motion.div>

                {/* Values Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {[
                        { title: "Zero Friction", desc: "No more endless back-and-forth. Just decisions.", icon: <Sparkles size={32} /> },
                        { title: "Vibe First", desc: "We match moods, not just budgets.", icon: <Target size={32} /> },
                        { title: "AI Magic", desc: "Smart suggestions that feel intuitive.", icon: <Wand2 size={32} /> }
                    ].map((item, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card p-8 text-center rounded-xl hover:shadow-[0_0_30px_rgba(204,85,0,0.1)] transition-all duration-500"
                        >
                            <div className="text-4xl mb-6 text-[#cc5500]">{item.icon}</div>
                            <h3 className="text-2xl font-serif text-[#f3f2ed] mb-3">{item.title}</h3>
                            <p className="text-[#f3f2ed]/40 font-sans text-sm">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Creator Section */}
                <h2 className="text-4xl font-serif font-bold text-center mb-12 text-[#f3f2ed]">The Creator</h2>
                <div className="flex justify-center">
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="glass-card p-8 flex flex-col items-center gap-4 rounded-xl max-w-sm text-center"
                    >
                        <div className={`w-20 h-20 rounded-xl flex items-center justify-center font-bold text-2xl ${creator.color} text-white`}>
                            {creator.name[0]}
                        </div>
                        <div>
                            <h4 className="font-serif text-2xl text-[#f3f2ed]">{creator.name}</h4>
                            <p className="text-[#cc5500] text-sm font-sans uppercase tracking-wide mt-1">{creator.role}</p>
                        </div>
                        <p className="text-[#f3f2ed]/40 text-sm font-sans mt-2">
                            Built with passion for travel and friends who want to explore the world together.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default About;

