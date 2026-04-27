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

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='px-4 py-12 md:px-10 lg:px-16 flex-1 w-full max-w-7xl mx-auto overflow-y-auto custom-scrollbar h-screen'
        >
            <div className='flex items-center justify-between mb-10'>
                <Title title="Identity Verification" subTitle="Complete your Aadhaar and document verification to unlock all features." />
            </div>
            
            <div className='mt-4'>
                <form onSubmit={handleVerify} className='glass p-10 md:p-14 rounded-[3rem] border border-white/5 premium-shadow relative overflow-hidden'>
                    {/* Background Decorative Elements */}
                    <div className='absolute -right-32 -top-32 w-80 h-80 bg-[#f59e0b]/10 rounded-full blur-[100px] pointer-events-none'></div>
                    <div className='absolute -left-32 -bottom-32 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none'></div>
                    
                    <div className='mb-12 flex flex-col items-center text-center relative z-10'>
                        <div className='w-20 h-20 bg-[#f59e0b]/20 rounded-3xl flex items-center justify-center mb-6 border border-[#f59e0b]/30 shadow-[0_0_40px_-5px_rgba(245,158,11,0.4)]'>
                            <ShieldCheck className='w-10 h-10 text-[#f59e0b]' />
                        </div>
                        <h2 className='text-3xl font-black font-heading uppercase tracking-tighter'>Secure Identity Authorization</h2>
                        <p className='text-primary text-[11px] font-black uppercase tracking-[0.3em] mt-3'>Verified Partner Protocol v2.0</p>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10'>
                        {/* Aadhaar Section */}
                        <div className='space-y-4 bg-white/[0.02] p-8 rounded-[2rem] border border-white/5'>
                            <label className='flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-2'>
                                <div className='p-1.5 bg-primary/10 rounded-lg'><CreditCard className='w-3 h-3 text-primary' /></div>
                                Aadhaar Identification
                            </label>
                            <input 
                                type='text' 
                                required 
                                maxLength="12" 
                                onChange={(e) => setAadhaarNumber(e.target.value)} 
                                value={aadhaarNumber} 
                                className='w-full h-16 bg-zinc-950/40 border border-white/10 px-6 rounded-2xl font-black tracking-[0.3em] outline-none focus:border-primary/50 text-white transition-all placeholder:text-white/10 text-lg' 
                                placeholder='0000 0000 0000' 
                            />
                            <div className='w-full h-16 bg-zinc-950/40 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group overflow-hidden relative'>
                                <input type='file' className='hidden' id='aadhaar-upload' />
                                <label htmlFor='aadhaar-upload' className='flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 cursor-pointer w-full h-full justify-center group-hover:text-primary transition-colors relative z-10'>
                                    <Upload className='w-4 h-4' /> Upload Aadhaar PDF/Image
                                </label>
                            </div>
                        </div>

                        {/* PAN Section */}
                        <div className='space-y-4 bg-white/[0.02] p-8 rounded-[2rem] border border-white/5'>
                            <label className='flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-2'>
                                <div className='p-1.5 bg-primary/10 rounded-lg'><FileText className='w-3 h-3 text-primary' /></div>
                                Permanent Account Number (PAN)
                            </label>
                            <input 
                                type='text' 
                                required 
                                maxLength="10" 
                                onChange={(e) => setPanNumber(e.target.value)} 
                                value={panNumber} 
                                className='w-full h-16 bg-zinc-950/40 border border-white/10 px-6 rounded-2xl font-black tracking-[0.3em] outline-none focus:border-primary/50 text-white transition-all placeholder:text-white/10 uppercase text-lg' 
                                placeholder='ABCDE1234F' 
                            />
                            <div className='w-full h-16 bg-zinc-950/40 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group overflow-hidden relative'>
                                <input type='file' className='hidden' id='pan-upload' />
                                <label htmlFor='pan-upload' className='flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 cursor-pointer w-full h-full justify-center group-hover:text-primary transition-colors relative z-10'>
                                    <Upload className='w-4 h-4' /> Upload PAN Card Image
                                </label>
                            </div>
                        </div>

                        {/* DL Section - Full Width on Desktop */}
                        <div className='lg:col-span-2 space-y-4 bg-white/[0.02] p-8 rounded-[2rem] border border-white/5'>
                            <label className='flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-2'>
                                <div className='p-1.5 bg-primary/10 rounded-lg'><ShieldCheck className='w-3 h-3 text-primary' /></div>
                                Driving Licence Credentials
                            </label>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <input 
                                    type='text' 
                                    required 
                                    maxLength="16" 
                                    onChange={(e) => setDrivingLicenceNumber(e.target.value)} 
                                    value={drivingLicenceNumber} 
                                    className='w-full h-16 bg-zinc-950/40 border border-white/10 px-6 rounded-2xl font-black tracking-[0.3em] outline-none focus:border-primary/50 text-white transition-all placeholder:text-white/10 uppercase text-lg' 
                                    placeholder='DL-00000000000' 
                                />
                                <div className='w-full h-16 bg-zinc-950/40 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group overflow-hidden relative'>
                                    <input type='file' className='hidden' id='dl-upload' />
                                    <label htmlFor='dl-upload' className='flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 cursor-pointer w-full h-full justify-center group-hover:text-primary transition-colors relative z-10'>
                                        <Upload className='w-4 h-4' /> Upload Licence Copy
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='mt-16 relative z-10'>
                        <button 
                            disabled={verifying} 
                            type='submit' 
                            className='w-full h-20 bg-primary hover:bg-[#ea580c] text-white font-black uppercase tracking-[0.3em] text-xs rounded-[2rem] flex items-center justify-center gap-4 transition-all shadow-[0_20px_50px_-10px_rgba(245,158,11,0.5)] border border-[#fde68a]/20 relative overflow-hidden group'
                        >
                            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]'></div>
                            <span className='relative z-10 flex items-center gap-4'>
                                {verifying ? (
                                    <>
                                        <Loader2 className='w-6 h-6 animate-spin' />
                                        AUTHENTICATING SECURELY...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className='w-6 h-6' />
                                        AUTHORIZE & COMPLETE VERIFICATION
                                    </>
                                )}
                            </span>
                        </button>
                        <p className='text-center text-[9px] font-bold uppercase tracking-[0.2em] text-white/20 mt-8 max-w-lg mx-auto leading-relaxed'>
                            Identity verification is processed through encrypted channels. Data is not stored on our primary servers for enhanced privacy.
                        </p>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default VerifyIdentity;
