import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import { ArrowRight, MapPin, Plane } from 'lucide-react';

// --- GLOBAL ASSETS ---
// --- GLOBAL ASSETS ---
const IMAGES = {
    // HERO: Wanderlust/Travel Aesthetic
    desk: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2670&auto=format&fit=crop", // Dramatic mountain landscape at sunrise 
    
    // INDIAN SPOTS
    nature: "/darjeeling.jpg", 
    city_night: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=1587&auto=format&fit=crop", // Mumbai: Victoria Terminus (Story Chapter)
    mumbai_wall: "/mumbai.jpg", // Mumbai: Marine Drive (Photo Wall - User provided)
    road: "/kerala.jpg", 
    bangalore: "/bangalore.jpg", 
    goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop",
    coorg: "/darjeeling.jpg", // Using local placeholder if needed or unsplash
    jaipur: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1470&auto=format&fit=crop",
    kolkata: "/kolkata.jpg",
    varanasi: "/varanasi.jpg", // Varanasi Ghats (User provided)
    ladakh: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1470&auto=format&fit=crop",
    hampi: "https://images.unsplash.com/photo-1600100598004-80c43415665d?q=80&w=1470&auto=format&fit=crop", 
    mysore: "https://images.unsplash.com/photo-1582510003544-4d00b7f00d42?q=80&w=1470&auto=format&fit=crop",
    rishikesh: "https://images.unsplash.com/photo-1591786529606-25805562d90d?q=80&w=1470&auto=format&fit=crop",

    // WORLD SPOTS
    nyc: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1470&auto=format&fit=crop",
    venice: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=1470&auto=format&fit=crop",
    paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1473&auto=format&fit=crop",
    tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1494&auto=format&fit=crop",
    london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1470&auto=format&fit=crop",
    santorini: "/santorini.jpg", // Santorini sunset (User provided)
    dubai: "/dubai.jpg", // Dubai Burj Khalifa (User provided)
    swiss: "/swiss.jpg", // Swiss Alps Matterhorn train (User provided)
};

// --- GLOBAL COMPONENTS ---

const FilmGrain = () => (
    <div className='fixed inset-0 pointer-events-none z-50 opacity-[0.07] mix-blend-overlay'
         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
    />
);

// --- 3D ATMOSPHERE COMPONENT ---
const Atmosphere = (props) => {
    const ref = useRef();
    const [sphere] = useState(() => random.inSphere(new Float32Array(3000), { radius: 1.5 }));
    
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 30;
            ref.current.rotation.y -= delta / 50;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#f3f2ed" // Using our "paper" white/cream color
                    size={0.003}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.4}
                />
            </Points>
        </group>
    );
};

const AtmosphereCanvas = () => (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-60 mix-blend-screen">
        <Canvas camera={{ position: [0, 0, 1] }}>
            <Atmosphere />
        </Canvas>
    </div>
);

// --- 3D TILT IMAGE COMPONENT ---
const TiltImage = ({ src, alt }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);
    const brightness = useTransform(mouseY, [-0.5, 0.5], [1.1, 0.9]); // Subtle lighting shift

    return (
        <motion.div
            style={{ perspective: 1000 }}
            className="w-full h-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    filter: useMotionTemplate`brightness(${brightness})`,
                    transformStyle: "preserve-3d" // CRITICAL for depth
                }}
                className="w-full h-full relative"
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
                {/* Image Layer */}
                <img 
                    src={src} 
                    alt={alt}
                    className="w-full h-full object-cover shadow-2xl"
                    style={{ transform: "translateZ(20px)" }} // Push image forward
                />

                {/* Reflection/Gloss Layer */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ transform: "translateZ(30px)" }} />
            </motion.div>
        </motion.div>
    );
};

// --- VISUAL DENSITY COMPONENTS ---

// --- VISUAL DENSITY COMPONENTS ---

const DigicamPhoto = ({ src, city, x = 0, y = 0, angle = 0, delay = 0, hoverCaption = "", isWallMode = false }) => {
    const { scrollY } = useScroll();
    // Parallax effect: just moves up slightly as we scroll
    const parallaxY = useTransform(scrollY, [0, 1000], [0, isWallMode ? 0 : -50]); // No parallax in wall mode if standard grid
    
    // Random sway effect
    const randomDuration = 2 + Math.random() * 2;
    
    return (
        <motion.div 
            style={{ 
                left: isWallMode ? "auto" : "50%", 
                top: isWallMode ? "auto" : "50%", 
                marginLeft: isWallMode ? 0 : x, 
                marginTop: isWallMode ? 0 : y, 
                y: isWallMode ? 0 : parallaxY, 
                rotate: angle,
                position: isWallMode ? 'relative' : 'absolute' 
            }} 
            className={`z-0 origin-top ${isWallMode ? 'mx-4 my-8 inline-block align-top' : ''}`}
            animate={{ 
                rotate: [angle - 2, angle + 2, angle - 2],
            }}
            transition={{ 
                duration: randomDuration, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: delay 
            }}
            whileHover={{ scale: 1.1, zIndex: 50, transition: { duration: 0.2 } }}
        >
            {/* The Pin */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-3 h-3 rounded-full bg-gradient-to-tr from-red-600 to-red-400 shadow-[0_2px_4px_rgba(0,0,0,0.3)] border border-red-800" />
            
            {/* The Photo Frame */}
            <div className="bg-[#f3f2ed] p-1 pb-4 shadow-xl transform origin-top hover:shadow-2xl transition-shadow duration-300 w-[140px] md:w-[160px] group">
                <div className="relative overflow-hidden aspect-[4/3] bg-black">
                     <img src={src} alt={city} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                     {/* Digicam Date Stamp */}
                     <div className="absolute bottom-2 right-2 font-mono text-[8px] text-[#ff9e3d] tracking-widest drop-shadow-md opacity-80">
                        {`04 23 '98`}
                     </div>
                     {/* Hover Overlay Caption */}
                     {hoverCaption && (
                         <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none p-2">
                             <p className="font-handwriting text-[#f3f2ed] text-center text-sm leading-tight rotate-[-5deg] drop-shadow-lg">
                                 {hoverCaption}
                             </p>
                         </div>
                     )}
                </div>
                <div className="flex justify-between items-center mt-2 px-1">
                    <p className="font-handwriting text-[#050505]/80 text-[10px] uppercase tracking-widest">{city}</p>
                 </div>
            </div>
        </motion.div>
    );
};

const BgTypography = ({ text, top = "20%", left = "0", opacity = 0.03, size = "text-[20vw]" }) => {
    return (
        <div 
            className={`absolute pointer-events-none font-serif font-bold uppercase leading-none tracking-tighter text-[#f3f2ed] select-none z-0 ${size}`}
            style={{ top, left, opacity }}
        >
            {text}
        </div>
    );
};

const TextureOverlay = () => {
    return (
        <div className="fixed inset-0 z-50 pointer-events-none opacity-20 mix-blend-screen">
            <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-[#ff4500] to-transparent opacity-30 transform -skew-y-6" />
            <div className="absolute bottom-0 right-0 w-[50vw] h-[50vh] bg-gradient-to-t from-[#ff8c00] to-transparent opacity-20 rounded-full blur-3xl" />
        </div>
    );
};

// --- MICRO-INTERACTION: MAGNETIC BUTTON ---
const MagneticButton = ({ children, className, onClick, ...props }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        x.set((clientX - centerX) * 0.3); // Magnetic pull strength
        y.set((clientY - centerY) * 0.3);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.button 
            ref={ref}
            style={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className={className}
            {...props}
        >
            {children}
        </motion.button>
    );
};

// --- ACT I: THE DREAMER'S GATEWAY ---

// Floating Object Component
const FloatingObject = ({ children, x, y, delay = 0, duration = 4, rotate = 0 }) => (
    <motion.div
        className="absolute pointer-events-none select-none"
        style={{ left: x, top: y }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
            opacity: [0, 1, 1, 0.8],
            y: [20, 0, -10, 0],
            rotate: [rotate - 5, rotate + 5, rotate - 5]
        }}
        transition={{ 
            duration: duration, 
            repeat: Infinity, 
            delay: delay,
            ease: "easeInOut"
        }}
    >
        {children}
    </motion.div>
);

// Passport Stamp Component
const PassportStamp = ({ text, x, y, rotate = -15, delay = 0 }) => (
    <FloatingObject x={x} y={y} delay={delay} duration={6} rotate={rotate}>
        <div 
            className="border-2 border-[#cc5500]/60 rounded-lg px-4 py-2 text-[#cc5500]/70 font-mono text-xs uppercase tracking-wider"
            style={{ transform: `rotate(${rotate}deg)` }}
        >
            <div className="border-b border-[#cc5500]/30 pb-1 mb-1 text-center font-bold">{text}</div>
            <div className="text-[8px] text-center opacity-60">APPROVED</div>
        </div>
    </FloatingObject>
);

// Rotating Typewriter Effect Hook
const useRotatingTypewriter = (phrases, typeSpeed = 60, deleteSpeed = 40, pauseDuration = 2000, initialDelay = 2000) => {
    const [displayText, setDisplayText] = useState('');
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [started, setStarted] = useState(false);
    
    useEffect(() => {
        const startTimeout = setTimeout(() => setStarted(true), initialDelay);
        return () => clearTimeout(startTimeout);
    }, [initialDelay]);
    
    useEffect(() => {
        if (!started) return;
        
        const currentPhrase = phrases[phraseIndex];
        
        const timer = setTimeout(() => {
            if (!isDeleting) {
                // Typing
                if (displayText.length < currentPhrase.length) {
                    setDisplayText(currentPhrase.slice(0, displayText.length + 1));
                } else {
                    // Pause before deleting
                    setTimeout(() => setIsDeleting(true), pauseDuration);
                }
            } else {
                // Deleting
                if (displayText.length > 0) {
                    setDisplayText(displayText.slice(0, -1));
                } else {
                    setIsDeleting(false);
                    setPhraseIndex((prev) => (prev + 1) % phrases.length);
                }
            }
        }, isDeleting ? deleteSpeed : typeSpeed);
        
        return () => clearTimeout(timer);
    }, [displayText, isDeleting, phraseIndex, phrases, typeSpeed, deleteSpeed, pauseDuration, started]);
    
    return displayText;
};

const TRAVELER_QUESTIONS = [
    "Where will your story begin?",
    "What memories are waiting for you?",
    "Who will you become out there?",
    "When did you last feel truly alive?"
];

const OpeningStillness = () => {
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 400], [1, 0]);
    const scale = useTransform(scrollY, [0, 400], [1, 1.15]);
    const textY = useTransform(scrollY, [0, 400], [0, -80]);
    const bgY = useTransform(scrollY, [0, 400], [0, 100]);
    
    const mainText = useRotatingTypewriter(TRAVELER_QUESTIONS, 60, 30, 2500, 2000);

    return (
        <section className="h-screen relative flex items-center justify-center overflow-hidden bg-[#020202]">
            
            {/* LAYER 1: Deep Background with Parallax */}
            <motion.div style={{ y: bgY, scale }} className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2831&auto=format&fit=crop"
                    alt="Journey" 
                    className="w-full h-full object-cover opacity-30 blur-[2px]" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#020202]/80 via-transparent to-[#020202]/80" />
            </motion.div>

            {/* LAYER 2: Floating World Map Lines (SVG Pattern) */}
            <div className="absolute inset-0 z-[1] opacity-10">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="worldGrid" width="100" height="100" patternUnits="userSpaceOnUse">
                            <circle cx="50" cy="50" r="1" fill="#cc5500" opacity="0.5"/>
                            <line x1="0" y1="50" x2="100" y2="50" stroke="#f3f2ed" strokeWidth="0.3" opacity="0.3"/>
                            <line x1="50" y1="0" x2="50" y2="100" stroke="#f3f2ed" strokeWidth="0.3" opacity="0.3"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#worldGrid)" />
                </svg>
            </div>

            {/* LAYER 3: Floating Decorative Objects */}
            <div className="absolute inset-0 z-[5] overflow-hidden">
                {/* Passport Stamps */}
                <PassportStamp text="WANDERLUST" x="8%" y="20%" rotate={-12} delay={0.5} />
                <PassportStamp text="ADVENTURE" x="85%" y="15%" rotate={8} delay={1.2} />
                <PassportStamp text="EXPLORE" x="78%" y="70%" rotate={-5} delay={2.0} />
                <PassportStamp text="DISCOVER" x="5%" y="75%" rotate={10} delay={1.8} />
                
                {/* Floating Compass */}
                <FloatingObject x="90%" y="45%" delay={0.8} duration={8}>
                    <div className="w-16 h-16 rounded-full border border-[#f3f2ed]/20 flex items-center justify-center">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="text-[#cc5500]/60 text-2xl"
                        >
                            ✧
                        </motion.div>
                    </div>
                </FloatingObject>
                
                {/* Flight Path Dashes */}
                <motion.div 
                    className="absolute left-[10%] top-[30%] w-[30%] h-[1px]"
                    style={{ background: 'linear-gradient(90deg, transparent, #cc5500, transparent)' }}
                    animate={{ opacity: [0.2, 0.6, 0.2], x: [0, 50, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div 
                    className="absolute right-[15%] bottom-[35%] w-[25%] h-[1px]"
                    style={{ background: 'linear-gradient(90deg, transparent, #f3f2ed, transparent)', transform: 'rotate(-15deg)' }}
                    animate={{ opacity: [0.1, 0.4, 0.1], x: [-30, 20, -30] }}
                    transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                />

                {/* Tiny Plane Icon */}
                <motion.div 
                    className="absolute text-[#f3f2ed]/30 text-lg"
                    style={{ left: '15%', top: '25%' }}
                    animate={{ 
                        x: [0, 200, 400],
                        y: [0, -50, 0],
                        opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 8, repeat: Infinity, delay: 2 }}
                >
                    <Plane size={18} />
                </motion.div>
            </div>

            {/* LAYER 4: Central Content */}
            <motion.div style={{ y: textY, opacity }} className="relative z-20 text-center px-6 max-w-5xl">
                
                {/* Pre-headline */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mb-6"
                >
                    <span className="inline-block px-4 py-1 border border-[#cc5500]/40 rounded-full text-[#cc5500]/80 text-xs uppercase tracking-[0.3em] font-sans">
                        Not just a trip. A transformation.
                    </span>
                </motion.div>

                {/* Main Headline with Typewriter */}
                <motion.h1 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 1.5 }}
                    className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#f3f2ed] mb-8 leading-[1.1] tracking-tight"
                >
                    <span className="block text-[#f3f2ed]/60 text-2xl md:text-3xl font-sans font-light tracking-widest uppercase mb-4">
                        The World Awaits
                    </span>
                    <span className="relative">
                        {mainText}
                        <motion.span 
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="text-[#cc5500]"
                        >
                            |
                        </motion.span>
                    </span>
                </motion.h1>

                {/* Poetic Subtext */}
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 4, duration: 2 }}
                    className="font-serif text-xl md:text-2xl text-[#f3f2ed]/50 italic max-w-2xl mx-auto mb-12"
                >
                    "Every journey starts with a single question. <br/>
                    <span className="text-[#cc5500]/80">Yours is waiting to be answered.</span>"
                </motion.p>

                {/* CTA Button */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 5, duration: 1 }}
                >
                    <MagneticButton className="group relative px-10 py-4 bg-transparent border-2 border-[#f3f2ed]/30 rounded-full text-[#f3f2ed] font-sans text-sm uppercase tracking-[0.2em] overflow-hidden hover:border-[#cc5500] transition-colors duration-500">
                        <span className="relative z-10 group-hover:text-[#cc5500] transition-colors">Begin Your Journey</span>
                        <motion.div 
                            className="absolute inset-0 bg-[#f3f2ed]/5" 
                            initial={{ x: '-100%' }}
                            whileHover={{ x: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    </MagneticButton>
                </motion.div>
            </motion.div>

            {/* LAYER 5: Bottom Scroll Indicator */}
            <motion.div 
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
                animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <span className="text-[#f3f2ed]/40 text-[10px] uppercase tracking-[0.3em]">Scroll to Explore</span>
                <div className="w-[1px] h-8 bg-gradient-to-b from-[#f3f2ed]/40 to-transparent" />
            </motion.div>

            {/* LAYER 6: Corner Decorations */}
            <div className="absolute top-8 left-8 z-20 opacity-40">
                <div className="w-12 h-12 border-l-2 border-t-2 border-[#f3f2ed]/30" />
            </div>
            <div className="absolute top-8 right-8 z-20 opacity-40">
                <div className="w-12 h-12 border-r-2 border-t-2 border-[#f3f2ed]/30" />
            </div>
            <div className="absolute bottom-8 left-8 z-20 opacity-40">
                <div className="w-12 h-12 border-l-2 border-b-2 border-[#f3f2ed]/30" />
            </div>
            <div className="absolute bottom-8 right-8 z-20 opacity-40">
                <div className="w-12 h-12 border-r-2 border-b-2 border-[#f3f2ed]/30" />
            </div>
        </section>
    );
};

const MatchCutSequence = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
    
    // Smooth transition logic for match cuts could go here, 
    // for now we use a simpler scroll-based reveal for the "Transitions" feel
    
    return (
        <section ref={containerRef} className="min-h-[150vh] bg-[#050505] flex items-center justify-center relative">
             <div className="text-center px-6 z-10">
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="mb-32"
                >
                    <p className="font-serif text-5xl md:text-7xl text-[#f3f2ed] mb-6">Life doesn't stop.</p>
                    <p className="font-sans text-[#f3f2ed]/50 text-sm tracking-[0.3em] uppercase">But it asks questions.</p>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.2 }}
                >
                    <p className="text-[#f3f2ed]/40 text-xs mb-4 uppercase tracking-widest">Starting from where you are</p>
                    <div className="relative inline-block group">
                        <input 
                            type="text" 
                            placeholder="City, State" 
                            className="bg-transparent border-b border-[#f3f2ed]/20 text-[#f3f2ed] text-center w-64 py-2 focus:outline-none focus:border-[#f3f2ed]/60 transition-colors placeholder:text-[#f3f2ed]/20 font-serif text-xl"
                        />
                    </div>
                </motion.div>
             </div>
        </section>
    );
};

// --- ACT II: STORIES, NOT PACKAGES ---

const EditorialManifesto = () => {
    return (
        <section className="py-32 bg-[#0a0a0a] px-6 flex justify-center relative overflow-hidden">
             {/* Visual Density - Background Text Only */}
             <BgTypography text="JOURNEY" top="5%" left="-10%" opacity={0.02} size="text-[25vw]" />
             
            <div className="max-w-4xl text-center relative z-10 bg-[#0a0a0a]/80 p-8 backdrop-blur-sm rounded-lg border border-white/5">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="font-serif text-6xl md:text-8xl text-[#f3f2ed] mb-8 leading-[0.9]"
                >
                    We don't book <br/> separate seats.
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="font-serif text-2xl md:text-4xl text-[#cc5500] italic mb-12"
                >
                    We build legends between friends.
                </motion.p>
                <motion.div 
                     initial={{ opacity: 0 }}
                     whileInView={{ opacity: 1 }}
                     transition={{ duration: 1, delay: 0.8 }}
                     className="font-sans text-[#f3f2ed]/60 leading-relaxed text-lg space-y-6 max-w-2xl mx-auto"
                >
                    <p>
                        Because years from now, you won't remember the cost of the flight or the name of the hotel. 
                        You'll remember the <strong>chaos of the co-pilot</strong>, the playlist that defined the summer, 
                        and the silence that fell over the group when you finally saw the view.
                    </p>
                    <p>
                        Escaping the group chat is hard. <br/>
                        Building a reality together is everything.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

// --- PHOTO WALL SECTION (NEW) ---
const PhotoWall = () => {
    return (
        <section className="py-20 bg-[#0a0a0a] min-h-screen relative overflow-hidden flex flex-col items-center border-t border-white/5">
             <BgTypography text="MEMORIES" top="5%" left="-5%" opacity={0.02} size="text-[25vw]" />
             
             <div className="container mx-auto px-4 z-10 relative">
                 <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="font-serif text-4xl md:text-5xl text-[#f3f2ed] text-center mb-16"
                 >
                     The Wall of <span className="text-[#cc5500] italic">"Take Me Back"</span>
                 </motion.h2>

                 {/* DOMESTIC DIARIES */}
                 <div className="mb-20">
                     <h3 className="font-sans text-[#f3f2ed]/50 text-sm tracking-[0.5em] uppercase text-center mb-10 border-b border-white/10 pb-4 mx-auto max-w-md">Domestic Diaries</h3>
                     <div className="flex flex-wrap justify-center gap-8 md:gap-12 perspective-[1000px]">
                        {[
                            { src: IMAGES.nature, city: "DARJEELING", caption: "Chai above the clouds.", angle: -4 },
                            { src: IMAGES.mumbai_wall, city: "MUMBAI", caption: "Marine Drive nights.", angle: 3 },
                            { src: IMAGES.road, city: "KERALA", caption: "Houseboat stillness.", angle: -2 },
                            { src: IMAGES.bangalore, city: "BANGALORE", caption: "Pub hopping nights.", angle: 5 },
                            { src: IMAGES.goa, city: "GOA", caption: "Sunburn & Scooters.", angle: -6 },
                            { src: IMAGES.coorg, city: "COORG", caption: "Coffee plantation runs.", angle: 2 },
                            { src: IMAGES.jaipur, city: "JAIPUR", caption: "Pink City palaces.", angle: -3 },
                            { src: IMAGES.kolkata, city: "KOLKATA", caption: "Tram rides & sweets.", angle: 4 },
                            { src: IMAGES.varanasi, city: "VARANASI", caption: "Ghats at sunrise.", angle: -5 },
                            { src: IMAGES.ladakh, city: "LADAKH", caption: "The ultimate roadtrip.", angle: 3 },
                        ].map((item, i) => (
                            <DigicamPhoto key={i} {...item} isWallMode={true} hoverCaption={item.caption} delay={i * 0.1} />
                        ))}
                     </div>
                 </div>

                 {/* GLOBAL DREAMS */}
                 <div>
                     <h3 className="font-sans text-[#f3f2ed]/50 text-sm tracking-[0.5em] uppercase text-center mb-10 border-b border-white/10 pb-4 mx-auto max-w-md">Global Dreams</h3>
                     <div className="flex flex-wrap justify-center gap-8 md:gap-12 perspective-[1000px]">
                        {[
                             { src: IMAGES.nyc, city: "NEW YORK", caption: "Manhattan sunset magic.", angle: 3 },
                             { src: IMAGES.venice, city: "VENICE", caption: "Lost in canals.", angle: -4 },
                             { src: IMAGES.paris, city: "PARIS", caption: "Eiffel sparkles.", angle: 2 },
                             { src: IMAGES.tokyo, city: "TOKYO", caption: "Neon dreams.", angle: -5 },
                             { src: IMAGES.london, city: "LONDON", caption: "Rainy days & tea.", angle: 4 },
                             { src: IMAGES.santorini, city: "SANTORINI", caption: "Blue domes forever.", angle: -3 },
                             { src: IMAGES.dubai, city: "DUBAI", caption: "Desert skylines.", angle: 5 },
                             { src: IMAGES.swiss, city: "SWISS ALPS", caption: "Valley train rides.", angle: -2 },
                        ].map((item, i) => (
                            <DigicamPhoto key={i} {...item} isWallMode={true} hoverCaption={item.caption} delay={i * 0.1} />
                        ))}
                     </div>
                 </div>
             </div>
        </section>
    );
};

const StoryChapter = ({ title, visual, text1, text2, align = 'left', img }) => {
    const isRight = align === 'right';
    return (
        <section className="min-h-screen flex items-center justify-center py-24 px-6 md:px-24 relative overflow-hidden">
             <div className={`flex flex-col md:flex-row items-center gap-16 md:gap-32 max-w-7xl w-full ${isRight ? '' : 'md:flex-row-reverse'}`}>
                
                {/* Text Side */}
                <div className="flex-1 z-10">
                    <motion.div
                         initial={{ opacity: 0, x: isRight ? -30 : 30 }}
                         whileInView={{ opacity: 1, x: 0 }}
                         transition={{ duration: 1.2, ease: "easeOut" }}
                         viewport={{ once: true, margin: "-100px" }}
                    >
                        <h3 className="font-serif text-4xl md:text-6xl text-[#f3f2ed] mb-8 leading-tight">{title}</h3>
                        <p className="font-sans text-[#f3f2ed]/70 text-lg mb-4 pl-4 border-l border-[#cc5500]">{text1}</p>
                        <p className="font-sans text-[#f3f2ed]/50 text-lg pl-4 border-l border-transparent">{text2}</p>
                    </motion.div>
                </div>

                {/* Visual Side */}
                <div className="flex-1 w-full aspect-[3/4] relative grayscale-[30%] hover:grayscale-0 transition-all duration-1000 ease-in-out cursor-none">
                     <TiltImage src={img} alt={title} />
                     {/* Story Clutter */}
                     <div className="absolute -bottom-10 -right-10 z-20 transform rotate-6">
                        <div className="bg-[#f3f2ed] text-[#050505] px-4 py-2 font-handwriting text-sm shadow-xl">
                            {title.split(" ")[0]} vibes only
                        </div>
                     </div>
                </div>
             </div>
        </section>
    );
};

// --- ACT III: HOW FAR DO YOU WANT TO GO? ---

const EFFORT_LEVELS = [
    { label: "The Catch-Up", text: "Coffee, gossip, and a view worth sharing.", color: "from-[#050505] via-[#1a237e] to-[#050505]" },
    { label: "The Reunion", text: "Three days to relive three years.", color: "from-[#050505] via-[#004d40] to-[#050505]" },
    { label: "The Escape", text: "Group chat finally goes offline.", color: "from-[#050505] via-[#cc5500] to-[#050505]" },
    { label: "The Odyssey", text: "New stories that no one else will understand.", color: "from-[#050505] via-[#311b92] to-[#050505]" }
];

const IntrospectionSlider = () => {
    const [level, setLevel] = useState(0);

    return (
        <section className="h-screen relative flex items-center justify-center overflow-hidden">
             {/* Dynamic Atmosphere */}
             <motion.div 
                className={`absolute inset-0 bg-gradient-to-b opacity-30 transition-colors duration-[2000ms] ease-in-out ${EFFORT_LEVELS[level].color}`} 
            />
             <BgTypography text={EFFORT_LEVELS[level].label.split(" ")[1] || "ESCAPE"} top="20%" right="-10%" opacity={0.04} size="text-[30vw]" />

            <div className="relative z-10 w-full max-w-3xl px-6 text-center">
                <h2 className="font-serif text-3xl md:text-5xl text-[#f3f2ed] mb-16">
                    How far are you willing to go?
                </h2>
                
                {/* SLIDER UI - MINIMALIST */}
                <div className="relative h-px bg-[#f3f2ed]/20 w-full max-w-lg mx-auto mb-16">
                    <input 
                        type="range" 
                        min="0" max="3" step="1"
                        value={level}
                        onChange={(e) => setLevel(parseInt(e.target.value))}
                        className="absolute inset-0 w-full h-10 -top-5 opacity-0 cursor-pointer z-20"
                    />
                    
                    {/* Active Track & Thumb */}
                    <motion.div 
                        animate={{ width: `${(level / 3) * 100}%` }}
                        className="absolute h-px bg-[#f3f2ed] top-0 left-0"
                    />
                    <motion.div 
                        animate={{ left: `${(level / 3) * 100}%` }}
                        className="absolute w-3 h-3 bg-[#f3f2ed] rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                    />

                    {/* Labels */}
                    <div className="flex justify-between absolute -top-12 w-full">
                        {EFFORT_LEVELS.map((L, i) => (
                            <motion.span 
                                key={i}
                                animate={{ opacity: i === level ? 1 : 0.2 }}
                                className="text-[10px] uppercase tracking-widest text-[#f3f2ed] transition-opacity duration-500"
                            >
                                {L.label}
                            </motion.span>
                        ))}
                    </div>
                </div>

                {/* DYNAMIC TEXT */}
                <div className="h-24 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.p 
                            key={level}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="font-serif text-2xl md:text-3xl text-[#cc5500] italic"
                        >
                            "{EFFORT_LEVELS[level].text}"
                        </motion.p>
                    </AnimatePresence>
                </div>

                 <MagneticButton 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-12 text-[#f3f2ed]/50 hover:text-[#f3f2ed] text-xs uppercase tracking-[0.2em] transition-colors border-b border-transparent hover:border-[#f3f2ed]/50 pb-1"
                >
                    Find journeys that match this feeling
                </MagneticButton>
            </div>
        </section>
    );
};

// --- ACT IV: THE QUIET REALIZATION ---

const FinalDescent = ({ onGetStarted }) => {
    return (
        <section className="h-[90vh] bg-[#020202] flex flex-col items-center justify-center text-center px-6 relative">
            <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 2 }}
                className="max-w-xl z-10"
            >
                <p className="font-serif text-3xl md:text-4xl text-[#f3f2ed] mb-8 leading-relaxed">
                    You don't need to escape your life. <br/>
                    <span className="text-[#f3f2ed]/40">You need to share it with the ones who matter.</span>
                </p>

                <div className="w-[1px] h-32 bg-gradient-to-b from-[#f3f2ed]/40 to-transparent mx-auto mb-12" />

                <MagneticButton 
                    onClick={onGetStarted}
                    className="group relative px-12 py-4 overflow-hidden rounded-full bg-[#f3f2ed] text-[#050505] font-serif text-lg italic hover:bg-[#cc5500] hover:text-white transition-colors duration-500"
                >
                    <span className="relative z-10">Begin this journey</span>
                </MagneticButton>
                <p className="mt-6 text-[#f3f2ed]/20 text-[10px] tracking-[0.3em] uppercase">Together</p>
            </motion.div>

             {/* Footer Info */}
             <div className="absolute bottom-12 text-[#f3f2ed]/10 text-[10px] tracking-widest uppercase w-full text-center">
                Aether Journal © 2026
            </div>
        </section>
    );
};

// --- MAIN PAGE COMPONENT ---

const LandingPage = ({ onGetStarted }) => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[#050505] min-h-screen text-[#f3f2ed] selection:bg-[#cc5500] selection:text-white overflow-x-hidden">
            <TextureOverlay />
            <FilmGrain />
            <AtmosphereCanvas />
            
            {/* ACT I */}
            <OpeningStillness />
            <MatchCutSequence />
            
            {/* ACT II */}
            <EditorialManifesto />
            <div className="space-y-0 bg-[#0a0a0a]">
                <StoryChapter 
                    title="Mist Over Darjeeling"
                    text1="The toy train whistles through the silence."
                    text2="Tea gardens, Kanchenjunga, and conversations that last until the fog lifts."
                    img={IMAGES.nature}
                    align="right"
                />
                <StoryChapter 
                    title="Nights in Mumbai"
                    text1="Victoria Terminus glows like a palace."
                    text2="The city moves fast, but we found a moment to slow down at Marine Drive."
                    img={IMAGES.city_night}
                    align="left"
                />
                <StoryChapter 
                    title="Drifting in Kerala"
                    text1="No roads, just backwaters and palm trees."
                    text2="The only schedule we kept was the sunrise and the boatman's song."
                    img={IMAGES.road}
                    align="right"
                />
                <StoryChapter 
                    title="Bangalore Nights"
                    text1="Wet roads reflect the city lights."
                    text2="After-hours, rooftop breezes, and the weather that forgives everything."
                    img={IMAGES.bangalore}
                    align="left"
                />
                <StoryChapter 
                    title="Lost in Fontainhas"
                    text1="Yellow walls, Portuguese tiles, and afternoon naps."
                    text2="Goa isn't just a party. Sometimes it's a slow walk down a quiet lane."
                    img={IMAGES.goa}
                    align="right"
                />
                <StoryChapter 
                    title="Crossing into Coorg"
                    text1="The bridge swayed, but we didn't look back."
                    text2="Deep forests, rushing rivers, and the air that smells of rain and coffee."
                    img={IMAGES.coorg}
                    align="left"
                />
                <StoryChapter 
                    title="Kolkata Nostalgia"
                    text1="The yellow taxis never stopped, but time did."
                    text2="Chai in clay cups, Victoria Memorial sunsets, and a city that holds you close."
                    img={IMAGES.kolkata}
                    align="right"
                />
             </div>

            {/* ACT III */}
            <IntrospectionSlider />

            {/* THE NEW PHOTO WALL SECTION */}
            <PhotoWall />

            {/* ACT IV */}
            <FinalDescent onGetStarted={onGetStarted} />
        </div>
    );
};

export default LandingPage;
