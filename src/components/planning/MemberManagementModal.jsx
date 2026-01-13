import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Save, Trash2, User, MapPin, Wallet, Plus, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MemberManagementModal = ({ spid, isOpen, onClose, onDataChange, authenticatedRequest }) => {
    const [members, setMembers] = useState([]);
    const [editingMember, setEditingMember] = useState(null); // ID of member being edited
    const [editForm, setEditForm] = useState({});
    const [loading, setLoading] = useState(false);
    const [newMemberMode, setNewMemberMode] = useState(false);

    useEffect(() => {
        if (isOpen && spid) {
            fetchMembers();
        }
    }, [isOpen, spid]);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            // Use authenticatedRequest if available, else fallback provided it's safe (but here we prefer auth)
            const fetcher = authenticatedRequest 
                ? (url) => authenticatedRequest(url)
                : (url) => axios.get(url, { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } });

            const response = await fetcher(`http://127.0.0.1:8000/api/group/${spid}/members/`);
            
            // Check if response is from our helper (has .ok) or axios (has .data)
            let data;
            if (response.ok !== undefined) { 
                 // It's a fetch response
                 if (response.ok) data = await response.json(); 
                 else throw new Error("Fetch failed");
            } else {
                 // It's an axios response
                 data = response.data;
            }

            setMembers(data.members || []);
        } catch (error) {
            console.error("Error fetching members:", error);
         } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (member) => {
        setEditingMember(member.id);
        setNewMemberMode(false);
        setEditForm({
            username: member.username,
            city: member.city,
            state: member.state_residence,
            budget: member.budget_preference,
            destinations: member.destinations || [] // Ensure array
        });
    };

    const handleSave = async (memberId) => {
        try {
            // For write operations, simple axios is okay for now if simpler, 
            // BUT strict auth usually requires refreshed tokens.
            // Let's stick to axios here for speed if authRequest is GET-only capable? 
            // Actually default makeAuthenticatedRequest uses fetch options.
            
            const url = `http://127.0.0.1:8000/api/member/${memberId}/`;
            const body = {
                username: editForm.username,
                city: editForm.city,
                state: editForm.state,
                budget_preference: editForm.budget,
                budget: editForm.budget,
                destinations: editForm.destinations
            };

            let success = false;
            
            if (authenticatedRequest) {
                 const res = await authenticatedRequest(url, {
                     method: 'PATCH',
                     body: JSON.stringify(body)
                 });
                 if (res && res.ok) success = true;
            } else {
                 await axios.patch(url, body, { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } });
                 success = true;
            }

            if (success) {
                setEditingMember(null);
                fetchMembers();
                if (onDataChange) onDataChange(); 
            }
        } catch (error) {
            console.error("Error updating member:", error);
            alert("Failed to update member");
        }
    };

    const handleDelete = async (memberId) => {
        if (!window.confirm("Are you sure you want to remove this member? This cannot be undone.")) return;
         try {
            const url = `http://127.0.0.1:8000/api/member/${memberId}/`;
             
            if (authenticatedRequest) {
                 await authenticatedRequest(url, { method: 'DELETE' });
            } else {
                 await axios.delete(url, { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } });
            }
            
            fetchMembers();
            if (onDataChange) onDataChange();
        } catch (error) {
            console.error("Error deleting member:", error);
        }
    };

    // Helper to edit destinations array (comma separated for now for simplicity, or localized tag input)
    const handleDestinationsChange = (e) => {
        // Simple text logic: "Goa, Beach" -> [{type: "Goa"}, {type: "Beach"}] mapping or just raw list if backend supports it
        // The backend expects specific structure usually. 
        // Based on previous code: destinations is a list of objects {type: "desc"} usually? 
        // Let's look at `IndividualFriend` model. It is JSONField. 
        // The NLP logic expects `type` key in objects inside the list.
        
        // For simple UI, let's treat it as comma-sep string for the tags, then convert to objects
        const val = e.target.value;
        const tags = val.split(',').map(t => ({ type: t.trim(), description: "User added" })).filter(t => t.type);
        setEditForm(prev => ({ ...prev, destinations: tags }));
    };

    const getDestinationsString = (dests) => {
        if (!Array.isArray(dests)) return "";
        return dests.map(d => d.type || d.value || d).join(', ');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-slate-900 border border-purple-500/30 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-800/50 rounded-t-3xl">
                    <div>
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                            Manage Squad Data
                        </h2>
                        <p className="text-slate-400 text-sm">Edit traveler profiles & preferences</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="text-slate-400 hover:text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-10 text-slate-500">Loading squad data...</div>
                        ) : (
                            <div className="grid gap-4">
                                {members.map(member => (
                                    <div key={member.id} className="bg-slate-800/40 border border-white/5 rounded-2xl p-4 transition-all hover:border-purple-500/30">
                                        {editingMember === member.id ? (
                                            // EDIT MODE
                                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12 items-start">
                                                <div className="lg:col-span-2">
                                                    <label className="text-[10px] uppercase font-bold text-slate-500">Name</label>
                                                    <input 
                                                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm"
                                                        value={editForm.username}
                                                        onChange={e => setEditForm({...editForm, username: e.target.value})}
                                                    />
                                                </div>
                                                <div className="lg:col-span-2">
                                                    <label className="text-[10px] uppercase font-bold text-slate-500">City</label>
                                                    <input 
                                                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm"
                                                        value={editForm.city}
                                                        onChange={e => setEditForm({...editForm, city: e.target.value})}
                                                    />
                                                </div>
                                                <div className="lg:col-span-2">
                                                    <label className="text-[10px] uppercase font-bold text-slate-500">Budget</label>
                                                     <select 
                                                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm"
                                                        value={editForm.budget}
                                                        onChange={e => setEditForm({...editForm, budget: e.target.value})}
                                                    >
                                                        <option value="Low">Low</option>
                                                        <option value="Medium">Medium</option>
                                                        <option value="High">High</option>
                                                        <option value="Flexible">Flexible</option>
                                                    </select>
                                                </div>
                                                <div className="lg:col-span-4">
                                                    <label className="text-[10px] uppercase font-bold text-slate-500">Preferences (Comma sep)</label>
                                                    <input 
                                                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm"
                                                        defaultValue={getDestinationsString(editForm.destinations)}
                                                        onChange={handleDestinationsChange}
                                                        placeholder="e.g. Beach, Goa, Party"
                                                    />
                                                </div>
                                                <div className="lg:col-span-2 flex gap-2 pt-5 justify-end">
                                                    <button 
                                                        onClick={() => handleSave(member.id)}
                                                        className="bg-emerald-500/20 text-emerald-400 p-2 rounded hover:bg-emerald-500/30"
                                                        title="Save"
                                                    >
                                                        <Save size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => setEditingMember(null)}
                                                        className="bg-slate-700 text-slate-300 p-2 rounded hover:bg-slate-600"
                                                        title="Cancel"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            // VIEW MODE
                                            <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
                                                <div className="flex items-center gap-4 min-w-[200px]">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
                                                        {(member.username && member.username[0]) ? member.username[0].toUpperCase() : '?'}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-white">{member.username}</h3>
                                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                                            <MapPin size={10} /> {member.city || 'N/A'}, {member.state_residence}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2 justify-center flex-1">
                                                    {member.destinations && member.destinations.map((d, i) => (
                                                        <span key={i} className="px-2 py-1 rounded bg-slate-700/50 border border-slate-600 text-xs text-slate-300">
                                                            {d.type || d.value || d}
                                                        </span>
                                                    ))}
                                                    {(!member.destinations || member.destinations.length === 0) && (
                                                        <span className="text-slate-600 italic text-xs">No preferences</span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-purple-300">
                                                        {member.budget_preference || 'Flexible'}
                                                    </div>
                                                    <div className="w-px h-8 bg-white/10 mx-2"></div>
                                                    <button 
                                                        onClick={() => handleEditClick(member)}
                                                        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(member.id)}
                                                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                
                                {members.length === 0 && (
                                    <div className="text-center p-8 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                                        <p className="text-slate-400">No members found. Invite some friends!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MemberManagementModal;
