
import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const VibeCard = ({ data, onSwipe, active }) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-30, 30]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 1, 1, 1, 0.5]);
    
    // Color overlays based on swipe direction
    const likeOpacity = useTransform(x, [0, 150], [0, 1]);
    const nopeOpacity = useTransform(x, [0, -150], [0, 1]);

    const handleDragEnd = (event, info) => {
        if (info.offset.x > 100) {
            onSwipe('right', data);
        } else if (info.offset.x < -100) {
            onSwipe('left', data);
        }
    };

    if (!active) return null;

    return (
        <motion.div
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-[#0a0a0a] cursor-grab active:cursor-grabbing origin-bottom border border-white/10"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Image Background */}
            <div className="h-full w-full relative">
                <img 
                    src={data.image} 
                    alt={data.title}
                    className="h-full w-full object-cover pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/20 to-transparent"></div>
                
                {/* Swipe Indicators */}
                <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 bg-[#cc5500]/90 backdrop-blur px-4 py-2 rounded-xl border-2 border-[#f3f2ed] transform -rotate-12 z-20">
                    <span className="text-[#f3f2ed] font-bold text-2xl uppercase tracking-widest">VIBE!</span>
                </motion.div>
                <motion.div style={{ opacity: nopeOpacity }} className="absolute top-8 right-8 bg-red-500/90 backdrop-blur px-4 py-2 rounded-xl border-2 border-[#f3f2ed] transform rotate-12 z-20">
                    <span className="text-[#f3f2ed] font-bold text-2xl uppercase tracking-widest">NOPE</span>
                </motion.div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-8 z-10 text-left">
                    <div className="flex gap-2 mb-3 flex-wrap">
                        {data.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-[#cc5500]/20 backdrop-blur rounded-full text-xs text-[#cc5500] font-sans uppercase tracking-wide border border-[#cc5500]/30">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h2 className="text-4xl font-serif font-bold text-[#f3f2ed] mb-2">{data.title}</h2>
                    {data.desc && (
                        <p className="text-[#f3f2ed]/60 text-sm line-clamp-2 max-w-[90%] font-sans">
                            {data.desc}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default VibeCard;

