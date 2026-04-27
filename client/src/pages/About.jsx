import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

    return (
        <div className='page-container relative'>
            {/* Background accents */}
            <div className='absolute top-20 right-0 w-[400px] h-[400px] bg-primary/[0.03] blur-[150px] rounded-full pointer-events-none' />
            <div className='absolute bottom-40 left-0 w-[300px] h-[300px] bg-orange-500/[0.03] blur-[150px] rounded-full pointer-events-none' />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='flex flex-col items-center text-center mb-20 relative z-10'
            >
                <Title 
                    title="Redefining Mobility" 
                    subTitle="Idle Wheels is more than a rental platform. We are a community-driven ecosystem designed to transform the way we think about vehicle ownership." 
                />
            </motion.div>

            {/* Stats Strip */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className='glass rounded-[2rem] p-10 grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 border-white/5 relative z-10'
            >
                <AnimatedCounter end={500} suffix="+" label="Premium Cars" />
                <AnimatedCounter end={50} suffix="+" label="Cities Covered" />
                <AnimatedCounter end={10} suffix="K+" label="Happy Trips" />
                <AnimatedCounter end={98} suffix="%" label="Satisfaction Rate" />
            </motion.div>

            {/* Mission Section */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center mb-32 relative z-10'>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className='relative'
                >
                    <div className='aspect-square rounded-[2.5rem] overflow-hidden premium-shadow border border-white/5 group'>
                        <img src={assets.car_image4} alt="Luxury Car" className='w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000' />
                    </div>
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className='absolute -bottom-6 -right-6 glass p-6 md:p-8 rounded-2xl max-w-[220px] border-white/10 shadow-2xl'
                    >
                        <div className='flex items-center gap-3 mb-2'>
                            <Car className='w-5 h-5 text-primary' />
                            <h3 className='text-3xl font-black'>500+</h3>
                        </div>
                        <p className='text-[10px] font-bold uppercase tracking-widest text-white/30'>Premium Fleets Listed</p>
                    </motion.div>
                </motion.div>

                <div className='space-y-10'>
                    <div className='space-y-5'>
                        <div className='flex items-center gap-3'>
                            <div className='w-8 h-[2px] bg-primary/50 rounded-full' />
                            <span className='text-[9px] font-black uppercase tracking-[0.3em] text-primary/60'>Our Vision</span>
                        </div>
                        <h2 className='text-3xl md:text-5xl font-black font-heading tracking-tighter uppercase gradient-text-animated'>Our Mission</h2>
                        <p className='text-white/40 text-base md:text-lg font-medium leading-relaxed'>
                            To democratize luxury travel by providing a secondary marketplace for high-end vehicle owners and enthusiasts. We believe every car has a story, and every journey should be legendary.
                        </p>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        {values.map((item, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className='glass p-5 rounded-2xl border-white/5 hover:border-primary/20 transition-all group cursor-default'
                            >
                                <item.icon className={`w-5 h-5 ${item.color} mb-3 group-hover:scale-110 transition-transform`} />
                                <h4 className='text-xs font-black uppercase tracking-widest text-white mb-1.5'>{item.title}</h4>
                                <p className='text-[10px] font-medium text-white/30 leading-relaxed'>{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className='glass p-10 md:p-20 rounded-[3rem] text-center border-white/5 relative overflow-hidden'
            >
                <div className='absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none' />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className='absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[200px] pointer-events-none'
                />
                <Globe className='w-10 h-10 text-primary/30 mx-auto mb-6 relative z-10' />
                <h2 className='text-3xl md:text-5xl font-black font-heading mb-4 uppercase tracking-tighter relative z-10 gradient-text-animated'>Ready to Join the Revolution?</h2>
                <p className='text-white/30 text-sm max-w-md mx-auto mb-10 relative z-10'>Start your premium journey today with our world-class fleet of curated automobiles.</p>
                <div className='flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10'>
                    <button onClick={() => { navigate('/cars'); window.scrollTo(0,0); }} className='btn-primary w-full sm:w-auto h-16 px-12'>Browse Fleet</button>
                    <button onClick={() => { navigate('/contact'); window.scrollTo(0,0); }} className='btn-secondary w-full sm:w-auto px-12 h-16'>Contact Us</button>
                </div>
            </motion.div>
        </div>
    );
};

export default About;
