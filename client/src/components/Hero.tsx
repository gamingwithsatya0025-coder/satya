import React, { useState, useEffect } from 'react';
import { assets, cityList } from '../assets/assets';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Search, Shield, Star, Zap } from 'lucide-react';

const AnimatedCounter = ({ end, label, suffix = '' }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const duration = 2000;
        const step = Math.ceil(end / (duration / 16));
        const timer = setInterval(() => {
            start += step;
            if (start >= end) { start = end; clearInterval(timer); }
            setCount(start);
        }, 16);
        return () => clearInterval(timer);
    }, [end]);
    return (
        <div className='text-center'>
            <div className='text-3xl md:text-4xl font-black font-heading text-white tracking-tight'>
                {count}{suffix}
            </div>
            <div className='text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mt-1'>{label}</div>
        </div>
    );
};

const Hero = () => {
    const [pickupLocation, setPickupLocation] = useState('');
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <section className='relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 overflow-hidden bg-background'>
            {/* Animated Background Mesh */}
            <div className='absolute inset-0 pointer-events-none'>
                {/* Primary gradient orb */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className='absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-amber-500 rounded-full blur-[150px]'
                />
                {/* Secondary orb */}
                <motion.div
                    animate={{ scale: [1.1, 1, 1.1], opacity: [0.05, 0.1, 0.05] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className='absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-orange-500 rounded-full blur-[150px]'
                />
                {/* Tertiary orb */}
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.03, 0.08, 0.03] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                    className='absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600 rounded-full blur-[200px]'
                />
                {/* Grid pattern overlay */}
                <div className='absolute inset-0 opacity-[0.02]'
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px'
                    }}
                />
                {/* Radial vignette */}
                <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_70%)]' />
            </div>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className='relative z-10 w-full max-w-7xl px-6 md:px-16 flex flex-col items-center text-center'
            >
                {/* Premium Badge */}
                <motion.div variants={itemVariants} className='mb-8'>
                    <div className='inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm'>
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className='w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                        />
                        <span className='text-[10px] font-bold uppercase tracking-[0.25em] text-white/50'>
                            Premium Car Rental Experience
                        </span>
                        <div className='w-px h-3 bg-white/10' />
                        <div className='flex items-center gap-1'>
                            <Star className='w-3 h-3 text-amber-400 fill-amber-400' />
                            <span className='text-[10px] font-bold text-white/50'>4.9</span>
                        </div>
                    </div>
                </motion.div>

                {/* Main Headline */}
                <motion.h1 
                    variants={itemVariants} 
                    className='text-5xl sm:text-6xl md:text-8xl font-black font-heading mb-6 tracking-tight uppercase leading-[0.95]'
                >
                    Redefine Your <br />
                    <span className='gradient-text-animated italic'>Journey</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p 
                    variants={itemVariants} 
                    className='text-base md:text-lg text-white/35 mb-14 max-w-xl font-medium leading-relaxed'
                >
                    Experience the pinnacle of luxury and performance. Discover our curated fleet of world-class automobiles.
                </motion.p>

                {/* Search Widget */}
                <motion.form 
                    variants={itemVariants}
                    onSubmit={(e) => { e.preventDefault(); navigate('/cars'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className='w-full max-w-4xl relative'
                >
                    {/* Glow behind form */}
                    <div className='absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 rounded-[1.8rem] blur-xl opacity-50' />
                    
                    <div className='relative glass p-2 rounded-[1.5rem] shadow-2xl border-white/[0.08] flex flex-col lg:flex-row items-center gap-2'>
                        <div className='flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 w-full'>
                            <div className='h-16 rounded-xl flex items-center gap-3 px-5 bg-white/[0.03] hover:bg-white/[0.06] transition-all group'>
                                <MapPin className='w-4 h-4 text-primary/60 group-hover:text-primary transition-colors' />
                                <div className='flex-1'>
                                    <label className='text-[8px] font-black uppercase tracking-widest text-primary/60 block mb-0.5'>Location</label>
                                    <select 
                                        required 
                                        value={pickupLocation} 
                                        onChange={(e) => setPickupLocation(e.target.value)} 
                                        className="w-full bg-transparent font-bold text-xs outline-none appearance-none text-white cursor-pointer"
                                    >
                                        <option value="" className='bg-zinc-950'>Select Port</option>
                                        {cityList.map((city) => (
                                            <option key={city} value={city} className='bg-zinc-950'>{city}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className='h-16 rounded-xl flex items-center gap-3 px-5 bg-white/[0.03] hover:bg-white/[0.06] transition-all group'>
                                <Calendar className='w-4 h-4 text-primary/60 group-hover:text-primary transition-colors' />
                                <div className='flex-1'>
                                    <label className='text-[8px] font-black uppercase tracking-widest text-primary/60 block mb-0.5'>From Date</label>
                                    <input type='date' className='w-full bg-transparent font-bold text-xs outline-none text-white inverted-date-picker' required />
                                </div>
                            </div>

                            <div className='h-16 rounded-xl flex items-center gap-3 px-5 bg-white/[0.03] hover:bg-white/[0.06] transition-all group'>
                                <Calendar className='w-4 h-4 text-primary/60 group-hover:text-primary transition-colors' />
                                <div className='flex-1'>
                                    <label className='text-[8px] font-black uppercase tracking-widest text-primary/60 block mb-0.5'>Return Date</label>
                                    <input type='date' className='w-full bg-transparent font-bold text-xs outline-none text-white inverted-date-picker' required />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className='btn-primary h-16 w-full lg:w-auto px-10 rounded-xl flex items-center justify-center gap-3'>
                            <Search className='w-4 h-4' />
                            <span className='whitespace-nowrap'>Find My Ride</span>
                        </button>
                    </div>
                </motion.form>

                {/* Trust Signals */}
                <motion.div 
                    variants={itemVariants}
                    className='flex flex-wrap items-center justify-center gap-6 md:gap-8 mt-10'
                >
                    {[
                        { icon: Shield, text: 'Fully Insured' },
                        { icon: Zap, text: 'Instant Booking' },
                        { icon: Star, text: '24/7 Support' },
                    ].map((item, i) => (
                        <div key={i} className='flex items-center gap-2 text-white/25'>
                            <item.icon className='w-3.5 h-3.5 text-primary/50' />
                            <span className='text-[10px] font-bold uppercase tracking-widest'>{item.text}</span>
                        </div>
                    ))}
                </motion.div>

                {/* Car Image */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full max-w-4xl mt-16"
                >
                    <motion.img 
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        src={assets.main_car} 
                        alt="Premium Luxury Car" 
                        className='w-full object-contain filter drop-shadow-[0_40px_80px_rgba(245,158,11,0.15)] scale-110' 
                    />
                    {/* Reflection glow */}
                    <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-16 bg-primary/10 blur-[50px] rounded-[100%]' />
                </motion.div>

                {/* Stats Counter Strip */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className='w-full max-w-3xl glass rounded-2xl p-8 mt-8 grid grid-cols-3 gap-8 border-white/5'
                >
                    <AnimatedCounter end={500} suffix="+" label="Premium Cars" />
                    <AnimatedCounter end={50} suffix="+" label="Cities Covered" />
                    <AnimatedCounter end={10} suffix="K+" label="Happy Trips" />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
