import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Sparkles, User, Coffee, Camera, Compass, PartyPopper, Check, Globe, Target, ArrowRight } from 'lucide-react';
import axios from 'axios';

import { API_URL } from '../config';

const JoinGroup = ({ joinData, setJoinData, handleJoinGroup, joinMessage }) => {
    const [step, setStep] = useState(1);
    const [suggestions, setSuggestions] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    
    // PERSONAS (Gamification)
    const personas = [
        { id: 'foodie', label: 'Culinary Specialist', icon: Coffee, text: "Searching for culinary gems." },
        { id: 'explorer', label: 'Navigator', icon: Compass, text: "Seeking hidden paths." },
        { id: 'photographer', label: 'Documentation', icon: Camera, text: "Chasing the perfect light." },
        { id: 'party', label: 'Social Link', icon: PartyPopper, text: "Looking for vibrant nights." },
    ];

    useEffect(() => {
        if (!joinData.destinations || joinData.destinations.length === 0) {
            setJoinData(prev => ({ ...prev, destinations: [{ type: '', description: '' }] }));
        }
    }, []);

    useEffect(() => {
        if (step === 2 && joinData.city) {
            fetchSuggestions();
        }
    }, [step]);

    const fetchSuggestions = async (category = null) => {
        setSuggestions([]); 
        setLoadingSuggestions(true);
        try {
            let url = `${API_URL}/api/vibes/?type=local&city=${joinData.city}`;
            if (category) url += `&category=${category}`;
            if (joinData.budget) url += `&budget=${joinData.budget}`;
            const response = await axios.get(url);
            setSuggestions(response.data);
        } catch (error) {
            console.error("Failed to fetch suggestions", error);
        } finally {
            setLoadingSuggestions(false);
        }
    };

    const addSuggestion = (place) => {
        const currentDests = [...joinData.destinations];
        if (currentDests.length === 1 && !currentDests[0].type) {
            currentDests[0] = { type: place.name || place.title, description: place.desc || '' };
        } else {
            currentDests.push({ type: place.name || place.title, description: place.desc || '' });
        }
        setJoinData({ ...joinData, destinations: currentDests });
    };

    const addPersona = (index, persona) => {
        const currentDests = [...joinData.destinations];
        currentDests[index].description = persona.text;
        setJoinData({ ...joinData, destinations: currentDests });
        fetchSuggestions(persona.label); 
    };

    const updateDestination = (index, field, value) => {
        const newDests = [...joinData.destinations];
        newDests[index][field] = value;
        setJoinData({ ...joinData, destinations: newDests });
    };

    const addNewRow = () => {
        setJoinData({ ...joinData, destinations: [...joinData.destinations, { type: '', description: '' }] });
    };

    const removeRow = (index) => {
        if (joinData.destinations.length > 1) {
            const newDests = joinData.destinations.filter((_, i) => i !== index);
            setJoinData({ ...joinData, destinations: newDests });
        }
    };

    const nextStep = (e) => {
        e.preventDefault();
        if (step === 1) {
            if (joinData.create_spid && joinData.name && joinData.city) setStep(2);
            else alert("Please fill all mission details.");
        } else if (step === 2) {
             setStep(3);
        } else if (step === 3) {
             setStep(4); 
        } else {
            handleJoinGroup(e);
        }
    };

    const handleBudgetSelect = (v) => {
        setJoinData({ ...joinData, budget: v });
    };

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 flex justify-center items-start bg-[#050505] text-[#f3f2ed] relative">
             {/* Film Grain */}
             <div className="film-grain" />
             
             {/* Background Ambience */}
             <div className="absolute inset-0 bg-gradient-to-br from-[#020202] via-[#0a0a0a] to-[#050505]" />
             <motion.div 
                animate={{ y: [0, -20, 0], opacity: [0.08, 0.15, 0.08] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 left-10 w-[800px] h-[800px] bg-[#cc5500]/10 rounded-full blur-[150px] pointer-events-none" 
             />
             <motion.div 
                animate={{ y: [0, 15, 0], opacity: [0.05, 0.1, 0.05] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-[#f3f2ed]/5 rounded-full blur-[150px] pointer-events-none" 
             />

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl w-full relative z-10"
            >
                {/* Decorative Corners */}
                <div className="absolute -top-3 -left-3 w-10 h-10 border-t-2 border-l-2 border-[#cc5500]/40" />
                <div className="absolute -top-3 -right-3 w-10 h-10 border-t-2 border-r-2 border-[#cc5500]/40" />
                <div className="absolute -bottom-3 -left-3 w-10 h-10 border-b-2 border-l-2 border-[#cc5500]/40" />
                <div className="absolute -bottom-3 -right-3 w-10 h-10 border-b-2 border-r-2 border-[#cc5500]/40" />

                <div className="glass-panel border border-white/10 p-10 md:p-12">
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 h-1 bg-white/5 w-full">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-[#cc5500] to-[#ff7733]" 
                            initial={{ width: '0%' }}
                            animate={{ width: step === 1 ? '25%' : step === 2 ? '50%' : step === 3 ? '75%' : '100%' }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                    </div>

                    <div className="mb-10 mt-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-[#cc5500]/20 border border-[#cc5500]/40 flex items-center justify-center">
                                {step === 1 ? <Globe size={16} className="text-[#cc5500]" /> : 
                                 step === 2 ? <Target size={16} className="text-[#cc5500]" /> : 
                                 step === 3 ? <Sparkles size={16} className="text-[#cc5500]" /> : 
                                 <Compass size={16} className="text-[#cc5500]" />}
                            </div>
                            <span className="text-[#cc5500] text-xs font-sans uppercase tracking-widest">
                                {step === 1 ? "Connection" : step === 2 ? "Planning" : step === 3 ? "Budget" : "Style"}
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif text-[#f3f2ed] mb-3 leading-tight">
                            {step === 1 ? "Join the" : step === 2 ? "Set Your" : step === 3 ? "Choose Your" : "Pick Your"}
                            <span className="text-[#cc5500] italic block mt-1">
                                {step === 1 ? "Expedition" : step === 2 ? "Goals" : step === 3 ? "Budget" : "Rhythm"}
                            </span>
                        </h2>
                        <p className="text-[#f3f2ed]/40 font-sans text-sm max-w-md">
                            {step === 1 ? "Enter your details to connect with your squad." : 
                             step === 2 ? "Tell us what experiences you're looking for." : 
                             step === 3 ? "Select a resource allocation that fits your style." : 
                             "How do you like to travel?"}
                        </p>
                    </div>

                <form onSubmit={nextStep}>
                    {/* STEP 1: IDENTITY */}
                    {step === 1 && (
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputGroup label="Squad Code" placeholder="e.g. Ladakh_2026" value={joinData.create_spid} onChange={e => setJoinData({...joinData, create_spid: e.target.value})} icon={<Globe size={18} />} />
                                <InputGroup label="Your Name" placeholder="How should we call you?" value={joinData.name} onChange={e => setJoinData({...joinData, name: e.target.value})} icon={<User size={18} />} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputGroup label="Where You're From" placeholder="Your City" value={joinData.state} onChange={e => setJoinData({...joinData, state: e.target.value})} icon={<MapPin size={18} />} />
                                <InputGroup label="Destination" placeholder="Where to?" value={joinData.city} onChange={e => setJoinData({...joinData, city: e.target.value})} icon={<Target size={18} />} />
                            </div>
                            <button type="submit" className="w-full py-5 mt-8 bg-[#cc5500] text-[#f3f2ed] font-sans text-sm uppercase tracking-[0.2em] hover:bg-[#e66600] transition-all flex items-center justify-center gap-3 group">
                                Continue <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 2: PREFERENCES */}
                    {step === 2 && (
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-8">
                            
                            {/* Smart Suggestions */}
                            <div className="bg-[#0a0a0a]/50 p-6 border border-white/5 relative overflow-hidden">
                                <div className="flex items-center gap-2 mb-4 text-[#cc5500] font-mono text-xs uppercase tracking-widest">
                                    <Sparkles size={14} />
                                    <h3>Curated Vibes: {joinData.city}</h3>
                                </div>
                                {loadingSuggestions ? (
                                    <div className="flex gap-2 animate-pulse overflow-hidden py-2">
                                        {[1,2,3].map(i => <div key={i} className="h-8 w-24 bg-white/5 border border-white/10"></div>)}
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2 pb-2">
                                        <AnimatePresence mode="popLayout">
                                            {suggestions.map((place, i) => (
                                                <motion.button
                                                    key={place.id || i}
                                                    layout
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    exit={{ scale: 0, opacity: 0 }}
                                                    type="button"
                                                    onClick={() => addSuggestion(place)}
                                                    className="px-4 py-2 bg-white/5 hover:bg-[#cc5500]/20 border border-white/10 hover:border-[#cc5500] text-gray-400 text-xs font-mono uppercase tracking-wide transition-all hover:text-[#cc5500]"
                                                >
                                                    {place.name || place.title}
                                                </motion.button>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>

                            {/* Destination Inputs */}
                            <div className="space-y-4">
                                {joinData.destinations.map((dest, idx) => (
                                    <motion.div 
                                        key={idx}
                                        layout
                                        className="bg-[#0a0a0a] p-6 border border-white/10 relative group hover:border-[#cc5500]/50 transition-colors"
                                    >
                                        <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#cc5500]">Stop {String(idx + 1).padStart(2,'0')}</span>
                                            {joinData.destinations.length > 1 && (
                                                <button type="button" onClick={() => removeRow(idx)} className="text-red-900 hover:text-red-500 text-[10px] font-mono uppercase opacity-0 group-hover:opacity-100 transition-opacity">Dismiss</button>
                                            )}
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <input 
                                                type="text" 
                                                placeholder="Place Name"
                                                className="w-full text-lg font-serif bg-transparent text-black border-none p-0 focus:ring-0 placeholder:text-gray-500 placeholder:font-sans tracking-wide"
                                                value={dest.type}
                                                onChange={(e) => updateDestination(idx, 'type', e.target.value)}
                                            />
                                            <textarea 
                                                placeholder="Notes: What do you want to do here?"
                                                className="w-full bg-transparent text-black text-sm border-none p-0 focus:ring-0 placeholder:text-gray-500 font-mono min-h-[60px] resize-none leading-relaxed"
                                                value={dest.description}
                                                onChange={(e) => updateDestination(idx, 'description', e.target.value)}
                                            />
                                            
                                            {/* Persona Badges */}
                                            <div className="flex gap-2 pt-2 flex-wrap">
                                                {personas.map(p => (
                                                    <button
                                                        key={p.id}
                                                        type="button"
                                                        onClick={() => addPersona(idx, p)}
                                                        className="flex items-center gap-1 px-3 py-1.5 border border-white/5 text-gray-500 text-[10px] font-mono uppercase hover:bg-[#cc5500]/10 hover:text-[#cc5500] hover:border-[#cc5500]/30 transition-all"
                                                        title={p.text}
                                                    >
                                                        <p.icon size={12} /> {p.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <button 
                                type="button" 
                                onClick={addNewRow}
                                className="w-full py-4 border border-dashed border-white/20 text-gray-500 font-mono text-xs uppercase hover:border-[#cc5500] hover:text-[#cc5500] transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={14} /> Add Stop
                            </button>

                            <motion.button 
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                className="w-full py-4 bg-[#cc5500] text-black font-mono text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-white transition-all"
                            >
                                Continue →
                            </motion.button>
                        </motion.div>
                    )}

                    {/* STEP 3: BUDGET */}
                    {step === 3 && (
                         <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-8">
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { id: 'Economy', label: 'Lean', icon: 'M', desc: 'Efficiency focus.' },
                                    { id: 'Standard', label: 'Balanced', icon: 'B', desc: 'Standard protocol.' },
                                    { id: 'Luxury', label: 'Elite', icon: 'E', desc: 'Maximum resources.' },
                                    { id: 'Flexible', label: 'Adaptive', icon: 'A', desc: 'Liquid assets.' }
                                ].map((b) => (
                                    <div 
                                        key={b.id}
                                        onClick={() => handleBudgetSelect(b.id)}
                                        className={`p-6 border cursor-pointer transition-all ${joinData.budget === b.id ? 'border-[#cc5500] bg-[#cc5500]/10' : 'border-white/5 hover:border-white/20 hover:bg-white/5'}`}
                                    >
                                        <div className="text-2xl mb-3 font-serif italic text-white/50">{b.icon}</div>
                                        <div className="font-mono font-bold text-sm text-white uppercase tracking-wider">{b.label}</div>
                                        <div className="text-[10px] text-gray-500 mt-1 uppercase font-mono">{b.desc}</div>
                                        {joinData.budget === b.id && <div className="mt-2 text-[#cc5500]"><Check size={16} /></div>}
                                    </div>
                                ))}
                            </div>
                            
                            <motion.button 
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                className="w-full py-4 bg-[#cc5500] text-black font-mono text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-white transition-all"
                            >
                                Confirm Allocation
                            </motion.button>
                         </motion.div>
                    )}

                    {/* STEP 4: TRAVEL STYLE */}
                    {step === 4 && (
                         <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-8">
                             {/* Energy Level */}
                             <div>
                                 <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500 mb-4 block">Energy Level</label>
                                 <div className="grid grid-cols-3 gap-4">
                                    {['Low', 'Medium', 'High'].map(l => (
                                        <div key={l} onClick={() => setJoinData({...joinData, energy_level: l})} 
                                            className={`p-4 border cursor-pointer text-center font-mono text-xs uppercase tracking-wider text-white transition-all ${joinData.energy_level === l ? 'border-[#cc5500] bg-[#cc5500]/20' : 'border-white/10 hover:bg-white/5'}`}>
                                            {l}
                                        </div>
                                    ))}
                                 </div>
                             </div>

                             {/* Activity Pace */}
                             <div>
                                 <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500 mb-4 block">Pace</label>
                                 <div className="grid grid-cols-3 gap-4">
                                    {['Relaxed', 'Moderate', 'Fast'].map(l => (
                                        <div key={l} onClick={() => setJoinData({...joinData, activity_pace: l})} 
                                            className={`p-4 border cursor-pointer text-center font-mono text-xs uppercase tracking-wider text-white transition-all ${joinData.activity_pace === l ? 'border-[#cc5500] bg-[#cc5500]/20' : 'border-white/10 hover:bg-white/5'}`}>
                                            {l}
                                        </div>
                                    ))}
                                 </div>
                             </div>

                            <motion.button 
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                className="w-full py-4 border border-white text-white hover:bg-white hover:text-black font-mono text-xs uppercase tracking-[0.2em] transition-all"
                            >
                                Confirm & Join
                            </motion.button>
                         </motion.div>
                    )}

                </form>

                <AnimatePresence>
                    {joinMessage && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-4 bg-[#cc5500]/10 border border-[#cc5500]/30 text-[#cc5500] text-center font-mono text-xs uppercase tracking-widest">
                            {joinMessage}
                        </motion.div>
                    )}
                </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

const InputGroup = ({ label, placeholder, value, onChange, icon }) => (
    <div className="space-y-3">
        <label className="text-xs font-sans uppercase tracking-widest text-[#f3f2ed]/50 ml-1 flex items-center gap-2">
            <div className="w-1 h-4 bg-[#cc5500]" />
            {label}
        </label>
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f3f2ed]/20 group-focus-within:text-[#cc5500] transition-colors">
                {icon}
            </div>
            <input 
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required
                className="w-full pl-14 pr-5 py-4 bg-[#0a0a0a] border-2 border-white/10 text-black font-serif text-lg focus:border-[#cc5500] outline-none transition-all placeholder:text-gray-500"
            />
        </div>
    </div>
);

export default JoinGroup;
