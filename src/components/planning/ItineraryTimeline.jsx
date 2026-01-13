import React from 'react';
import { Map } from 'lucide-react';

const ItineraryTimeline = ({ itinerary }) => {
  if (!itinerary || itinerary.length === 0) return null;

  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl backdrop-blur-md border border-slate-700/50 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Map size={24} className="text-emerald-400" /> Day-wise Itinerary
      </h2>
      
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        {itinerary.map((dayPlan, index) => (
          <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            
            {/* Icon */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-bold z-10">
               {dayPlan.day}
            </div>
            
            {/* Content Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-900/80 p-6 rounded-xl border border-slate-700 shadow-lg transition-transform hover:scale-[1.02]">
              <div className="flex items-center justify-between space-x-2 mb-4">
                <div className="font-bold text-slate-200 text-lg">Day {dayPlan.day} Adventure</div>
              </div>
              
              <div className="space-y-4">
                 {/* Safe Check for Schedule */}
                 {dayPlan.schedule ? (
                     ['morning', 'afternoon', 'evening'].map((timeOfDay) => (
                        dayPlan.schedule[timeOfDay] && (
                            <div key={timeOfDay} className={`relative border-l-2 pl-4 transition-all ${
                                dayPlan.schedule[timeOfDay].type === 'GROUP' 
                                ? 'border-primary/50 bg-primary/5 p-3 rounded-r-xl' 
                                : 'border-emerald-500/50 bg-emerald-500/5 p-3 rounded-r-xl'
                            }`}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className={`font-mono text-xs uppercase tracking-widest font-bold ${
                                        dayPlan.schedule[timeOfDay].type === 'GROUP' ? 'text-primary' : 'text-emerald-400'
                                    }`}>
                                        {timeOfDay} • {dayPlan.schedule[timeOfDay].type === 'GROUP' ? 'Shared Moment' : 'Personal Freedom'}
                                    </span>
                                </div>
                                
                                {dayPlan.schedule[timeOfDay].type === 'GROUP' ? (
                                    // GROUP CARD
                                    <div className="text-slate-200 font-bold text-lg">
                                        {dayPlan.schedule[timeOfDay].group_activity}
                                    </div>
                                ) : (
                                    // PERSONAL SPLIT CARD
                                    <div className="space-y-2 mt-2">
                                        <div className="text-slate-300 font-medium opacity-80 mb-2 italic">
                                            "{dayPlan.schedule[timeOfDay].group_activity || 'Time to split up and recharge!'}"
                                        </div>
                                        <div className="grid gap-2">
                                            {dayPlan.schedule[timeOfDay].personal_blocks && Object.entries(dayPlan.schedule[timeOfDay].personal_blocks).map(([user, activity], idx) => (
                                                <div key={idx} className="flex items-start gap-2 bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-black shrink-0">
                                                        {user[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <span className="text-emerald-200 font-bold text-xs block">{user}</span>
                                                        <span className="text-slate-400 text-xs leading-tight block">{activity}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                     ))
                 ) : (
                     // Fallback for old schema
                    dayPlan.activities?.map((activity, idx) => (
                        <div key={idx} className="flex gap-3 text-sm text-slate-400">
                            <span className="font-mono text-emerald-400 shrink-0">{activity.time}</span>
                            <span>{activity.desc}</span>
                        </div>
                     ))
                 )}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryTimeline;
