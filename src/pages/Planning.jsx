import React, { useState, useEffect } from 'react';
import BudgetModule from '../components/planning/BudgetModule';
import TimeModule from '../components/planning/TimeModule';
import CostModule from '../components/planning/CostModule';
import LogisticsModule from '../components/planning/LogisticsModule';
import { Sparkles, Hexagon, BarChart3, Clock, AlertCircle } from 'lucide-react';

const Planning = ({ spid, goBack }) => {
  const [budget, setBudget] = useState({ min_budget: '', comfort_budget: '', max_budget: '' });
  const [groupStats, setGroupStats] = useState(null);
  
  const [availability, setAvailability] = useState({ start_date: '', end_date: '', status: 'FREE' });
  const [heatmapData, setHeatmapData] = useState(null);
  
  const [costData, setCostData] = useState({ total_cost: '' });
  const [calculatedShares, setCalculatedShares] = useState(null);
  
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');

  
  const API_BASE = 'http://localhost:8000/api';
  const token = localStorage.getItem('access');

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const fetchGroupStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/group/${spid}/budget/`, { headers });
      if (res.ok) {
        const data = await res.json();
        setGroupStats(data.stats);
        setIsAdmin(data.is_admin);
        
        // If proposal exists, load it into Budget Module
        if (data.proposal) {
            setBudget({
                min_budget: data.proposal.min_budget,
                comfort_budget: data.proposal.comfort_budget,
                max_budget: data.proposal.max_budget
            });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };


  const fetchHeatmap = async () => {
    try {
      const res = await fetch(`${API_BASE}/group/${spid}/availability/`, { headers });
      if (res.ok) {
        const data = await res.json();
        setHeatmapData(data);
      }
    } catch (e) {
        console.error(e);
    }
  };

  useEffect(() => {
    if (spid) {
        fetchGroupStats();
        fetchHeatmap();
    }
  }, [spid]);

  const saveBudget = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/group/${spid}/budget/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(budget)
      });
      if (res.ok) {
        setMessage('Budget Saved! Updating group stats...');
        await fetchGroupStats();
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (e) {
        setMessage('Error saving budget');
    }
    setLoading(false);
  };

  const saveAvailability = async () => {
    setLoading(true);
    try {
        const res = await fetch(`${API_BASE}/group/${spid}/availability/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(availability)
        });
        if (res.ok) {
            setMessage('Availability Saved! Updating heatmap...');
            await fetchHeatmap();
            setTimeout(() => setMessage(''), 2000);
        }
    } catch (e) {
        setMessage('Error saving availability');
    }
    setLoading(false);
  };

  const calculateCost = async () => {
    setLoading(true);
    try {
        const res = await fetch(`${API_BASE}/group/${spid}/cost-estimator/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(costData)
        });
        if (res.ok) {
            const data = await res.json();
            setCalculatedShares(data);
        }
    } catch (e) {
        setMessage('Error calculating cost');
    }
    setLoading(false);
  };

  if (!spid) return <div className="p-10 text-center text-[#e0e0e0] font-mono">No Mission Selected</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl bg-[#050505] text-[#e0e0e0] min-h-screen">
      <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-6">
        <div>
            <h1 className="text-3xl font-serif text-white flex items-center gap-3 tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#c0a080] animate-pulse"></span>
                Expedition Plan
            </h1>
            <p className="text-gray-500 mt-2 font-mono text-xs tracking-widest uppercase">
                Squad Code: <span className="text-[#c0a080] font-bold">{spid}</span>
            </p>
        </div>
        <button onClick={goBack} className="text-gray-500 hover:text-white transition-colors font-mono text-xs uppercase tracking-widest">
            ← Back To Dashboard
        </button>
      </div>

      {message && (
        <div className="fixed top-24 right-4 bg-[#c0a080]/10 border border-[#c0a080] text-[#c0a080] px-6 py-3 font-mono text-xs uppercase tracking-widest z-50 animate-bounce">
            {message}
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Col: Budget */}
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2 text-[#c0a080] font-mono text-xs uppercase tracking-widest">
                <BarChart3 size={14} /> Budget & Resources
            </div>
            <BudgetModule 
                budget={budget} 
                setBudget={setBudget} 
                groupStats={groupStats} 
                readOnly={!isAdmin}
            />

            <div className="flex justify-end">
                <button 
                  onClick={saveBudget}
                  disabled={loading}
                  className="px-6 py-3 bg-[#c0a080] text-black font-mono text-xs uppercase tracking-[0.2em] hover:bg-white transition-all disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Save Budget'}
                </button>
            </div>
            
            {/* Admin Controls */}
            {isAdmin && (
                <div className="mt-4 p-4 border border-white/10 bg-[#0a0a0a]/50">
                    <h3 className="text-[10px] font-bold text-gray-500 mb-2 font-mono uppercase tracking-widest">Planner Override</h3>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Add Planner" 
                            className="bg-transparent border border-white/10 px-3 py-2 text-xs font-mono text-white flex-1 outline-none focus:border-[#c0a080]"
                            value={newAdminName}
                            onChange={(e) => setNewAdminName(e.target.value)}
                        />
                        <button 
                            onClick={async () => {
                                if(!newAdminName) return;
                                try {
                                    const res = await fetch(`${API_BASE}/group/${spid}/budget/`, {
                                        method: 'POST',
                                        headers,
                                        body: JSON.stringify({ add_admin: newAdminName })
                                    });
                                    if(res.ok) {
                                        setMessage(`Promoted ${newAdminName}!`);
                                        setNewAdminName('');
                                        setTimeout(() => setMessage(''), 3000);
                                    } else {
                                        setMessage('User not found');
                                    }
                                } catch(e) { setMessage('Error promoting'); }
                            }}
                            className="bg-white/5 border border-white/10 hover:border-[#c0a080] hover:text-[#c0a080] text-gray-400 px-3 py-1 text-[10px] font-mono uppercase"
                        >
                            Authorize
                        </button>
                    </div>
                </div>
            )}

        </div>

        {/* Right Col: Time */}
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2 text-[#c0a080] font-mono text-xs uppercase tracking-widest">
                <Clock size={14} /> Time Availability
            </div>
            <TimeModule 
                availability={availability} 
                setAvailability={setAvailability} 
                heatmapData={heatmapData}
            />
             <div className="flex justify-end">
                <button 
                  onClick={saveAvailability}
                  disabled={loading}
                  className="px-6 py-3 border border-white/20 text-white font-mono text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all disabled:opacity-50"
                >
                    {loading ? 'Syncing...' : 'Update Schedule'}
                </button>
            </div>
        </div>

        {/* Full Width: Cost & Verdict */}
        <div className="lg:col-span-2 mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CostModule 
                costData={costData} 
                setCostData={setCostData} 
                calculatedShares={calculatedShares} 
                handleCalculate={calculateCost}
                spid={spid}
            />
            
            {/* Verdict / Summary Card */}
            <div className="glass-panel border border-white/10 p-8 flex flex-col justify-center bg-[#0a0a0a]">
                <h2 className="text-xl font-serif text-white mb-6 uppercase tracking-wide">Trip Viability</h2>
                <div className="space-y-6 text-sm text-gray-400 font-mono">
                    <p className="flex items-center gap-3">
                        <span className={groupStats ? "text-[#c0a080]" : "text-gray-700"}>
                             <Hexagon size={16} fill={groupStats ? "currentColor" : "none"} />
                        </span> 
                        {groupStats ? 'BUDGET: ALIGNED' : 'AWAITING BUDGET DATA'}
                    </p>
                    <p className="flex items-center gap-3">
                         <span className={heatmapData?.best_window ? "text-[#c0a080]" : "text-yellow-900"}>
                            <AlertCircle size={16} />
                         </span>
                         {heatmapData?.best_window 
                            ? `SCHEDULE: LOCKED (${heatmapData.window_start} - ${heatmapData.window_end})` 
                            : 'SCHEDULE DATA INSUFFICIENT'}
                    </p>
                    <div className="mt-4 p-4 border-l-2 border-[#c0a080] bg-[#c0a080]/5">
                        <p className="italic text-gray-500 text-xs">
                            "Adventure awaits! Your squad is ready to conquer <strong className="text-white">new horizons</strong>. When friends align, magic happens. This is going to be <strong className="text-[#c0a080]">LEGENDARY!</strong>"
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Full Width: Logistics */}
        <div className="lg:col-span-2 pt-8 border-t border-white/5">
            <LogisticsModule spid={spid} />
        </div>

      </div>
    </div>
  );
};

export default Planning;
