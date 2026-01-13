import React from 'react';
import { Wallet } from 'lucide-react';

const BudgetModule = ({ budget, setBudget, groupStats, readOnly = false }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBudget(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl backdrop-blur-md border border-slate-700/50 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Wallet size={24} className="text-emerald-400" /> Budget Preferences
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Min Budget */}
        <div className="space-y-2">
          <label className="text-sm text-slate-200 font-bold uppercase tracking-wider">Minimum (Tight)</label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold">₹</span>
            <input
              type="number"
              name="min_budget"
              value={budget.min_budget}
              onChange={handleChange}
              disabled={readOnly}
              className={`w-full bg-slate-800 border-2 border-slate-600 rounded-xl px-4 py-3 pl-8 text-white text-lg font-bold placeholder-slate-500 focus:border-emerald-500 focus:bg-slate-800/80 outline-none transition-all shadow-inner ${readOnly ? 'opacity-70 cursor-not-allowed bg-slate-900' : ''}`}
              placeholder="5000"
            />
          </div>
        </div>

        {/* Comfort Budget */}
        <div className="space-y-2">
          <label className="text-sm text-emerald-300 font-bold uppercase tracking-wider">Comfort (Ideal)</label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 font-bold">₹</span>
            <input
              type="number"
              name="comfort_budget"
              value={budget.comfort_budget}
              onChange={handleChange}
              disabled={readOnly}
              className={`w-full bg-slate-800 border-2 border-emerald-500/50 rounded-xl px-4 py-3 pl-8 text-white text-lg font-bold placeholder-slate-500 focus:border-emerald-400 focus:bg-slate-800/80 outline-none transition-all shadow-inner shadow-emerald-900/20 ${readOnly ? 'opacity-70 cursor-not-allowed bg-slate-900' : ''}`}
              placeholder="10000"
            />
          </div>
        </div>

        {/* Max Budget */}
        <div className="space-y-2">
          <label className="text-sm text-rose-300 font-bold uppercase tracking-wider">Maximum (Cap)</label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 font-bold">₹</span>
            <input
              type="number"
              name="max_budget"
              value={budget.max_budget}
              onChange={handleChange}
              disabled={readOnly}
              className={`w-full bg-slate-800 border-2 border-rose-500/50 rounded-xl px-4 py-3 pl-8 text-white text-lg font-bold placeholder-slate-500 focus:border-rose-400 focus:bg-slate-800/80 outline-none transition-all shadow-inner shadow-rose-900/20 ${readOnly ? 'opacity-70 cursor-not-allowed bg-slate-900' : ''}`}
              placeholder="15000"
            />
          </div>
        </div>
      </div>

      {/* Group Stats Visualization */}
      {groupStats && (
        <div className="mt-8 pt-6 border-t border-slate-700/50">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Group Budget Analysis</h3>
          
          <div className="relative h-12 bg-slate-700/30 rounded-full overflow-hidden flex items-center">
            {/* Safe Zone */}
            <div 
              className="h-full bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-300 border-r border-emerald-500/30 transition-all duration-500"
              style={{ width: '60%' }} // Dynamic in real app
            >
              Safe Zone: ₹{groupStats.group_min} - ₹{groupStats.group_comfort_avg?.toFixed(0)}
            </div>
            
            {/* Stretch Zone */}
            <div 
              className="h-full bg-yellow-500/20 flex items-center justify-center text-xs font-bold text-yellow-300 transition-all duration-500"
              style={{ width: '40%' }} // Dynamic in real app
            >
              Stretch: Up to ₹{groupStats.group_max}
            </div>
          </div>
          
          <p className="text-xs text-slate-500 mt-3 text-center">
            *Based on everyone's inputs. Aim for the <strong>Safe Zone</strong> for 100% happiness.
          </p>
        </div>
      )}
    </div>
  );
};

export default BudgetModule;
