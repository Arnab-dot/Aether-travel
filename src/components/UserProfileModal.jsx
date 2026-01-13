import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Save, User, MapPin, Wallet, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserProfileModal = ({ isOpen, onClose }) => {
    const [userData, setUserData] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchMyDetails();
        }
    }, [isOpen]);

    const fetchMyDetails = async () => {
        setLoading(true);
        // We need an endpoint to get "ME". 
        // option 1: Store User ID in localStorage on login (easiest if not already there)
        // option 2: A specialized 'me' endpoint.
        // Let's assume we can get ID from localStorage for now, or use the members list of the current group if we knew it.
        // Actually, the previous implementation allows editing by MEMBER_ID.
        // We need to know THE USER's MEMBER ID. 
        
        // HACK/SOLUTION: Since Login returns `username` and `user_type`, but not explicitly ID in my previous check of App.jsx (it might have changed).
        // Let's check App.jsx handleLogin again... 
        // It saves access, refresh, user_type, username. NO ID.
        // However, the `IndividualFriendDetailView` needs `member_id`.
        // I should probably update `LoginView` to return `user_id` so the frontend knows who "I" am.
        
        // BUT, for now, let's assume I'll fix LoginView first.
        try {
            const userId = localStorage.getItem('user_id'); 
            if (!userId) {
                setMessage("Error: User ID not found. Please relogin.");
                setLoading(false);
                return;
            }

            const response = await axios.get(`http://127.0.0.1:8000/api/member/${userId}/`);
            setUserData(response.data);
            setEditForm({
                username: response.data.username,
                city: response.data.city,
                state: response.data.state, // Ensure state is mapped
                state_residence: response.data.state_residence || response.data.state,
                budget: response.data.budget,
                destinations: response.data.destinations || [],
                energy_level: response.data.energy_level || 'Medium',
                activity_pace: response.data.activity_pace || 'Moderate'
            });
        } catch (error) {
            console.error("Error fetching profile:", error);
            setMessage("Failed to load profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        const userId = localStorage.getItem('user_id');
        try {
            await axios.patch(`http://127.0.0.1:8000/api/member/${userId}/`, {
                username: editForm.username,
                city: editForm.city,
                state: editForm.state, // or state_residence
                state_residence: editForm.state_residence || editForm.state,
                budget: editForm.budget,
                // Filter out empty destinations
                destinations: editForm.destinations.filter(d => d.type && d.type.trim() !== ''),
                energy_level: editForm.energy_level,
                activity_pace: editForm.activity_pace
            });
            setMessage("Profile updated successfully!");
            fetchMyDetails(); // Refresh
            setTimeout(() => {
                setMessage('');
                onClose();
            }, 1000);
        } catch (error) {
            console.error("Error saving profile:", error);
            setMessage("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };



    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#0f0f0f] border border-[#c0a080]/30 w-full max-w-2xl rounded-sm shadow-2xl flex flex-col relative"
            >
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                    <X size={24} />
                </button>

                <div className="p-8">
                    <h2 className="text-3xl font-serif text-[#c0a080] mb-2">Agent Profile</h2>
                    <p className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-8">
                        Authorized Personnel Only
                    </p>

                    {loading ? (
                        <div className="text-center py-10 font-mono text-[#c0a080]">Initializing biometric scan...</div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[#c0a080] font-mono text-[10px] uppercase tracking-widest mb-2">Codename</label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-3 top-3 text-gray-500" />
                                        <input 
                                            value={editForm.username}
                                            onChange={e => setEditForm({...editForm, username: e.target.value})}
                                            className="w-full bg-[#1a1a1a] border border-white/10 p-3 pl-10 text-white font-mono text-sm focus:border-[#c0a080] outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[#c0a080] font-mono text-[10px] uppercase tracking-widest mb-2">Base Location</label>
                                    <div className="relative">
                                        <MapPin size={16} className="absolute left-3 top-3 text-gray-500" />
                                        <input 
                                            value={editForm.city}
                                            onChange={e => setEditForm({...editForm, city: e.target.value})}
                                            className="w-full bg-[#1a1a1a] border border-white/10 p-3 pl-10 text-white font-mono text-sm focus:border-[#c0a080] outline-none"
                                            placeholder="City"
                                        />
                                    </div>
                                        </div>
                                </div>


                            {/* State Residence */}
                            <div>
                                <label className="block text-[#c0a080] font-mono text-[10px] uppercase tracking-widest mb-2">Base State/Region</label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-3 top-3 text-gray-500" />
                                    <input 
                                        value={editForm.state || editForm.state_residence}
                                        onChange={e => setEditForm({...editForm, state: e.target.value, state_residence: e.target.value})}
                                        className="w-full bg-[#1a1a1a] border border-white/10 p-3 pl-10 text-white font-mono text-sm focus:border-[#c0a080] outline-none"
                                        placeholder="State"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[#c0a080] font-mono text-[10px] uppercase tracking-widest mb-2">Energy Level</label>
                                    <div className="relative">
                                    <select 
                                        value={editForm.energy_level}
                                        onChange={e => setEditForm({...editForm, energy_level: e.target.value})}
                                        className="w-full bg-[#1a1a1a] border border-white/10 p-3 text-white font-mono text-sm focus:border-[#c0a080] outline-none appearance-none px-4"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[#c0a080] font-mono text-[10px] uppercase tracking-widest mb-2">Activity Pace</label>
                                    <div className="relative">
                                    <select 
                                        value={editForm.activity_pace}
                                        onChange={e => setEditForm({...editForm, activity_pace: e.target.value})}
                                        className="w-full bg-[#1a1a1a] border border-white/10 p-3 text-white font-mono text-sm focus:border-[#c0a080] outline-none appearance-none px-4"
                                    >
                                        <option value="Relaxed">Relaxed</option>
                                        <option value="Moderate">Moderate</option>
                                        <option value="Packed">Packed</option>
                                    </select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[#c0a080] font-mono text-[10px] uppercase tracking-widest mb-2">Budget Allocation</label>
                                <div className="relative">
                                    <Wallet size={16} className="absolute left-3 top-3 text-gray-500" />
                                    <select 
                                        value={editForm.budget}
                                        onChange={e => setEditForm({...editForm, budget: e.target.value})}
                                        className="w-full bg-[#1a1a1a] border border-white/10 p-3 pl-10 text-white font-mono text-sm focus:border-[#c0a080] outline-none appearance-none"
                                    >
                                        <option value="Low">Tier 1 (Low)</option>
                                        <option value="Medium">Tier 2 (Medium)</option>
                                        <option value="High">Tier 3 (High)</option>
                                        <option value="Flexible">Unrestricted</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[#c0a080] font-mono text-[10px] uppercase tracking-widest mb-4">
                                    <Sparkles size={12} className="inline mr-2" />
                                    Mission Trajectory (Stops)
                                </label>
                                
                                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#c0a080]/20 scrollbar-track-transparent">
                                    {editForm.destinations && editForm.destinations.map((dest, idx) => (
                                        <div 
                                            key={idx}
                                            className="bg-[#0a0a0a] p-4 border border-white/10 relative group hover:border-[#c0a080]/50 transition-colors rounded-sm"
                                        >
                                            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                                                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#c0a080]">Stop {String(idx + 1).padStart(2,'0')}</span>
                                                <button 
                                                    onClick={() => {
                                                        const newDests = editForm.destinations.filter((_, i) => i !== idx);
                                                        setEditForm({...editForm, destinations: newDests});
                                                    }}
                                                    className="text-red-900 hover:text-red-500 text-[10px] font-mono uppercase opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    Dismiss
                                                </button>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-[8px] uppercase font-mono text-gray-600 mb-1 block">Place Name</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="PLACE NAME"
                                                        className="w-full text-sm font-serif bg-transparent text-white border-none p-0 focus:ring-0 placeholder:text-gray-800 placeholder:font-sans uppercase tracking-wide"
                                                        value={dest.type || ''}
                                                        onChange={(e) => {
                                                            const newDests = [...editForm.destinations];
                                                            newDests[idx].type = e.target.value;
                                                            setEditForm({...editForm, destinations: newDests});
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[8px] uppercase font-mono text-gray-600 mb-1 block">Intel / Notes</label>
                                                    <textarea 
                                                        placeholder="Notes: What do you want to do here?"
                                                        className="w-full bg-transparent text-gray-400 text-xs border-none p-0 focus:ring-0 placeholder:text-gray-800 font-mono min-h-[40px] resize-none leading-relaxed"
                                                        value={dest.description || ''}
                                                        onChange={(e) => {
                                                            const newDests = [...editForm.destinations];
                                                            newDests[idx].description = e.target.value;
                                                            setEditForm({...editForm, destinations: newDests});
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button 
                                    onClick={() => setEditForm({...editForm, destinations: [...(editForm.destinations || []), { type: '', description: '' }]})}
                                    className="w-full py-3 mt-4 border border-dashed border-white/20 text-gray-500 font-mono text-[10px] uppercase hover:border-[#c0a080] hover:text-[#c0a080] transition-all flex items-center justify-center gap-2"
                                >
                                    + Add Stop
                                </button>
                            </div>

                            {message && (
                                <div className={`p-3 text-center font-mono text-xs uppercase tracking-widest ${message.includes('Error') || message.includes('Failed') ? 'text-red-400 bg-red-900/10' : 'text-emerald-400 bg-emerald-900/10'}`}>
                                    {message}
                                </div>
                            )}

                            <div className="pt-4 flex justify-end">
                                <button 
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-8 py-3 bg-[#c0a080] hover:bg-white text-black font-mono uppercase tracking-widest font-bold transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Save size={16} />
                                    {saving ? 'Encrypting...' : 'Save Updates'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default UserProfileModal;
