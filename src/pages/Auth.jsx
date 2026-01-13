import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, ArrowRight, Sparkles, Plane } from 'lucide-react';

const Auth = ({ mode, data, setData, handleSubmit, message, switchMode }) => {
    const isLogin = mode === 'login';

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden bg-[#050505] text-[#f3f2ed]">
            {/* Film Grain */}
            <div className="film-grain" />
            
            {/* Cinematic Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[#020202]" />
                
                {/* Burnt Orange Glow */}
                <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#cc5500]/10 rounded-full blur-[150px]" />
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#f3f2ed]/5 rounded-full blur-[150px]" />

                {/* Subtle Pattern */}
                <motion.div 
                    animate={{ opacity: [0.02, 0.05, 0.02] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div 
                    key={mode}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-md w-full glass-panel p-10 relative z-10 rounded-2xl"
                >
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-14 h-14 border-2 border-[#cc5500] rounded-xl mb-6">
                            {isLogin ? <Plane className="text-[#cc5500]" size={24} /> : <Sparkles className="text-[#cc5500]" size={24} />}
                        </div>
                        <h2 className="text-3xl font-serif text-[#f3f2ed] mb-2">
                            {isLogin ? 'Welcome Back' : 'Join the Journey'}
                        </h2>
                        <p className="text-[#f3f2ed]/40 font-sans text-xs tracking-widest uppercase">
                            {isLogin ? 'Sign in to continue' : 'Create your account'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <div className="grid grid-cols-2 gap-2 bg-[#0a0a0a] p-1 rounded-lg border border-white/5">
                                {['MEMBER', 'ADMIN'].map(role => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => setData({...data, user_type: role})}
                                        className={`py-3 text-xs font-sans transition-all uppercase tracking-widest rounded-md ${
                                            (data.user_type || 'MEMBER') === role 
                                            ? 'bg-[#cc5500] text-white' 
                                            : 'text-[#f3f2ed]/50 hover:text-[#f3f2ed]'
                                        }`}
                                    >
                                        {role === 'MEMBER' ? 'Traveler' : 'Planner'}
                                    </button>
                                ))}
                            </div>
                        )}
                        
                        <div className="space-y-4">
                            <div className="relative group">
                                <User className="absolute left-4 top-4 text-[#f3f2ed]/30 group-focus-within:text-[#cc5500] transition-colors" size={18} />
                                <input 
                                    className="glass-input w-full pl-12 py-4 text-sm"
                                    style={{ color: '#000000' }}
                                    placeholder="Username" 
                                    value={data.username}
                                    onChange={(e) => setData({...data, username: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-4 text-[#f3f2ed]/30 group-focus-within:text-[#cc5500] transition-colors" size={18} />
                                <input 
                                    type="password"
                                    className="glass-input w-full pl-12 py-4 text-sm"
                                    style={{ color: '#000000' }}
                                    placeholder="Password" 
                                    value={data.password}
                                    onChange={(e) => setData({...data, password: e.target.value})}
                                    required
                                />
                            </div>
                        </div>
                        
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-2 group"
                        >
                            {isLogin ? 'Sign In' : 'Create Account'}
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </form>

                    {message && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 bg-red-900/10 border border-red-500/30 rounded-lg text-center text-xs font-sans text-red-400"
                        >
                            {message}
                        </motion.div>
                    )}

                    <div className="mt-8 text-center pt-8 border-t border-white/5">
                        <button 
                            onClick={switchMode}
                            className="text-[#f3f2ed]/50 hover:text-[#f3f2ed] transition-colors text-sm font-sans"
                        >
                            {isLogin ? "New here? " : "Already have an account? "}
                            <span className="text-[#cc5500] hover:underline">
                                {isLogin ? "Create Account" : "Sign In"}
                            </span>
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Auth;

