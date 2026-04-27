import React from 'react';
import { motion } from 'framer-motion';
import { Car, CalendarCheck, Rocket } from 'lucide-react';

const steps = [
    {
        icon: Car,
        number: '01',
        title: 'Choose Your Ride',
        description: 'Browse our curated collection of premium vehicles. Filter by brand, location, and availability to find your perfect match.',
        gradient: 'from-amber-500/20 to-orange-500/20',
        iconColor: 'text-amber-400',
    },
    {
        icon: CalendarCheck,
        number: '02',
        title: 'Book Instantly',
        description: 'Select your dates, confirm your pickup location, and lock in your reservation in under 60 seconds. No hidden fees.',
        gradient: 'from-orange-500/20 to-amber-600/20',
        iconColor: 'text-orange-400',
    },
    {
        icon: Rocket,
        number: '03',
        title: 'Hit The Road',
        description: 'Pick up your vehicle from the designated hub and start your journey. Real-time support available 24/7 during your trip.',
        gradient: 'from-amber-600/20 to-amber-500/20',
        iconColor: 'text-amber-500',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const HowItWorks = () => {
    return (
        <section className='section-spacing px-6 md:px-16 lg:px-24 xl:px-32 bg-background relative overflow-hidden'>
            {/* Background accents */}
            <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/[0.03] blur-[150px] rounded-full pointer-events-none' />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className='text-center mb-20'
            >
                <div className='flex items-center justify-center gap-3 mb-4'>
                    <div className='w-8 h-[2px] bg-primary/50 rounded-full' />
                    <span className='text-[9px] font-black uppercase tracking-[0.3em] text-primary/60'>Simple Process</span>
                    <div className='w-8 h-[2px] bg-primary/50 rounded-full' />
                </div>
                <h2 className='text-3xl md:text-5xl font-black font-heading tracking-tighter uppercase gradient-text-animated mb-4'>
                    How It Works
                </h2>
                <p className='text-white/40 text-sm md:text-base font-medium max-w-lg mx-auto'>
                    Three simple steps to get behind the wheel of your dream car.
                </p>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className='grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto relative'
            >
                {/* Connecting line */}
                <div className='hidden md:block absolute top-[60px] left-[16%] right-[16%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0' />

                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        className='relative group'
                    >
                        <div className={`relative glass p-8 md:p-10 rounded-[2.5rem] border border-white/5 hover:border-primary/20 transition-all duration-500 overflow-hidden h-full`}>
                            {/* Gradient background on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                            
                            {/* Step number + icon */}
                            <div className='relative z-10 flex items-center justify-between mb-8'>
                                <div className='w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-primary/30 transition-all duration-500'>
                                    <step.icon className={`w-7 h-7 ${step.iconColor}`} strokeWidth={1.5} />
                                </div>
                                <span className='text-6xl font-black text-white/[0.03] font-heading group-hover:text-white/[0.07] transition-colors'>{step.number}</span>
                            </div>

                            {/* Content */}
                            <div className='relative z-10'>
                                <h3 className='text-xl font-black font-heading uppercase tracking-tight mb-3 text-white group-hover:text-primary transition-colors'>
                                    {step.title}
                                </h3>
                                <p className='text-white/40 text-sm leading-relaxed font-medium'>
                                    {step.description}
                                </p>
                            </div>

                            {/* Bottom accent line */}
                            <div className='absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700' />
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default HowItWorks;
