import React, { useState, useEffect } from 'react';
import { assets, cityList } from '../assets/assets';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Search, Shield, Star, Zap, ChevronRight } from 'lucide-react';

const ElegantShape = ({ className, delay = 0, width = 400, height = 100, rotate = 0, gradient = "from-white/[0.08]" }) => (
    <motion.div
        initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
        animate={{ opacity: 1, y: 0, rotate: rotate }}
        transition={{ duration: 2.4, delay, ease: [0.23, 0.86, 0.39, 0.96] }}
        className={`absolute ${className}`}
    >
        <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            style={{ width, height }}
            className="relative"
        >
            <div className={`absolute inset-0 rounded-full bg-gradient-to-r to-transparent ${gradient} backdrop-blur-[2px] border-2 border-white/[0.1] shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] after:absolute after:inset-0 after:rounded-full after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]`} />
        </motion.div>
    </motion.div>
);

const Hero = () => {
    const [pickupLocation, setPickupLocation] = useState('');
    const navigate = useNavigate();

    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.2 + i * 0.1,
                ease: [0.25, 0.4, 0.25, 1]
            },
        }),
    };

    return (
        <section className='relative min-h-[100vh] lg:min-h-[110vh] flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-[#030303]'>
            {/* Geometric Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <ElegantShape delay={0.3} width={600} height={140} rotate={12} gradient="from-primary/[0.15]" className="left-[-10%] top-[15%]" />
                <ElegantShape delay={0.5} width={500} height={120} rotate={-15} gradient="from-orange-500/[0.1]" className="right-[-5%] top-[60%]" />
                <ElegantShape delay={0.4} width={300} height={80} rotate={-8} gradient="from-primary/[0.1]" className="left-[5%] bottom-[15%]" />
            </div>

            <div className='relative z-10 w-full max-w-[1440px] px-6 md:px-16 lg:px-24 flex flex-col lg:grid lg:grid-cols-2 gap-12 items-center'>
                {/* Left Content */}
                <div className='text-center lg:text-left space-y-8 max-w-2xl'>
                    <motion.div custom={0} variants={fadeUpVariants} initial="hidden" animate="visible" className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-4">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">The Platinum Collection 2024</span>
                    </motion.div>

                    <motion.h1 custom={1} variants={fadeUpVariants} initial="hidden" animate="visible" className='text-5xl sm:text-7xl md:text-8xl font-black font-heading tracking-tighter uppercase leading-[0.85] gsap-reveal'>
                        Master <br />
                        <span className='gradient-text-animated italic'>The Road</span>
                    </motion.h1>

                    <motion.p custom={2} variants={fadeUpVariants} initial="hidden" animate="visible" className='text-base md:text-xl text-white/40 font-medium leading-relaxed max-w-xl gsap-reveal'>
                        Elite performance meets unparalleled luxury. Embark on a distinguished journey with our curated fleet of world-class automobiles.
                    </motion.p>

                    <motion.div custom={3} variants={fadeUpVariants} initial="hidden" animate="visible" className='flex flex-wrap items-center justify-center lg:justify-start gap-8'>
                        {[
                            { label: 'Vehicles', value: '500+' },
                            { label: 'Locations', value: '50+' },
                            { label: 'Rating', value: '4.9/5' }
                        ].map((stat, i) => (
                            <div key={i} className='space-y-1'>
                                <div className='text-2xl font-black text-white'>{stat.value}</div>
                                <div className='text-[8px] font-black uppercase tracking-widest text-white/20'>{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Right Image Content */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8, x: 50 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                    className='relative w-full aspect-square lg:aspect-auto flex items-center justify-center'
                >
                    {/* Stylized background glow */}
                    <div className='absolute inset-0 bg-primary/10 blur-[120px] rounded-full scale-75 animate-pulse' />
                    
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className='relative z-10 w-full'
                        style={{
                            maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
                            WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)'
                        }}
                    >
                        <img 
                            src={assets.car_image1} 
                            alt="Luxury Car" 
                            className='w-full h-auto object-contain drop-shadow-[0_50px_100px_rgba(99,102,241,0.3)] scale-110 mix-blend-lighten' 
                        />
                        {/* Shadow mask */}
                        <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-12 bg-black/40 blur-2xl rounded-[100%]' />
                    </motion.div>


                </motion.div>
            </div>

            {/* Floating Horizontal Search Bar */}
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.2 }}
                className='relative z-20 w-full max-w-6xl px-6 -mt-16'
            >
                <form 
                    onSubmit={(e) => { e.preventDefault(); navigate('/cars'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className='glass-card p-4 rounded-[3rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] flex flex-col lg:flex-row items-center gap-4'
                >
                    <div className='flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full'>
                        {[
                            { icon: MapPin, label: 'Deployment Hub', element: (
                                <select 
                                    required 
                                    value={pickupLocation} 
                                    onChange={(e) => setPickupLocation(e.target.value)} 
                                    className="w-full bg-transparent font-black text-xs outline-none appearance-none text-white cursor-pointer uppercase tracking-[0.1em]"
                                >
                                    <option value="" className='bg-zinc-950'>Select Hub</option>
                                    {cityList.map((city) => (
                                        <option key={city} value={city} className='bg-zinc-950'>{city}</option>
                                    ))}
                                </select>
                            )},
                            { icon: Calendar, label: 'Mission Start', element: <input type='date' className='w-full bg-transparent font-black text-xs outline-none text-white inverted-date-picker' required /> },
                            { icon: Zap, label: 'Performance Tier', element: (
                                <select className="w-full bg-transparent font-black text-xs outline-none appearance-none text-white cursor-pointer uppercase tracking-[0.1em]">
                                    <option className='bg-zinc-950'>Hypercar</option>
                                    <option className='bg-zinc-950'>Luxury Sedan</option>
                                    <option className='bg-zinc-950'>Performance SUV</option>
                                </select>
                            )}
                        ].map((item, i) => (
                            <div key={i} className='group/item px-8 py-5 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all flex items-center gap-4 relative overflow-hidden'>
                                <div className='absolute inset-0 bg-primary/[0.02] opacity-0 group-hover/item:opacity-100 transition-opacity' />
                                <div className='w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover/item:scale-110 transition-transform'>
                                    <item.icon className='w-5 h-5 text-primary' />
                                </div>
                                <div className='flex-1 relative z-10'>
                                    <p className='text-[8px] font-black uppercase tracking-[0.3em] text-white/20 mb-1'>{item.label}</p>
                                    {item.element}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <button 
                        type="submit"
                        className='w-full lg:w-auto h-20 lg:px-12 rounded-[2.5rem] bg-primary hover:bg-secondary text-white font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-4 transition-all relative overflow-hidden group shadow-2xl border border-white/10'
                    >
                        <div className='absolute inset-0 bg-linear-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]'></div>
                        <Search className='w-5 h-5 group-hover:scale-110 transition-transform' />
                        <span>Search Transmission</span>
                    </button>
                </form>
            </motion.div>
        </section>
    );
};

export default Hero;
