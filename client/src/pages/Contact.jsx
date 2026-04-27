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
        <div className='pt-32 md:pt-40 pb-24 px-6 md:px-16 lg:px-24 xl:px-32 min-h-screen relative overflow-hidden'>
            {/* Ambient Background */}
            <div className='absolute top-20 left-0 w-[500px] h-[500px] bg-primary/[0.04] blur-[150px] pointer-events-none rounded-full' />
            <div className='absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-500/[0.03] blur-[150px] pointer-events-none rounded-full' />

            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className='text-center max-w-2xl mx-auto mb-16 relative z-10'
            >
                <Title 
                    title="Get In Touch" 
                    subTitle="Have questions? We're here to help you get behind the right wheel. Our concierge team is available 24/7." 
                />
            </motion.div>

            <div className='grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-14 max-w-[1400px] mx-auto relative z-10'>
                
                {/* Form */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className='lg:col-span-3 glass p-8 md:p-12 rounded-[2.5rem] border border-white/5 relative overflow-hidden'
                >
                    <div className='absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none' />

                    {submitted ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className='flex flex-col items-center justify-center py-20 text-center relative z-10'
                        >
                            <CheckCircle className='w-16 h-16 text-emerald-400 mb-6' />
                            <h3 className='text-2xl font-black font-heading uppercase tracking-tight mb-3'>Message Sent!</h3>
                            <p className='text-white/40 text-sm font-medium max-w-sm'>We've received your message and will get back to you within 24 hours.</p>
                        </motion.div>
                    ) : (
                        <form className='space-y-5 relative z-10' onSubmit={handleSubmit}>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                                <motion.div variants={itemVariants} className='space-y-2'>
                                    <label className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] ml-1 transition-colors ${focusedField === 'name' ? 'text-primary' : 'text-white/30'}`}>
                                        <User className='w-3 h-3' /> Full Name
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="John Doe" 
                                        className={`${inputClasses} h-14 px-5`} 
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                    />
                                </motion.div>

                                <motion.div variants={itemVariants} className='space-y-2'>
                                    <label className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] ml-1 transition-colors ${focusedField === 'email' ? 'text-primary' : 'text-white/30'}`}>
                                        <Mail className='w-3 h-3' /> Email Address
                                    </label>
                                    <input 
                                        type="email" 
                                        placeholder="john@example.com" 
                                        className={`${inputClasses} h-14 px-5`}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                    />
                                </motion.div>
                            </div>

                            <motion.div variants={itemVariants} className='space-y-2'>
                                <label className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] ml-1 transition-colors ${focusedField === 'subject' ? 'text-primary' : 'text-white/30'}`}>
                                    <MessageSquare className='w-3 h-3' /> Subject
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Inquiry about premium fleet rental" 
                                    className={`${inputClasses} h-14 px-5`}
                                    onFocus={() => setFocusedField('subject')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                />
                            </motion.div>

                            <motion.div variants={itemVariants} className='space-y-2'>
                                <label className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] ml-1 transition-colors ${focusedField === 'message' ? 'text-primary' : 'text-white/30'}`}>
                                    <MessageSquare className='w-3 h-3' /> Your Message
                                </label>
                                <textarea 
                                    rows={5} 
                                    placeholder="Tell us how we can assist you..." 
                                    className={`${inputClasses} py-4 px-5 resize-none`}
                                    onFocus={() => setFocusedField('message')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                ></textarea>
                            </motion.div>

                            <motion.button 
                                variants={itemVariants}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit" 
                                className='w-full h-16 mt-2 rounded-2xl bg-primary hover:bg-secondary text-white font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all relative overflow-hidden group shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)] border border-white/10'
                            >
                                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]'></div>
                                <span className='relative z-10'>Send Transmission</span>
                                <ArrowRight className='w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform' />
                            </motion.button>
                        </form>
                    )}
                </motion.div>

                {/* Right Side */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className='lg:col-span-2 space-y-5 flex flex-col'
                >
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5'>
                        <motion.div variants={itemVariants} className='glass p-8 rounded-[2rem] border border-white/5 hover:border-primary/20 transition-all group cursor-default'>
                            <div className='w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-primary/20'>
                                <PhoneCall className='w-5 h-5 text-primary' />
                            </div>
                            <h4 className='text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2'>VIP Direct Line</h4>
                            <p className='font-bold text-xl text-white'>+91 98765 43210</p>
                        </motion.div>

                        <motion.div variants={itemVariants} className='glass p-8 rounded-[2rem] border border-white/5 hover:border-primary/20 transition-all group cursor-default'>
                            <div className='w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-primary/20'>
                                <Mail className='w-5 h-5 text-primary' />
                            </div>
                            <h4 className='text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2'>Email Concierge</h4>
                            <p className='font-bold text-lg text-white'>support@idlewheels.com</p>
                        </motion.div>
                    </div>

                    {/* Location Card */}
                    <motion.div variants={itemVariants} className='glass p-3 rounded-[2rem] border border-white/5 flex-1 min-h-[220px] relative overflow-hidden group'>
                        <div className='absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/80 to-[#030712]/40' />
                        <div className='absolute inset-0 opacity-[0.06]'
                            style={{
                                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                                backgroundSize: '30px 30px'
                            }}
                        />
                        
                        <div className='relative w-full h-full flex flex-col items-center justify-end text-center p-8 pb-8'>
                            <motion.div 
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className='w-14 h-14 bg-primary/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-5 border border-primary/30 shadow-[0_0_30px_-5px_rgba(245,158,11,0.4)]'
                            >
                                <MapPin className='w-6 h-6 text-primary' />
                            </motion.div>
                            <h4 className='text-white font-black uppercase tracking-[0.1em] text-lg mb-1'>Visakhapatnam HQ</h4>
                            <p className='text-[11px] font-bold uppercase tracking-[0.2em] text-primary/70'>Andhra Pradesh, India</p>
                        </div>
                    </motion.div>

                    {/* Social Row */}
                    <motion.div variants={itemVariants} className='flex items-center gap-3'>
                        {[
                            { icon: assets.facebook_logo, label: 'Facebook' },
                            { icon: assets.twitter_logo, label: 'Twitter' },
                            { icon: assets.instagram_logo, label: 'Instagram' }
                        ].map((social, idx) => (
                            <motion.a 
                                whileHover={{ y: -4, scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                key={idx} 
                                href="#" 
                                title={social.label}
                                className='flex-1 h-14 glass rounded-2xl flex items-center justify-center border border-white/5 hover:border-primary/30 hover:bg-primary/10 transition-all group'
                            >
                                <img src={social.icon} alt={social.label} className='w-5 h-5 opacity-30 group-hover:opacity-100 group-hover:invert transition-all duration-300' />
                            </motion.a>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
