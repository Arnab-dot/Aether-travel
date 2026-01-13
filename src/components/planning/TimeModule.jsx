import React, { useMemo } from 'react';
import { Clock } from 'lucide-react';

const TimeModule = ({ availability, setAvailability, heatmapData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAvailability(prev => ({ ...prev, [name]: value }));
  };

  const statusColors = {
    'FREE': 'bg-emerald-500 text-white',
    'MAYBE': 'bg-yellow-500 text-black',
    'BUSY': 'bg-red-500 text-white'
  };

  // Generate date array for heatmap if data exists
  const heatmapDays = useMemo(() => {
    if (!heatmapData?.window_start || !heatmapData?.window_end) return [];
    
    const start = new Date(heatmapData.window_start);
    const end = new Date(heatmapData.window_end);
    const days = [];
    
    let current = start;
    while (current <= end) {
      days.push(new Date(current)); // Copy date
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, [heatmapData]);

  const getDayColor = (dateStr) => {
    const data = heatmapData?.heatmap?.[dateStr];
    if (!data) return 'bg-slate-800'; // No data
    
    // Logic: 
    // All Free -> Green
    // No Busy but some Maybe -> Yellow
    // Any Busy -> Red/Orange
    
    if (data.busy > 0) return 'bg-red-500/50 border-red-500';
    if (data.maybe > 0) return 'bg-yellow-500/50 border-yellow-500';
    if (data.free > 0) return 'bg-emerald-500 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]';
    
    return 'bg-slate-700';
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl backdrop-blur-md border border-slate-700/50 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Clock size={24} className="text-blue-400" /> Time & Availability
      </h2>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="space-y-2">
          <label className="text-sm text-slate-400 font-medium">I am available from</label>
          <input
            type="date"
            name="start_date"
            value={availability.start_date}
            onChange={handleChange}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-slate-400 font-medium">Until</label>
          <input
            type="date"
            name="end_date"
            value={availability.end_date}
            onChange={handleChange}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-slate-400 font-medium">Status</label>
          <select
            name="status"
            value={availability.status}
            onChange={handleChange}
            className={`w-full border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all appearance-none cursor-pointer ${statusColors[availability.status] || 'bg-slate-900/50 text-white'}`}
          >
            <option value="FREE" className="bg-slate-800 text-emerald-400">Fully Free</option>
            <option value="MAYBE" className="bg-slate-800 text-yellow-400">Maybe</option>
            <option value="BUSY" className="bg-slate-800 text-red-400">Not Free</option>
          </select>
        </div>
      </div>

      {/* Heatmap Visualization */}
      {heatmapData && heatmapDays.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-700/50">
           <div className="flex justify-between items-end mb-4">
             <h3 className="text-lg font-semibold text-slate-300">Group Overlap Heatmap</h3>
             <div className="flex gap-3 text-xs">
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Perfect</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-500/50 rounded-sm"></div> Doable</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500/50 rounded-sm"></div> Conflict</div>
             </div>
           </div>

           <div className="grid grid-cols-7 gap-2">
              {heatmapDays.map((date) => {
                 const dateStr = date.toISOString().split('T')[0];
                 const colorClass = getDayColor(dateStr);
                 const dayData = heatmapData.heatmap?.[dateStr];
                 
                 return (
                   <div 
                     key={dateStr}
                     className={`aspect-square rounded-lg border flex flex-col items-center justify-center cursor-help transition-transform hover:scale-105 ${colorClass}`}
                     title={`${dateStr}\nFree: ${dayData?.free || 0}\nMaybe: ${dayData?.maybe || 0}\nBusy: ${dayData?.busy || 0}`}
                   >
                     <span className="text-xs font-bold text-white/90">{date.getDate()}</span>
                     <span className="text-[10px] text-white/60">{date.toLocaleString('default', { month: 'short' })}</span>
                   </div>
                 );
              })}
           </div>
           
           <p className="text-xs text-slate-500 mt-4 text-center">
             Hover over separate days to see who is free.
           </p>
        </div>
      )}
    </div>
  );
};

export default TimeModule;
