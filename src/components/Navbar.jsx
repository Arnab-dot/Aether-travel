import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import UserProfileModal from './UserProfileModal';

const Navbar = ({ currentPage, setCurrentPage, isLoggedIn, handleLogout, isMenuOpen, setIsMenuOpen, spid }) => {
  const [showProfile, setShowProfile] = useState(false);
  
  // Logic: 
  // If NOT Logged In: Show generic visitor items.
  // If Logged In && In Group (spid exists): Show Group features, Hide Join/Create.
  // If Logged In && No Group: Show Join/Create, Hide planning features.

  let navItems = [];

  if (!isLoggedIn) {
      navItems = [
        { id: 'discover', label: 'Explore' },
        { id: 'about', label: 'Manifesto' },
        { id: 'register', label: 'Sign Up' },
        { id: 'login', label: 'Login' },
      ];
  } else {
      if (spid) {
          // IN A GROUP
          navItems = [
            { id: 'group-details', label: 'Mission Data' }, // Renamed for sci-fi theme
            { id: 'planning', label: 'Plan' },
            { id: 'decision', label: 'Decide' },
            { id: 'discover', label: 'Explore' },
          ];
      } else {
          // FREE AGENT
          navItems = [
            { id: 'create', label: 'Create' },
            { id: 'join', label: 'Join' },
            { id: 'discover', label: 'Explore' },
            { id: 'about', label: 'Manifesto' },
          ];
      }
  }

  const handleClick = (pageId) => {
    setCurrentPage(pageId);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed w-full top-0 z-50 glass-nav transition-all duration-500">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
            {/* Logo - Burnt Orange Accent */}
            <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => setCurrentPage('home')}
            >
                <div className="w-10 h-10 flex items-center justify-center border-2 border-[#cc5500] rounded-lg">
                    <span className="font-serif text-[#cc5500] text-xl font-bold">A</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-serif text-[#f3f2ed] tracking-wider group-hover:text-[#cc5500] transition-colors">
                        Aether
                    </span>
                    <span className="text-[8px] font-sans text-[#f3f2ed]/40 tracking-[0.2em] uppercase">
                        Friends. Travel. Legends.
                    </span>
                </div>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-6">
                <NavButton active={currentPage === 'home'} onClick={() => setCurrentPage('home')}>
                    HOME
                </NavButton>
                <div className="h-4 w-[1px] bg-[#f3f2ed]/10" />
                {navItems.map(item => (
                    <NavButton 
                        key={item.id} 
                        active={currentPage === item.id} 
                        onClick={() => handleClick(item.id)}
                        variant={item.id === 'create' || item.id === 'register' ? 'primary' : 'default'}
                    >
                        {item.label}
                    </NavButton>
                ))}
                
                {isLoggedIn && (
                    <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
                        <div className="text-right hidden xl:block">
                            <div className="text-[#f3f2ed] font-sans text-sm font-bold tracking-wide">
                                {localStorage.getItem('username') || 'Agent'}
                            </div>
                            <div className="text-[#cc5500] font-mono text-[9px] uppercase tracking-widest">
                                {localStorage.getItem('user_type') || 'Operative'}
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowProfile(true)}
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#cc5500] to-orange-800 flex items-center justify-center text-white font-bold text-xs ring-2 ring-transparent hover:ring-[#cc5500]/50 transition-all shadow-lg shadow-orange-900/20"
                            title="My Profile"
                        >
                            {(localStorage.getItem('username') || 'A')[0].toUpperCase()}
                        </button>
                        <NavButton onClick={handleLogout} variant="danger">
                            LOGOUT
                        </NavButton>
                    </div>
                )}
            </div>

            <UserProfileModal 
                isOpen={showProfile} 
                onClose={() => setShowProfile(false)} 
            />

            {/* Mobile Menu Toggle */}
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="lg:hidden p-2 text-[#cc5500] hover:text-[#f3f2ed] transition-colors"
            >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMenuOpen && (
             <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden border-t border-white/5 bg-[#050505]/98 backdrop-blur-xl"
             >
                <div className="p-8 flex flex-col gap-6 items-center">
                    <NavButton onClick={() => { setCurrentPage('home'); setIsMenuOpen(false); }}>HOME</NavButton>
                    {navItems.map(item => (
                        <NavButton 
                            key={item.id}
                            onClick={() => { setCurrentPage(item.id); setIsMenuOpen(false); }}
                            active={currentPage === item.id}
                        >
                            {item.label}
                        </NavButton>
                    ))}
                    {isLoggedIn && (
                         <NavButton onClick={() => { handleLogout(); setIsMenuOpen(false); }} variant="danger">
                            LOGOUT
                        </NavButton>
                    )}
                </div>
             </motion.div>
        )}
    </nav>
  );
};

const NavButton = ({ children, onClick, active, variant = 'default' }) => {
    const variants = {
        default: active 
            ? "text-[#cc5500] border-b-2 border-[#cc5500] pb-1" 
            : "text-[#f3f2ed]/60 hover:text-[#cc5500] transition-all duration-300",
        primary: "text-[#f3f2ed] border border-[#cc5500] px-5 py-2 hover:bg-[#cc5500] hover:text-white transition-colors duration-300 bg-transparent rounded-full text-xs",
        danger: "text-red-500/50 hover:text-red-500 text-[10px]"
    };

    const isPrimary = variant === 'primary';

    return (
        <button 
            onClick={onClick}
            className={`font-sans text-xs tracking-[0.15em] uppercase ${variants[variant]} ${!isPrimary ? 'px-2' : ''}`}
        >
            {children}
        </button>
    );
};

export default Navbar;

