import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Title from '../../components/owner/Title';
import { ShieldCheck, CreditCard, FileText, Upload, Loader2, CheckCircle } from 'lucide-react';
import { assets } from '../../assets/assets';

const VerifyIdentity = () => {
    const { userData, backendUrl, token, setUserData } = useAppContext();
    const navigate = useNavigate();
    
    const [verifying, setVerifying] = useState(false);
    const [aadhaarNumber, setAadhaarNumber] = useState('');
    const [panNumber, setPanNumber] = useState('');
    const [drivingLicenceNumber, setDrivingLicenceNumber] = useState('');

    const handleVerify = async (e) => {
        e.preventDefault();
        setVerifying(true);
        try {
            const dummyImage = "https://placeholder.com/doc.png";
            const response = await axios.post(`${backendUrl}/api/user/verify-request`, {
                userId: userData.id,
                aadhaarNumber,
                aadhaarImage: dummyImage,
                panNumber,
                panImage: dummyImage,
                drivingLicenceNumber,
                drivingLicenceImage: dummyImage
            }, { headers: { token } });

            if (response.data.success) {
                const updatedUser = { ...userData, verificationStatus: 'approved' };
                setUserData(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                alert("Identity Verified Successfully!");
                navigate('/owner');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Error during verification.");
        }
        setVerifying(false);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { 
            opacity: 1, 
            y: 0, 
            transition: { 
                duration: 0.8, 
                ease: [0.22, 1, 0.36, 1] 
            } 
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='px-4 py-12 md:px-10 lg:px-16 flex-1 w-full max-w-7xl mx-auto overflow-y-auto custom-scrollbar h-screen bg-[#030303]'
        >
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className='flex items-center justify-between mb-12'
            >
                <Title title="Identity Verification" subTitle="Complete your Aadhaar and document verification to unlock all features." />
            </motion.div>
            
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className='mt-4'
            >
                <motion.form 
                    onSubmit={handleVerify} 
                    className='glass p-10 md:p-14 lg:p-20 rounded-[4rem] border border-white/5 premium-shadow relative overflow-hidden'
                >
                    {/* Background Decorative Elements */}
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.1, 1],
                            opacity: [0.1, 0.15, 0.1]
                        }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className='absolute -right-32 -top-32 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none'
                    />
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.05, 0.1, 0.05]
                        }}
                        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                        className='absolute -left-32 -bottom-32 w-96 h-96 bg-accent-warm/10 rounded-full blur-[120px] pointer-events-none'
                    />
                    
                    <motion.div variants={itemVariants} className='mb-16 flex flex-col items-center text-center relative z-10'>
                        <div className='relative group'>
                            <div className='absolute inset-0 bg-accent-warm/20 blur-2xl rounded-full scale-150 group-hover:scale-[2] transition-transform duration-700' />
                            <div className='w-24 h-24 bg-zinc-950 border border-white/10 rounded-[2rem] flex items-center justify-center mb-8 relative z-10 shadow-2xl group-hover:border-accent-warm/50 transition-colors duration-500'>
                                <ShieldCheck className='w-12 h-12 text-accent-warm' />
                            </div>
                        </div>
                        <h2 className='text-3xl md:text-5xl font-black font-heading uppercase tracking-tighter leading-none'>
                            Secure Identity <span className='text-accent-warm italic'>Authorization</span>
                        </h2>
                        <div className='flex items-center gap-3 mt-5'>
                            <div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
                            <p className='text-white/30 text-[10px] font-black uppercase tracking-[0.4em]'>Verified Partner Protocol v2.0</p>
                        </div>
                    </motion.div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative z-10'>
                        {/* Aadhaar Section */}
                        <motion.div variants={itemVariants} className='space-y-6 bg-white/[0.01] p-10 rounded-[3rem] border border-white/5 hover:border-primary/20 transition-all duration-500 group'>
                            <label className='flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-2'>
                                <div className='p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors'><CreditCard className='w-4 h-4 text-primary' /></div>
                                Aadhaar Identification
                            </label>
                            <input 
                                type='text' 
                                required 
                                maxLength="12" 
                                onChange={(e) => setAadhaarNumber(e.target.value)} 
                                value={aadhaarNumber} 
                                className='w-full h-18 bg-zinc-950/60 border border-white/10 px-8 rounded-2xl font-black tracking-[0.4em] outline-none focus:border-primary text-white transition-all placeholder:text-white/5 text-xl' 
                                placeholder='0000 0000 0000' 
                            />
                            <div className='w-full h-18 bg-zinc-950/40 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group/upload overflow-hidden relative'>
                                <input type='file' className='hidden' id='aadhaar-upload' />
                                <label htmlFor='aadhaar-upload' className='flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.25em] text-white/30 cursor-pointer w-full h-full justify-center group-hover/upload:text-white transition-colors relative z-10'>
                                    <Upload className='w-5 h-5' /> Upload Document Image
                                </label>
                            </div>
                        </motion.div>

                        {/* PAN Section */}
                        <motion.div variants={itemVariants} className='space-y-6 bg-white/[0.01] p-10 rounded-[3rem] border border-white/5 hover:border-primary/20 transition-all duration-500 group'>
                            <label className='flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-2'>
                                <div className='p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors'><FileText className='w-4 h-4 text-primary' /></div>
                                Permanent Account Number
                            </label>
                            <input 
                                type='text' 
                                required 
                                maxLength="10" 
                                onChange={(e) => setPanNumber(e.target.value)} 
                                value={panNumber} 
                                className='w-full h-18 bg-zinc-950/60 border border-white/10 px-8 rounded-2xl font-black tracking-[0.4em] outline-none focus:border-primary text-white transition-all placeholder:text-white/5 uppercase text-xl' 
                                placeholder='ABCDE1234F' 
                            />
                            <div className='w-full h-18 bg-zinc-950/40 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group/upload overflow-hidden relative'>
                                <input type='file' className='hidden' id='pan-upload' />
                                <label htmlFor='pan-upload' className='flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.25em] text-white/30 cursor-pointer w-full h-full justify-center group-hover/upload:text-white transition-colors relative z-10'>
                                    <Upload className='w-5 h-5' /> Upload PAN Copy
                                </label>
                            </div>
                        </motion.div>

                        {/* DL Section - Full Width on Desktop */}
                        <motion.div variants={itemVariants} className='lg:col-span-2 space-y-6 bg-white/[0.01] p-10 rounded-[3rem] border border-white/5 hover:border-primary/20 transition-all duration-500 group'>
                            <label className='flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-2'>
                                <div className='p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors'><ShieldCheck className='w-4 h-4 text-primary' /></div>
                                Driving Licence Credentials
                            </label>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                <input 
                                    type='text' 
                                    required 
                                    maxLength="16" 
                                    onChange={(e) => setDrivingLicenceNumber(e.target.value)} 
                                    value={drivingLicenceNumber} 
                                    className='w-full h-18 bg-zinc-950/60 border border-white/10 px-8 rounded-2xl font-black tracking-[0.4em] outline-none focus:border-primary text-white transition-all placeholder:text-white/5 uppercase text-xl' 
                                    placeholder='DL-00000000000' 
                                />
                                <div className='w-full h-18 bg-zinc-950/40 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group/upload overflow-hidden relative'>
                                    <input type='file' className='hidden' id='dl-upload' />
                                    <label htmlFor='dl-upload' className='flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.25em] text-white/30 cursor-pointer w-full h-full justify-center group-hover/upload:text-white transition-colors relative z-10'>
                                        <Upload className='w-5 h-5' /> Upload Licence Copy
                                    </label>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div variants={itemVariants} className='mt-20 relative z-10'>
                        <button 
                            disabled={verifying} 
                            type='submit' 
                            className='w-full h-24 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.4em] text-sm rounded-[2.5rem] flex items-center justify-center gap-6 transition-all shadow-[0_30px_60px_-10px_rgba(99,102,241,0.4)] border border-white/20 relative overflow-hidden group/btn'
                        >
                            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite] pointer-events-none'></div>
                            <span className='relative z-10 flex items-center gap-5'>
                                {verifying ? (
                                    <>
                                        <Loader2 className='w-8 h-8 animate-spin' />
                                        AUTHENTICATING...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className='w-8 h-8' />
                                        AUTHORIZE & COMPLETE VERIFICATION
                                    </>
                                )}
                            </span>
                        </button>
                        <p className='text-center text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mt-10 max-w-lg mx-auto leading-relaxed'>
                            Identity verification is processed through encrypted channels. Data is not stored on our primary servers for enhanced privacy.
                        </p>
                    </motion.div>
                </motion.form>
            </motion.div>
        </motion.div>
    );
};

export default VerifyIdentity;
