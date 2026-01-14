import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Globe } from 'lucide-react';

const CreateGroup = ({ groupData, setGroupData, handleCreateGroup, groupMessage }) => {
    return (
        <div className="min-h-screen pt-20 px-4 flex items-center justify-center relative overflow-hidden bg-[#050505] text-[#f3f2ed]">
             {/* Film Grain */}
             <div className="film-grain" />
             
             {/* Deep Ambient Background */}
             <div className="absolute inset-0 bg-gradient-to-br from-[#020202] via-[#0a0a0a] to-[#050505]" />
             
             {/* Floating Orbs */}
             <motion.div 
                animate={{ y: [0, -30, 0], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 right-1/3 w-[600px] h-[600px] bg-[#cc5500]/10 rounded-full blur-[150px]" 
             />
             <motion.div 
                animate={{ y: [0, 20, 0], opacity: [0.05, 0.1, 0.05] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-[#f3f2ed]/5 rounded-full blur-[120px]" 
             />

             {/* World Grid Pattern */}
             <div className="absolute inset-0 opacity-[0.03]" style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3f2ed' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
             }} />

             {/* Main Card */}
             <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-lg w-full relative z-10"
             >
                {/* Decorative Corner Lines */}
                <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-[#cc5500]/30" />
                <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-[#cc5500]/30" />
                <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-[#cc5500]/30" />
                <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-[#cc5500]/30" />

                <div className="glass-panel p-12 rounded-none border border-white/10">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#cc5500]/10 border border-[#cc5500]/30 rounded-full mb-8"
                        >
                            <Globe size={14} className="text-[#cc5500]" />
                            <span className="text-[#cc5500] text-xs font-sans uppercase tracking-widest">New Expedition</span>
                        </motion.div>
                        
                        <h2 className="text-4xl md:text-5xl font-serif text-[#f3f2ed] mb-4 leading-tight">
                            Assemble Your<br/>
                            <span className="text-[#cc5500] italic">Crew</span>
                        </h2>
                        <p className="text-[#f3f2ed]/40 font-sans text-sm max-w-sm mx-auto leading-relaxed">
                            Every legendary journey begins with a single code. Create yours below.
                        </p>
                    </div>
                    
                    <form onSubmit={handleCreateGroup} className="space-y-8">
                        {/* Input Section */}
                        <div className="relative">
                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#cc5500]" />
                            <label className="block text-[#f3f2ed]/50 text-xs font-sans uppercase tracking-widest mb-3 pl-1">
                                Expedition Code
                            </label>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f3f2ed]/20 group-focus-within:text-[#cc5500] transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="Ladakh_2026"
                                    className="w-full bg-[#0a0a0a] border-2 border-white/10 focus:border-[#cc5500] px-5 py-5 pl-12 text-xl font-serif tracking-wider text-[#f3f2ed] placeholder:text-gray-500 transition-all outline-none"
                                    value={groupData.create_spid}
                                    onChange={(e) => setGroupData({...groupData, create_spid: e.target.value})}
                                    required
                                />
                            </div>
                            <p className="text-[#f3f2ed]/30 text-xs mt-3 font-sans">
                                Choose something memorable. This is how friends will find you.
                            </p>
                        </div>
                        
                        {/* Submit Button */}
                        <motion.button 
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full py-5 bg-[#cc5500] text-[#f3f2ed] font-sans text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 group hover:bg-[#e66600] transition-colors"
                        >
                            Begin Journey 
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </form>

                    {/* Success Message */}
                    {groupMessage && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 p-5 bg-[#cc5500]/10 border-l-4 border-[#cc5500]"
                        >
                            <p className="text-[#cc5500] font-sans text-sm">{groupMessage}</p>
                        </motion.div>
                    )}
                </div>

                {/* Bottom Caption */}
                <p className="text-center text-[#f3f2ed]/20 text-xs font-sans mt-8 tracking-widest uppercase">
                    Friends • Travel • Legends
                </p>
             </motion.div>
        </div>
    );
};

export default CreateGroup;


