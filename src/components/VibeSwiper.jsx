
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VibeCard from './VibeCard';
import { X, Heart, MapPin, Globe } from 'lucide-react';
import axios from 'axios';

import { API_URL } from '../config';

const VibeSwiper = ({ city, state, onComplete }) => {
    const [mode, setMode] = useState(null); // 'local' or 'global' or null (selection)
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [likedCards, setLikedCards] = useState([]);
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [currentReason, setCurrentReason] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch cards based on mode
    useEffect(() => {
        if (!mode) return;

        const fetchVibes = async () => {
            setLoading(true);
            try {
                // In a real app, use the API url from environment
                const response = await axios.get(`${API_URL}/api/vibes/?type=${mode}&city=${city}&state=${state}`);
                setCards(response.data);
            } catch (error) {
                console.error("Failed to fetch vibes", error);
                // Fallback dummy data if API fails to avoid breaking flow
                setCards([
                    { id: 'error_1', title: 'Server Error', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80', tags: ['Retry'], desc: 'Could not load vibes.' }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchVibes();
    }, [mode, city, state]);

    const handleSwipe = (direction, card) => {
        if (direction === 'right') {
            setShowReasonModal(true); // Pause flow to ask reason
        } else {
            nextCard();
        }
    };

    const handleReasonSubmit = () => {
        const card = cards[currentIndex];
        // Save the liked card with the reason
        setLikedCards(prev => [...prev, { ...card, reason: currentReason }]);
        setShowReasonModal(false);
        setCurrentReason("");
        nextCard();
    };

    const nextCard = () => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // Deck complete
            onFinish();
        }
    };

    const onFinish = () => {
         // Construct the final destinations list for the backend
         // Format: { name: "Title", description: "Reason they typed + Original Desc" }
         const results = likedCards.map(c => ({
            name: c.title,
            description: `I liked this because: ${c.reason}. Context: ${c.desc || ''}`
         }));
         onComplete(results);
    };

    // 1. Mode Selection Screen
    if (!mode) {
        return (
            <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
                <h2 className="text-3xl font-bold font-heading text-white text-center mb-4">Choose Your Path</h2>
                
                <button 
                    onClick={() => setMode('local')}
                    className="group relative h-48 w-full rounded-3xl overflow-hidden shadow-2xl border border-white/20 transition-transform hover:scale-105"
                >
                    <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" className="absolute inset-0 w-full h-full object-cover" alt="Local" />
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors"></div>
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6 text-center">
                        <MapPin size={48} className="mb-2 text-primary" />
                        <h3 className="text-2xl font-bold">Stay Local</h3>
                        <p className="text-sm opacity-80">Explore hidden gems near {city}</p>
                    </div>
                </button>

                <button 
                    onClick={() => setMode('global')}
                    className="group relative h-48 w-full rounded-3xl overflow-hidden shadow-2xl border border-white/20 transition-transform hover:scale-105"
                >
                    <img src="https://images.unsplash.com/photo-1476900966873-6713060bd384?auto=format&fit=crop&w=600&q=80" className="absolute inset-0 w-full h-full object-cover" alt="Global" />
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors"></div>
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6 text-center">
                        <Globe size={48} className="mb-2 text-secondary" />
                        <h3 className="text-2xl font-bold">Go Global</h3>
                        <p className="text-sm opacity-80">Discover world-class icons</p>
                    </div>
                </button>
            </div>
        );
    }

    // 2. Loading State
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
                <p>Curating your vibes...</p>
            </div>
        );
    }

    // 3. Swiper Interface
    return (
        <div className="w-full max-w-sm mx-auto h-[600px] relative perspective-1000">
             {/* Reason Modal Overlay */}
             <AnimatePresence>
                {showReasonModal && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-xl rounded-3xl flex flex-col items-center justify-center p-8 border border-white/10"
                    >
                         <Heart size={48} className="text-secondary mb-4 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]" />
                         <h3 className="text-2xl font-bold text-white mb-2 text-center">Good Vibe!</h3>
                         <p className="text-slate-400 text-center mb-6">Why does this place speak to you?</p>
                         
                         <textarea
                            value={currentReason}
                            onChange={(e) => setCurrentReason(e.target.value)}
                            className="w-full h-32 bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary mb-6 resize-none"
                            placeholder="e.g. I love the chaos, I need peace..."
                            autoFocus
                         />

                         <button 
                            onClick={handleReasonSubmit}
                            disabled={!currentReason.trim()}
                            className="w-full py-3 bg-gradient-to-r from-primary to-secondary rounded-xl font-bold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Confirm Selection
                         </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cards Stack */}
            <AnimatePresence>
                {cards.map((card, index) => {
                    // Only render current and next card for performance
                    if (index < currentIndex || index > currentIndex + 1) return null;
                    const isCurrent = index === currentIndex;
                    
                    return (
                        <div 
                            key={card.id} 
                            className="absolute inset-0 w-full h-full"
                            style={{ zIndex: isCurrent ? 10 : 5 }} // Active card on top
                        >
                            <VibeCard 
                                data={card}
                                active={isCurrent}
                                onSwipe={handleSwipe}
                            />
                        </div>
                    );
                })}
            </AnimatePresence>

            {/* Completed State (if deck empty) */}
             {currentIndex >= cards.length && (
                <div className="h-full flex flex-col items-center justify-center text-white">
                    <h3 className="text-2xl font-bold mb-2">All Done!</h3>
                    <p className="text-slate-400 mb-6">Creating your profile...</p>
                    <button onClick={onFinish} className="px-6 py-2 bg-white/10 rounded-full">Finish</button>
                </div>
            )}
        </div>
    );
};

export default VibeSwiper;
