
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, AlertTriangle, PartyPopper, ChevronRight, Activity, Zap, Star } from 'lucide-react';
import axios from 'axios';
import MemberManagementModal from '../components/planning/MemberManagementModal';

const Decision = ({ decisionSpid, setDecisionSpid, handleGetDecision, decisionResult, loading: parentLoading, onViewPlan, authenticatedRequest, onComingSoon }) => {
  // ... (State logic same) ...
  const [localSpid, setLocalSpid] = useState('');
  const [localResult, setLocalResult] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [showMembers, setShowMembers] = useState(false);

  // Derived State (Prioritize Parent)
  const spid = decisionSpid !== undefined ? decisionSpid : localSpid;
  const setSpid = setDecisionSpid || setLocalSpid;
  const result = decisionResult || localResult;
  const loading = parentLoading || localLoading;
  const error = localError || (decisionResult?.error);

  const handleReveal = async (e) => {
    e.preventDefault();
    if (handleGetDecision) {
        handleGetDecision(e);
        return;
    }

    // Local Fallback Logic (if used standalone)
    setLocalLoading(true);
    setLocalError('');
    setLocalResult(null);

    try {
      let response;
      if (authenticatedRequest) {
          response = await authenticatedRequest(`http://127.0.0.1:8000/api/group/${spid}/recommendation/`);
      } else {
           // Fallback to fetch if prop missing (should not happen in main app)
           const token = localStorage.getItem('access');
           response = await fetch(`http://127.0.0.1:8000/api/group/${spid}/recommendation/`, {
                headers: { 'Authorization': `Bearer ${token}` }
           });
      }

      if (response && response.ok) {
           const data = await response.json();
           setLocalResult(data);
      } else {
           // Handle non-200 responses
           if (response && response.status === 404) {
               setLocalError(`Group '${spid}' not found.`);
           } else {
               setLocalError('Analysis failed or permission denied.');
           }
      }

    } catch (err) {
       setLocalError('Network error or server crash.');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 bg-[#050505] text-[#e0e0e0] flex flex-col items-center relative overflow-hidden">
       {/* Ambient BG */}
       <div className="absolute inset-0 bg-black" />
       <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-[#c0a080]/10 to-transparent pointer-events-none" />

      <div className="max-w-3xl w-full z-10 relative">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4 tracking-wider uppercase">Decision Intelligence</h1>
            <p className="text-gray-500 font-mono text-sm tracking-widest uppercase">
                Resolve Conflicts &bull; Find the Perfect Trip
            </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleReveal} className="flex flex-col md:flex-row gap-4 mb-16 relative z-20">
            <input 
                type="text" 
                placeholder="ENTER GROUP ID" 
                value={spid}
                onChange={(e) => setSpid(e.target.value)}
                className="flex-1 bg-[#0a0a0a] border border-white/10 px-6 py-4 text-white font-mono text-lg focus:border-[#c0a080] outline-none tracking-widest uppercase placeholder:text-gray-700 transition-all"
            />
            <div className="flex gap-2">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 md:flex-none px-8 py-4 bg-[#c0a080] text-black font-mono uppercase tracking-widest font-bold hover:bg-white transition-colors disabled:opacity-50"
                >
                    {loading ? 'Analyzing...' : 'Initialize'}
                </button>
                {spid && (
                     <button 
                        type="button"
                        onClick={() => setShowMembers(true)}
                        className="px-6 py-4 border border-white/20 text-white hover:bg-white/5 font-mono uppercase tracking-wider transition-all"
                        title="Manage Squad"
                    >
                        Squad
                    </button>
                )}
            </div>
        </form>

        <MemberManagementModal 
            spid={spid} 
            isOpen={showMembers} 
            onClose={() => setShowMembers(false)}
            onDataChange={() => {
                if (result) handleReveal({ preventDefault: () => {} }); // Re-run analysis if already showing results
            }}
            authenticatedRequest={authenticatedRequest}
        />

        {/* Error Message */}
        <AnimatePresence>
            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0 }}
                    className="p-4 border border-red-900/50 bg-red-900/10 text-red-400 font-mono text-xs uppercase tracking-widest text-center mb-8"
                >
                    <AlertTriangle size={16} className="inline mr-2" /> {error}
                </motion.div>
            )}
        </AnimatePresence>

        {/* Results Display */}
        <AnimatePresence>
            {result && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                >
                    {/* The Winner Card */}
                    <div className="glass-panel border border-[#c0a080]/30 p-10 relative overflow-hidden bg-[#0a0a0a]">
                         <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Star size={100} className="text-[#c0a080]" />
                         </div>
                         
                         <div className="relative z-10 text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#c0a080] rounded-full text-[#c0a080] text-[10px] font-mono uppercase tracking-widest mb-6">
                                <Zap size={12} /> Optimal Destination Found
                            </div>
                            <h2 className="text-5xl md:text-6xl font-serif text-white mb-4 tracking-tight">
                                {result.winner_city}
                            </h2>
                            <p className="text-gray-400 font-mono text-sm max-w-lg mx-auto leading-relaxed">
                                {result.explanation || "This destination aligns perfectly with the collective preferences, budget, and schedule of the group."}
                            </p>
                            
                            <div className="mt-8 flex justify-center gap-8">
                                <div className="text-center">
                                    <div className="text-3xl font-mono text-[#c0a080]">{Math.round(result.confidence * 100)}%</div>
                                    <div className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">Probability</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-mono text-white">{result.predictions?.length || 4}</div>
                                    <div className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">Votes Analyzed</div>
                                </div>
                            </div>
                         </div>
                    </div>

                    {/* Breakdown Grid */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Member Sentiment */}
                         <div className="bg-[#0a0a0a]/50 border border-white/5 p-6">
                            <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Activity size={14} /> Group Preferences
                            </h3>
                            <div className="space-y-3">
                                {result.predictions && result.predictions.map((p, i) => (
                                    <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
                                        <span className="text-sm text-gray-300 font-mono uppercase">{p.user}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-gray-500">{p.predicted_city}</span>
                                            <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#c0a080]" style={{ width: `${p.happiness_score}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                         </div>

                         {/* Conflict Protocol */}
                         <div className="bg-[#c0a080]/5 border border-[#c0a080]/20 p-6 relative overflow-hidden">
                            <h3 className="text-xs font-mono text-[#c0a080] uppercase tracking-widest mb-4 flex items-center gap-2">
                                <AlertTriangle size={14} /> Conflict Resolution
                            </h3>
                            <p className="text-sm text-gray-400 font-mono mb-4 leading-relaxed">
                                Minor divergence detected in preferences. Recommend executing standard calibration maneuvers.
                            </p>
                            <button 
                                onClick={() => onComingSoon && onComingSoon('Group Voting System')}
                                className="w-full py-3 border border-[#c0a080] text-[#c0a080] hover:bg-[#c0a080] hover:text-black font-mono text-xs uppercase tracking-widest transition-all"
                            >
                                Start Vote
                            </button>
                         </div>
                    </div>

                    <div className="flex justify-center mt-8">
                        <button 
                            onClick={() => onViewPlan && onViewPlan(result.winner_city)}
                            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-mono text-xs uppercase tracking-[0.2em]"
                        >
                            View Full Analysis & Generate Itinerary <ChevronRight size={14} />
                        </button>
                    </div>

                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Decision;
