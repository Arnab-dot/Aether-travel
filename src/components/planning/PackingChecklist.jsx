import React from 'react';

const PackingChecklist = ({ items, toggleItem }) => {
  if (!items || items.length === 0) return null;

  // Group by category
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl backdrop-blur-md border border-slate-700/50 shadow-xl h-full">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span>🎒</span> Smart Packing List
      </h2>

      <div className="space-y-6">
        {Object.entries(grouped).map(([category, catItems]) => (
            <div key={category}>
                <h3 className="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-3">{category}</h3>
                <div className="space-y-2">
                    {catItems.map((item, idx) => (
                        <label key={idx} className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-lg hover:bg-slate-900/60 cursor-pointer transition-colors group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${item.checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500 group-hover:border-emerald-400'}`}>
                                {item.checked && <span className="text-white text-xs">✔</span>}
                            </div>
                            <input 
                                type="checkbox" 
                                className="hidden" 
                                checked={item.checked || false}
                                onChange={() => toggleItem(item.item)}
                            />
                            <span className={`text-slate-300 transition-all ${item.checked ? 'line-through text-slate-500' : ''}`}>
                                {item.item}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default PackingChecklist;
