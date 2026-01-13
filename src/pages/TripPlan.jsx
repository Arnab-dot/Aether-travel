import React, { useState, useEffect } from 'react';
import ItineraryTimeline from '../components/planning/ItineraryTimeline';
import PackingChecklist from '../components/planning/PackingChecklist';
import { FileText, ClipboardList } from 'lucide-react';

const TripPlan = ({ spid, goBack, initialDestination, authenticatedRequest }) => {
  const [destination, setDestination] = useState(initialDestination || '');
  const [itinerary, setItinerary] = useState([]);
  const [packingList, setPackingList] = useState([]);
  
  const [loadingItinerary, setLoadingItinerary] = useState(false);
  const [loadingPacking, setLoadingPacking] = useState(false);
  
  const API_BASE = 'http://localhost:8000/api';

  useEffect(() => {
    if (destination) {
        fetchPackingList();
        fetchItinerary();
    }
  }, [destination]);

  const fetchItinerary = async () => {
    setLoadingItinerary(true);
    try {
        const res = await authenticatedRequest(`${API_BASE}/group/${spid}/itinerary/?destination=${destination}`);
        if (res && res.ok) {
            const data = await res.json();
            setItinerary(data.days || []);
        }
    } catch (e) {
        console.error("Itinerary Error", e);
    }
    setLoadingItinerary(false);
  };

  const fetchPackingList = async () => {
    setLoadingPacking(true);
    try {
        const res = await authenticatedRequest(`${API_BASE}/group/${spid}/packing-list/?destination=${destination}`);
        if (res && res.ok) {
            const data = await res.json();
            setPackingList(data);
        }
    } catch (e) {
        console.error("Packing Error", e);
    }
    setLoadingPacking(false);
  };

  const toggleItem = (itemName) => {
    setPackingList(prev => prev.map(item => 
        item.item === itemName ? { ...item, checked: !item.checked } : item
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl min-h-screen bg-[#050505] text-[#e0e0e0]">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-white/5 pb-6">
        <div>
            <h1 className="text-3xl font-serif text-white flex items-center gap-3 tracking-wide uppercase">
                Trip Details
            </h1>
            <p className="text-gray-500 mt-2 font-mono text-xs tracking-widest uppercase">
                Destination: <span className="text-[#c0a080] font-bold">{destination || 'UNKNOWN'}</span>
            </p>
        </div>
        <div className="flex gap-4">
            <button onClick={goBack} className="text-gray-500 hover:text-white transition-colors font-mono text-xs uppercase tracking-widest">
                ← Back To Dashboard
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left: Itinerary (2/3 width) */}
         <div className="lg:col-span-2 space-y-4">
             <div className="flex items-center gap-2 mb-2 text-[#c0a080] font-mono text-xs uppercase tracking-widest">
                <FileText size={14} /> Daily Schedule
             </div>
             {loadingItinerary ? (
                 <div className="p-10 text-center bg-[#0a0a0a] border border-white/10">
                    <div className="w-8 h-8 border border-[#c0a080] border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
                    <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Building Itinerary...</p>
                 </div>
             ) : (
                 <ItineraryTimeline itinerary={itinerary} />
             )}
         </div>

         {/* Right: Packing List (1/3 width) */}
         <div className="lg:col-span-1 space-y-4">
             <div className="flex items-center gap-2 mb-2 text-[#c0a080] font-mono text-xs uppercase tracking-widest">
                <ClipboardList size={14} /> Packing List
             </div>
             {loadingPacking ? (
                 <div className="p-10 text-center bg-[#0a0a0a] border border-white/10">
                     <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Loading checklist...</p>
                 </div>
             ) : (
                 <PackingChecklist items={packingList} toggleItem={toggleItem} />
             )}
         </div>
      </div>
    </div>
  );
};

export default TripPlan;
