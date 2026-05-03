import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Title from '../components/Title';
import { Mail, PhoneCall, MapPin, User, MessageSquare, Send, ArrowRight, CheckCircle } from 'lucide-react';
import { assets } from '../assets/assets';

const Contact = () => {
    const [focusedField, setFocusedField] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const inputClasses = "w-full bg-white/[0.02] hover:bg-white/[0.04] focus:bg-[#020617] border border-white/5 hover:border-white/10 focus:border-primary/50 rounded-2xl outline-none text-white text-sm transition-all duration-300 placeholder:text-white/15 focus:ring-4 focus:ring-primary/10";

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
    };

    return (
        <div className='page-container pt-16 pb-32 relative bg-black overflow-hidden'>
            {/* Elegant Background Accents */}
            <div className='absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.01] blur-[150px] rounded-full pointer-events-none' />

            {/* HEADER AREA */}
            <div className='mb-16 px-4'>
                <div className='flex flex-col items-start'>
                    <span className='text-[8px] font-black uppercase tracking-[0.5em] text-primary/60 mb-4'>Concierge</span>
                    <h2 className='text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4'>Get In Touch</h2>
                    <p className='text-white/30 text-[10px] md:text-xs font-medium max-w-sm leading-relaxed'>Standing by 24/7 to assist with your premium fleet requirements.</p>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 max-w-7xl mx-auto px-4 relative z-10'>
                
                {/* Precise Form Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='lg:col-span-7'
                >
                    {submitted ? (
                        <div className='glass-card p-16 rounded-[2.5rem] border border-white/5 text-center'>
                            <CheckCircle className='w-8 h-8 text-emerald-400 mx-auto mb-6' />
                            <span className='block text-lg font-black uppercase tracking-tighter text-white mb-2'>Sent</span>
                            <p className='text-white/20 text-[10px] font-medium'>Response within 24 hours.</p>
                        </div>
                    ) : (
                        <form className='space-y-8' onSubmit={handleSubmit}>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                <div className='space-y-3'>
                                    <span className={`block text-[7px] font-black uppercase tracking-[0.4em] ml-1 ${focusedField === 'name' ? 'text-primary' : 'text-white/10'}`}>Full Name</span>
                                    <input 
                                        type="text" 
                                        placeholder="John Doe" 
                                        className={`${inputClasses} h-14 px-6 font-bold text-sm`} 
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                    />
                                </div>

                                <div className='space-y-3'>
                                    <span className={`block text-[7px] font-black uppercase tracking-[0.4em] ml-1 ${focusedField === 'email' ? 'text-primary' : 'text-white/10'}`}>Email</span>
                                    <input 
                                        type="email" 
                                        placeholder="concierge@example.com" 
                                        className={`${inputClasses} h-14 px-6 font-bold text-sm`}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className='space-y-3'>
                                <span className={`block text-[7px] font-black uppercase tracking-[0.4em] ml-1 ${focusedField === 'subject' ? 'text-primary' : 'text-white/10'}`}>Subject</span>
                                <input 
                                    type="text" 
                                    placeholder="Fleet Inquiry" 
                                    className={`${inputClasses} h-14 px-6 font-bold text-sm`}
                                    onFocus={() => setFocusedField('subject')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                />
                            </div>

                            <div className='space-y-3'>
                                <span className={`block text-[7px] font-black uppercase tracking-[0.4em] ml-1 ${focusedField === 'message' ? 'text-primary' : 'text-white/10'}`}>Message</span>
                                <textarea 
                                    rows={5} 
                                    placeholder="Your requirements..." 
                                    className={`${inputClasses} p-6 resize-none font-medium text-sm leading-relaxed`}
                                    onFocus={() => setFocusedField('message')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                ></textarea>
                            </div>

                            <motion.button 
                                whileHover={{ backgroundColor: '#6366f1', color: '#fff' }}
                                type="submit" 
                                className='w-full h-16 rounded-2xl bg-white text-black font-black uppercase tracking-[0.5em] text-[9px] flex items-center justify-center gap-4 transition-all'
                            >
                                Send Transmission <ArrowRight className='w-4 h-4' />
                            </motion.button>
                        </form>
                    )}
                </motion.div>

                {/* Sleek Sidebar */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='lg:col-span-5 space-y-16'
                >
                    <div className='space-y-12'>
                        <div className='group border-b border-white/5 pb-8'>
                            <span className='block text-[7px] font-black uppercase tracking-[0.4em] text-white/20 mb-3'>Direct Line</span>
                            <span className='block text-xl font-black text-white tracking-tighter group-hover:text-primary transition-colors cursor-pointer'>+91 98765 43210</span>
                        </div>

                        <div className='group border-b border-white/5 pb-8'>
                            <span className='block text-[7px] font-black uppercase tracking-[0.4em] text-white/20 mb-3'>Concierge</span>
                            <span className='block text-xl font-black text-white tracking-tighter group-hover:text-primary transition-colors cursor-pointer uppercase'>support@idlewheels.com</span>
                        </div>
                    </div>

                    <div className='relative rounded-[2.5rem] overflow-hidden group aspect-[16/10] border border-white/5'>
                        <img src={assets.car_image1} className='absolute inset-0 w-full h-full object-cover grayscale opacity-10 group-hover:opacity-20 transition-all duration-1000' />
                        <div className='absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent' />
                        <div className='absolute bottom-8 left-8'>
                            <span className='block text-lg font-black text-white tracking-tighter uppercase mb-1'>Visakhapatnam HQ</span>
                            <span className='text-[7px] font-black uppercase tracking-[0.4em] text-primary/40'>Andhra Pradesh, India</span>
                        </div>
                    </div>

                    <div className='flex items-center gap-4'>
                        {['FB', 'TW', 'IG'].map((social, idx) => (
                            <a 
                                key={idx} href="#" 
                                className='flex-1 h-14 glass-card rounded-xl flex items-center justify-center border border-white/5 text-[8px] font-black uppercase tracking-[0.3em] text-white/10 hover:text-white transition-all'
                            >
                                {social}
                            </a>
                        ))}
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default Contact;
