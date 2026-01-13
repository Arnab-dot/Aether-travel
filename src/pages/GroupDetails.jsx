import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, AlertTriangle, ShieldCheck } from 'lucide-react';
import LogisticsModule from '../components/planning/LogisticsModule';
import axios from 'axios';

import { API_URL } from '../config';

const GroupDetails = ({ spid, onLeave }) => {
    const [leaving, setLeaving] = useState(false);

    const handleLeaveGroup = async () => {
        if (!window.confirm("CONFIRM ABORT: Are you sure you want to leave this group? This action will decouple your profile from the current mission.")) {
            return;
        }

        setLeaving(true);
        try {
            await axios.post(`${API_URL}/api/group/leave/`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
            });
            // Cleanup local state
            localStorage.removeItem('lastSpid');
            localStorage.removeItem('spid');
            
            // Trigger parent navigation change
            if (onLeave) onLeave();
        } catch (error) {
            console.error("Failed to leave group", error);
            alert("Mission Abort Failed: " + (error.response?.data?.message || "Communication Error"));
        } finally {
            setLeaving(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 bg-[#050505] relative overflow-hidden">
             {/* Deep Space BG */}
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#050505] to-[#050505]" />
             
             <div className="max-w-6xl mx-auto relative z-10 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
                    <div>
                        <div className="flex items-center gap-2 text-[#c0a080] font-mono text-xs uppercase tracking-[0.2em] mb-2">
                             <ShieldCheck size={14} /> Mission Control
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight">
                            Mission: <span className="text-[#c0a080]">{spid}</span>
                        </h1>
                    </div>
                </div>

                {/* Squad Dossier (Logistics Module) */}
                <LogisticsModule spid={spid} />

                {/* Danger Zone */}
                <div className="mt-16 pt-8 border-t border-red-900/30">
                    <h3 className="text-red-500 font-mono text-xs uppercase tracking-widest mb-6 flex items-center gap-2 justify-center opacity-60">
                        <AlertTriangle size={14} /> Danger Zone
                    </h3>
                    
                    <div className="flex justify-center">
                        <button 
                            onClick={handleLeaveGroup}
                            disabled={leaving}
                            className="flex items-center gap-3 px-8 py-4 border border-red-900/50 hover:bg-red-900/20 text-red-400 font-mono text-xs uppercase tracking-widest transition-all group rounded-sm"
                        >
                            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                            {leaving ? 'Aborting Mission...' : 'Abort Mission (Leave Group)'}
                        </button>
                    </div>
                </div>
             </div>
        </div>
    );
};

export default GroupDetails;
