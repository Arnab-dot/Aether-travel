
import React from 'react';
import { motion } from 'framer-motion';

const Manifesto = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden bg-[#050505]">
        {/* Background Gradients - Cosmic Void */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#c0a080]/5 rounded-full blur-[120px] -z-10"></div>

        <div className="max-w-4xl mx-auto text-[#e0e0e0]">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <div className="inline-block mb-4 px-4 py-1 border border-[#c0a080] text-[10px] font-mono tracking-[0.3em] text-[#c0a080] uppercase">
                    Transmission
                </div>
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
                    The Aether <br/> <span className="text-[#c0a080] italic">Manifesto</span>
                </h1>
            </motion.div>

            <div className="space-y-20">
                <Section title="The Drift" delay={0.2}>
                    We believe travel is not about conquering geography. It is about <span className="text-[#c0a080]">surrendering to it</span>. 
                    The feeling of being suspended in a place where time dilates. 
                    We are not explorers; we are drifters seeking the silence between the noise.
                </Section>

                <Section title="Signal vs. Noise" delay={0.4}>
                    Let's face it: The world is loud. Planning is chaos. 
                    <em className="text-gray-500 block my-4 pl-4 border-l border-[#c0a080]">"Where do we go? The algorithm says Paris. My soul says void."</em>
                    <br/>
                    We built Aether to silence the static. 
                    Our systems don't just calculate routes; they detect <strong className="text-[#c0a080]">resonance</strong>. We align biological rhythms with geological coordinates.
                    It is technology designed to make you feel human again.
                </Section>

                <Section title="The Origin" delay={0.6}>
                    To escape the orbit of the mundane. To make "Departure" a state of mind.
                    We exist to provide the coordinates for those who wish to disappear into the sublime.
                </Section>
            </div>

            <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-24 text-center"
            >
                <div className="text-xl font-serif italic text-gray-600">
                    - The Aether Crew
                </div>
            </motion.div>
        </div>
    </div>
  );
};

const Section = ({ title, children, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.6 }}
        className="glass-card p-12 md:p-16 border-l border-[#c0a080]/30 bg-[#0a0a0a]/50"
    >
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-6 tracking-wide">{title}</h2>
        <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-light">
            {children}
        </p>
    </motion.div>
);

export default Manifesto;
