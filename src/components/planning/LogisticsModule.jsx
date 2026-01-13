import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plane, Train, Bus, Clock, Save, Edit2, Hotel, User, Zap, Activity, Heart, Shield, Sparkles, Car } from 'lucide-react';

const LogisticsModule = ({ spid }) => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    
    // Form State
    const [accommodation, setAccommodation] = useState('');
    const [transportMode, setTransportMode] = useState('Flight');
    const [departureTime, setDepartureTime] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (spid) fetchMembers();
    }, [spid]);

    const fetchMembers = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/group/${spid}/members/`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
            });
            setMembers(response.data.members || []);
        } catch (error) {
            console.error("Failed to fetch members", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.patch(`http://127.0.0.1:8000/api/group/${spid}/logistics/update/`, {
                accommodation,
                transport_details: {
                    mode: transportMode,
                    time: departureTime
                }
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
            });
            setShowEdit(false);
            fetchMembers(); 
        } catch (error) {
            console.error("Failed to update logistics", error);
        } finally {
            setSubmitting(false);
        }
    };

    const getTransportIcon = (mode) => {
        switch (mode?.toLowerCase()) {
            case 'train': return <Train size={16} />;
            case 'bus': return <Bus size={16} />;
            case 'car': return <Car size={16} />;
            default: return <Plane size={16} />;
        }
    };

    return (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            {/* Cinematic Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex justify-between items-center mb-8 relative z-10">
                <div>
                    <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 flex items-center gap-3">
                        <Shield className="text-indigo-400 fill-indigo-400/20" size={32} />
                        Squad Dossier
                    </h3>
                    <p className="text-slate-400 mt-1 font-medium tracking-wide">
                        Real-time Logistics & Agent Profiles
                    </p>
                </div>
                <button 
                    onClick={() => setShowEdit(!showEdit)}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-purple-200 px-5 py-2.5 rounded-xl transition-all border border-white/10 hover:border-purple-400/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] group"
                >
                    <Edit2 size={18} className="group-hover:rotate-12 transition-transform" />
                    {showEdit ? 'Cancel Update' : 'Update My Status'}
                </button>
            </div>

            <AnimatePresence>
                {showEdit && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-8"
                    >
                         <form onSubmit={handleUpdate} className="bg-slate-800/80 p-6 rounded-2xl border border-purple-500/30 shadow-inner">
                            <h4 className="text-purple-300 font-bold mb-4 flex items-center gap-2">
                                <Sparkles size={16} /> Update Operations Data
                            </h4>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 font-bold">Accommodation Base</label>
                                    <div className="relative">
                                        <Hotel className="absolute left-3 top-3 text-slate-500" size={16} />
                                        <input 
                                            type="text" 
                                            value={accommodation}
                                            onChange={(e) => setAccommodation(e.target.value)}
                                            placeholder="e.g. Grand Hyatt, Goa"
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 font-bold">Vector Mode</label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-3 text-slate-500">{getTransportIcon(transportMode)}</div>
                                            <select 
                                                value={transportMode}
                                                onChange={(e) => setTransportMode(e.target.value)}
                                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-200 focus:outline-none focus:border-purple-500"
                                            >
                                                <option value="Flight">Flight</option>
                                                <option value="Train">Train</option>
                                                <option value="Bus">Bus</option>
                                                <option value="Car">Car</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 font-bold">ETD</label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-3 text-slate-500" size={16} />
                                            <input 
                                                type="text" 
                                                value={departureTime}
                                                onChange={(e) => setDepartureTime(e.target.value)}
                                                placeholder="10:00 AM"
                                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-200 focus:outline-none focus:border-purple-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-900/20 flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    {submitting ? 'Updating System...' : 'Confirm Update'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CINEMATIC GRID */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {members.map((member, index) => (
                    <motion.div 
                        key={member.username}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative bg-slate-800/40 hover:bg-slate-800/60 border border-white/5 hover:border-white/20 p-5 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/10 cursor-pointer"
                        onClick={() => setSelectedMember(selectedMember === member.username ? null : member.username)}
                    >
                        {/* Member Header */}
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-2 ${
                                member.user_type === 'ADMIN' 
                                ? 'bg-gradient-to-br from-amber-400 to-orange-600 border-amber-300 text-white' 
                                : 'bg-gradient-to-br from-slate-600 to-slate-800 border-slate-500 text-slate-200'
                            }`}>
                                {member.username[0].toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-white font-bold text-lg">{member.username}</h4>
                                    {member.user_type === 'ADMIN' && (
                                        <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/20">
                                            LEADER
                                        </span>
                                    )}
                                </div>
                                <p className="text-slate-400 text-xs flex items-center gap-1">
                                    <MapPin size={12} className="text-slate-500" />
                                    {member.city || 'Unknown Location'}, {member.state_residence || 'State'}
                                </p>
                            </div>
                        </div>

                        {/* Quick Logistics */}
                        <div className="mt-4 space-y-2 bg-slate-900/50 p-3 rounded-xl border border-white/5">
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <Hotel size={14} className="text-indigo-400 shrink-0" />
                                <span className="truncate flex-1">{member.accommodation || <span className="text-slate-600 italic">No base established</span>}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                {getTransportIcon(member.transport_details?.mode)}
                                <span className="truncate flex-1">
                                    {member.transport_details?.mode ? (
                                        <>
                                            <span className="font-semibold text-slate-200">{member.transport_details.mode}</span> 
                                            <span className="text-slate-600 mx-2">|</span> 
                                            <span className="text-emerald-400 font-mono">{member.transport_details.time || 'TBD'}</span>
                                        </>
                                    ) : (
                                        <span className="text-slate-600 italic">No vector confirmed</span>
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Expanded Persona Details */}
                        <AnimatePresence>
                            {selectedMember === member.username && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden mt-4 pt-4 border-t border-white/10"
                                >
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-slate-800/80 p-2 rounded-lg text-center border border-white/5">
                                            <div className="text-slate-500 mb-1 flex justify-center"><Zap size={14} /></div>
                                            <div className="text-yellow-400 font-bold">{member.energy_level} Energy</div>
                                        </div>
                                        <div className="bg-slate-800/80 p-2 rounded-lg text-center border border-white/5">
                                            <div className="text-slate-500 mb-1 flex justify-center"><Activity size={14} /></div>
                                            <div className="text-cyan-400 font-bold">{member.activity_pace} Pace</div>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <div className="text-[10px] uppercase text-slate-500 font-bold mb-1 ml-1 flex items-center gap-1">
                                            <Heart size={10} /> Interests
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {member.destinations && member.destinations.length > 0 ? (
                                                member.destinations.slice(0, 3).map((choice, i) => (
                                                    <span key={i} className="bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded text-[10px] border border-purple-500/20">
                                                        {typeof choice === 'string' ? choice : (choice.type || choice.value || 'New Stop')}
                                                    </span>
                                                ))
                                            ) : <span className="text-slate-600 text-[10px] italic">No interests listed</span>}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        {/* Tap Hint */}
                        <div className="absolute top-4 right-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-[10px] font-mono">
                                {selectedMember === member.username ? 'CLOSE' : 'VIEW INTEL'}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            {loading && (
                 <div className="flex justify-center items-center py-20">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                 </div>
            )}
        </div>
    );
};

export default LogisticsModule;
