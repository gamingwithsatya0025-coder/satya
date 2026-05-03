import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import { useNavigate } from 'react-router-dom';
import { Shield, Cpu, Users, Heart, Award, TrendingUp, Car, Globe } from 'lucide-react';

const AnimatedCounter = ({ end, suffix = '', label }) => {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        if (!started) return;
        let start = 0;
        const duration = 2000;
        const step = Math.ceil(end / (duration / 16));
        const timer = setInterval(() => {
            start += step;
            if (start >= end) { start = end; clearInterval(timer); }
            setCount(start);
        }, 16);
        return () => clearInterval(timer);
    }, [end, started]);

    return (
        <motion.div
            onViewportEnter={() => setStarted(true)}
            viewport={{ once: true }}
            className='text-center'
        >
            <div className='text-4xl md:text-5xl font-black font-heading text-white tracking-tight'>
                {count}{suffix}
            </div>
            <div className='text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mt-2'>{label}</div>
        </motion.div>
    );
};

const About = () => {
    const navigate = useNavigate();

    const values = [
        { icon: Shield, title: 'Affordability', desc: 'Luxury experiences at a fraction of the ownership cost.', color: 'text-emerald-400' },
        { icon: Award, title: 'Reliability', desc: 'Thoroughly verified cars and trusted owners.', color: 'text-amber-400' },
        { icon: Cpu, title: 'Technology', desc: 'AI-powered matching and real-time fleet tracking.', color: 'text-amber-400' },
        { icon: Heart, title: 'Community', desc: 'Building trust through transparent reviews and ratings.', color: 'text-rose-400' }
    ];

    const { scrollY } = useScroll();
    const yParallax = useTransform(scrollY, [0, 800], [0, 200]);

    return (
        <div className='page-container pt-20 pb-40 relative bg-black overflow-hidden'>
            {/* Elegant Background Accents */}
            <div className='absolute top-0 right-0 w-[600px] h-[600px] bg-primary/[0.015] blur-[150px] rounded-full pointer-events-none' />

            {/* HERO SECTION */}
            <div className='relative w-full h-[50vh] md:h-[60vh] overflow-hidden rounded-[2.5rem] mb-32 border border-white/5 group'>
                <motion.div 
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ y: yParallax }}
                    transition={{ duration: 1.5 }}
                    className='absolute inset-0'
                >
                    <img src={assets.car_image3} alt="Hero" className='w-full h-full object-cover grayscale opacity-30 group-hover:opacity-40 transition-all duration-1000' />
                    <div className='absolute inset-0 bg-linear-to-b from-black/80 via-transparent to-black' />
                </motion.div>

                <div className='absolute inset-0 flex flex-col items-center justify-center text-center px-6'>
                    <div className='flex flex-col items-center'>
                        <span className='text-[8px] font-black uppercase tracking-[0.5em] text-primary mb-6'>Since Inception</span>
                        <h1 className='text-4xl md:text-6xl font-black tracking-tighter uppercase text-white mb-6 leading-none'>
                            Defining <span className='gradient-text-animated italic'>Excellence</span>
                        </h1>
                        <p className='text-white/30 text-[10px] md:text-xs max-w-sm mx-auto font-medium tracking-wide leading-relaxed'>
                            Bridging the gap between luxury and accessibility through a relentless pursuit of premium mobility.
                        </p>
                    </div>
                </div>
            </div>

            {/* MISSION SECTION */}
            <div className='max-w-7xl mx-auto px-4 space-y-40'>
                
                {/* Story Block */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-20 items-center'>
                    <div className='space-y-12'>
                        <div className='space-y-6'>
                            <div className='flex items-center gap-4'>
                                <span className='text-[10px] font-black uppercase tracking-[0.4em] text-white/30'>Our Purpose</span>
                                <div className='h-px flex-1 bg-white/[0.03]' />
                            </div>
                            <span className='block text-3xl md:text-5xl font-black text-white uppercase tracking-tighter'>Redefining Mobility</span>
                            <p className='text-white/20 text-sm md:text-base font-medium leading-relaxed max-w-xl'>
                                Idle Wheels is more than a rental platform. We are a community-driven ecosystem designed to transform the way we think about vehicle ownership.
                            </p>
                        </div>

                        <div className='grid grid-cols-2 gap-12 pt-8 border-t border-white/5'>
                            <div className='space-y-3'>
                                <span className='block text-[8px] font-black uppercase tracking-[0.4em] text-primary/40'>Fleet Count</span>
                                <span className='text-2xl font-black text-white uppercase tracking-tighter'>500+ Assets</span>
                            </div>
                            <div className='space-y-3'>
                                <span className='block text-[8px] font-black uppercase tracking-[0.4em] text-primary/40'>Reach</span>
                                <span className='text-2xl font-black text-white uppercase tracking-tighter'>50+ Cities</span>
                            </div>
                        </div>
                    </div>

                    <div className='relative rounded-[3rem] overflow-hidden border border-white/5 group aspect-square'>
                        <img src={assets.car_image4} alt="Luxury Car" className='w-full h-full object-cover grayscale opacity-50 group-hover:scale-105 transition-all duration-[3s]' />
                        <div className='absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-60' />
                        <div className='absolute bottom-12 left-12'>
                            <span className='block text-[8px] font-black uppercase tracking-[0.4em] text-white/40 mb-2'>Asset Verified</span>
                            <span className='text-2xl font-black text-white uppercase tracking-tighter'>Exquisite Quality</span>
                        </div>
                    </div>
                </div>

                {/* Values Grid */}
                <div className='space-y-16'>
                    <div className='flex items-center gap-6'>
                        <span className='text-[10px] font-black uppercase tracking-[0.5em] text-white/20'>Core Values</span>
                        <div className='h-px flex-1 bg-white/[0.03]' />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
                        {values.map((item, index) => (
                            <div key={index} className='group p-8 rounded-[2rem] border border-white/5 hover:border-primary/20 transition-all'>
                                <item.icon className={`w-4 h-4 ${item.color} mb-6 group-hover:scale-110 transition-transform`} />
                                <span className='block text-[10px] font-black uppercase tracking-widest text-white mb-2'>{item.title}</span>
                                <p className='text-[10px] font-medium text-white/20 leading-relaxed'>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FINAL CTA */}
                <div className='pt-20 border-t border-white/5 text-center'>
                    <span className='block text-[8px] font-black uppercase tracking-[0.5em] text-primary/60 mb-8'>Join the Evolution</span>
                    <span className='block text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-12 max-w-2xl mx-auto'>Ready to redefine your journey?</span>
                    <div className='flex flex-col sm:flex-row items-center justify-center gap-6'>
                        <button onClick={() => { navigate('/cars'); window.scrollTo(0,0); }} className='w-full sm:w-auto h-16 px-12 bg-white text-black font-black uppercase tracking-[0.4em] text-[9px] rounded-2xl'>Explore Fleet</button>
                        <button onClick={() => { navigate('/contact'); window.scrollTo(0,0); }} className='w-full sm:w-auto h-16 px-12 border border-white/5 hover:bg-white/5 text-white font-black uppercase tracking-[0.4em] text-[9px] rounded-2xl'>Contact Concierge</button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default About;
