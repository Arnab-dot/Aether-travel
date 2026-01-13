
import React from 'react';
import { motion } from 'framer-motion';

const Marquee = ({ items, speed = 25 }) => {
    return (
        <div className="relative flex overflow-x-hidden group bg-[#0a0a0a]/50 backdrop-blur-sm border-y border-[#cc5500]/20 py-4">
            <MarqueeContent items={items} duration={speed} />
            <MarqueeContent items={items} duration={speed} />
        </div>
    );
};

const MarqueeContent = ({ items, duration }) => (
    <motion.div 
        initial={{ x: 0 }}
        animate={{ x: "-100%" }}
        transition={{ 
            duration: duration, 
            ease: "linear", 
            repeat: Infinity,
            repeatType: "loop" 
        }}
        className="flex flex-shrink-0 gap-16 text-[#f3f2ed]/60 font-serif font-bold text-2xl uppercase tracking-widest px-8"
        style={{ width: "max-content" }}
    >
        {items.map((item, idx) => (
            <span key={idx} className="flex items-center gap-8">
                {item} <span className="w-2 h-2 rounded-full bg-[#cc5500]"></span>
            </span>
        ))}
    </motion.div>
);

export default Marquee;

