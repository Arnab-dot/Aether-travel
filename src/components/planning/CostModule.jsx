import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, UserCheck, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { Loader2, Sparkles, TrendingDown } from 'lucide-react';
import GroupChat from '../GroupChat';


const CostModule = ({ costData, setCostData, calculatedShares, handleCalculate, spid }) => {
  const [optimizing, setOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState(null);
  
  // Budget / Voting State
  const [budgetProposal, setBudgetProposal] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [voteStats, setVoteStats] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
     if (spid) fetchBudgetStatus();
  }, [spid]);

  const fetchBudgetStatus = async () => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/group/${spid}/budget/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
        });
        if (response.data.proposal) {
            setBudgetProposal(response.data.proposal);
            setVoteStats(response.data.stats);
            setUserVote(response.data.user_vote);
            setIsAdmin(response.data.is_admin);
            
            // If proposal exists, auto-fill the total cost for visibility
            if (response.data.proposal.amount) {
                setCostData(prev => ({ ...prev, total_cost: response.data.proposal.amount }));
            }
        } else {
             setIsAdmin(response.data.is_admin);
        }
    } catch (error) {
        console.error("Failed to fetch budget status", error);
    }
  };

  const handleVote = async (vote) => {
    try {
        await axios.post(`http://127.0.0.1:8000/api/group/${spid}/budget/`, { vote }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
        });
        fetchBudgetStatus();
    } catch (error) {
        alert("Failed to cast vote");
    }
  };

  const handlePropose = async () => {
     if (!costData.total_cost) return alert("Please enter a cost");
     try {
        await axios.post(`http://127.0.0.1:8000/api/group/${spid}/budget/`, { 
            estimated_trip_cost: costData.total_cost,
            description: "Admin Proposal"
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
        });
        alert("Budget Proposed! Members can now vote.");
        fetchBudgetStatus();
    } catch (error) {
        alert("Failed to propose budget");
    }
  };


  const handleOptimize = async () => {
    setOptimizing(true);
    try {
        const payload = {
            destination: "Group Preference", // Ideally driven by state
            travel_dates: { start: "2024-06-01", end: "2024-06-03" }, // Mock for now
            group_size: calculatedShares ? calculatedShares.shares.length : 4,
            estimated_trip_cost: costData.total_cost,
            flexibility_flags: { date_flexible: true, travel_mode_flexible: true }
        };

        const response = await axios.post(`http://127.0.0.1:8000/api/group/${spid}/optimize-cost/`, payload, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
        });
        setOptimizationResult(response.data);
    } catch (error) {
        console.error("Optimization failed", error);
        alert("AI Optimizer is offline (Is Colab running?)");
    } finally {
        setOptimizing(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCostData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl backdrop-blur-md border border-slate-700/50 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
         <span>🧾</span> Cost Split Estimator
      </h2>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 space-y-2">
            <label className="text-sm text-slate-400 font-medium">Total Trip Estimation (₹)</label>
            <input
              type="number"
              name="total_cost"
              value={costData.total_cost}
              onChange={handleChange}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
              placeholder="e.g. 50000"
            />
        </div>
        {isAdmin && (
            <button 
            onClick={budgetProposal ? handlePropose : handleCalculate}
            className="self-end px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition-colors shadow-lg shadow-purple-900/20"
            >
            {budgetProposal ? "Update Proposal" : "Calculate / Propose"}
            </button>
        )}

      </div>
      
      {/* Proposal & Voting UI */}
      {budgetProposal && (
        <div className="mb-6 bg-slate-900/40 p-4 rounded-xl border border-white/10">
            <div className="flex justify-between items-start mb-3">
                <div>
                     <h3 className="text-white font-bold flex items-center gap-2">
                        {budgetProposal.status === 'APPROVED' ? <UserCheck className="text-emerald-400"/> : <AlertCircle className="text-amber-400"/>}
                        Status: <span className={budgetProposal.status === 'APPROVED' ? "text-emerald-400" : "text-amber-400"}>{budgetProposal.status}</span>
                     </h3>
                     <p className="text-xs text-slate-400 mt-1">Approval Threshold: 75% ({voteStats?.yes_votes}/{voteStats?.total_members} Votes)</p>
                </div>
                {isAdmin && <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded">Admin Controls</span>}
            </div>

            {!isAdmin && (
                <div className="flex gap-3 mt-4">
                    <button 
                        onClick={() => handleVote('YES')}
                        className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-2 ${userVote === 'YES' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                    >
                        <ThumbsUp size={16}/> YES
                    </button>
                    <button 
                        onClick={() => handleVote('NO')}
                        className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-2 ${userVote === 'NO' ? 'bg-rose-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                    >
                        <ThumbsDown size={16}/> NO
                    </button>
                </div>
            )}
        </div>
      )}


      {/* Results */}
      {calculatedShares && calculatedShares.shares && (
         <div className="bg-slate-900/50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">Estimated Breakdown</h3>
            {calculatedShares.shares.map((share, idx) => (
               <div key={idx} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-colors border-b border-white/5 last:border-0 relative group">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-bold ring-2 ring-white/10">
                        {share.username[0].toUpperCase()}
                     </div>
                     <span className="font-medium text-slate-200">{share.username}</span>
                  </div>
                  
                  <div className="text-right">
                     <span className="block text-emerald-400 font-bold">₹{share.final_share.toLocaleString()}</span>
                     {share.adjustment !== 0 && (
                        <span className="text-[10px] text-slate-500 block">
                           {share.adjustment > 0 ? '+' : ''}{share.adjustment} adjustment
                        </span>
                     )}
                  </div>
                  
                  {/* Tooltip for "Why" */}
                  <div className="absolute top-full right-0 mt-2 w-48 bg-black/90 text-xs text-slate-300 p-2 rounded shadow-xl hidden group-hover:block z-10 border border-white/10">
                    Base: ₹{share.base_share}<br/>
                    Adjustment: {share.adjustment || 0}
                  </div>
               </div>
            ))}
            
            <div className="text-center pt-2">
               <p className="text-xs text-slate-600">
                  *Splits are estimates. Adjustments can be added for drivers, organizers, etc.
               </p>
            </div>
         </div>
      )}
      
      {/* AI OPTIMIZER SECTION */}
      {calculatedShares && (
        <div className="mt-6 border-t border-slate-700/50 pt-6">
            <button 
                onClick={handleOptimize}
                disabled={optimizing}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl font-bold text-white shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {optimizing ? <Loader2 className="animate-spin" /> : <Sparkles />}
                {optimizing ? "AI Engine Running..." : "Run Smart Cost Optimizer 💡"}
            </button>
            
            {optimizationResult && (
                <div className="mt-6 bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                        <TrendingDown /> Optimization Proposal
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-slate-900/50 p-3 rounded-lg text-center">
                            <div className="text-xs text-slate-400 uppercase">Original</div>
                            <div className="font-bold text-slate-200">₹{optimizationResult.original_cost_per_person}</div>
                        </div>
                         <div className="bg-slate-900/50 p-3 rounded-lg text-center border border-emerald-500/30">
                            <div className="text-xs text-emerald-400 uppercase">Optimized</div>
                            <div className="font-bold text-emerald-300">₹{optimizationResult.optimized_cost_per_person}</div>
                        </div>
                         <div className="bg-slate-900/50 p-3 rounded-lg text-center">
                            <div className="text-xs text-slate-400 uppercase">Savings</div>
                            <div className="font-bold text-emerald-400">₹{optimizationResult.total_savings_per_person}</div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-300 uppercase">Suggested Changes:</h4>
                        {optimizationResult.changes_applied?.map((change, i) => (
                            <div key={i} className="flex gap-3 text-sm p-3 bg-white/5 rounded-lg border border-white/5">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold h-fit ${change.change_type === 'date' ? 'bg-blue-500/20 text-blue-300' : 'bg-orange-500/20 text-orange-300'}`}>
                                    {change.change_type}
                                </span>
                                <div>
                                    <div className="text-slate-200 font-medium">{change.description}</div>
                                    <div className="text-emerald-400 text-xs font-bold mt-1 max-w-[50px]">{change.impact}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      )}
      
      {/* Group Chat Integration */}
      <GroupChat 
        spid={spid} 
        token={localStorage.getItem('access')} 
        username={localStorage.getItem('username') || "Me"} 
      />
    </div>
  );
};

export default CostModule;
