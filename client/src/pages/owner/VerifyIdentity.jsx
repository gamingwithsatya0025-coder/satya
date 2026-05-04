import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Title from '../../components/owner/Title';
import { ShieldCheck, CreditCard, FileText, Upload, Loader2, CheckCircle, Fingerprint, Lock, ShieldAlert, Sparkles, X } from 'lucide-react';
import { assets } from '../../assets/assets';

const VerifyIdentity = () => {
    const { userData, backendUrl, token, setUserData } = useAppContext();
    const navigate = useNavigate();
    
    const [verifying, setVerifying] = useState(false);
    const [aadhaarNumber, setAadhaarNumber] = useState('');
    const [panNumber, setPanNumber] = useState('');
    const [drivingLicenceNumber, setDrivingLicenceNumber] = useState('');

    const [aadhaarFile, setAadhaarFile] = useState(null);
    const [panFile, setPanFile] = useState(null);
    const [dlFile, setDlFile] = useState(null);

    const [aadhaarPreview, setAadhaarPreview] = useState(null);
    const [panPreview, setPanPreview] = useState(null);
    const [dlPreview, setDlPreview] = useState(null);

    const handleFileChange = (e, setter, previewSetter) => {
        const file = e.target.files[0];
        if (file) {
            setter(file);
            previewSetter(URL.createObjectURL(file));
        }
    };

    const uploadFile = async (file) => {
        if (!file) return null;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await axios.post(`${backendUrl}/api/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', token }
            });
            return res.data.success ? res.data.fileUrl : null;
        } catch (error) {
            console.error("Upload error:", error);
            return null;
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setVerifying(true);
        try {
            // Upload images first
            const aadhaarImageUrl = await uploadFile(aadhaarFile);
            const panImageUrl = await uploadFile(panFile);
            const dlImageUrl = await uploadFile(dlFile);

            if (!aadhaarImageUrl || !panImageUrl || !dlImageUrl) {
                alert("Please upload all required documents.");
                setVerifying(false);
                return;
            }

            const response = await axios.post(`${backendUrl}/api/user/verify-request`, {
                userId: userData.id,
                aadhaarNumber,
                aadhaarImage: aadhaarImageUrl,
                panNumber,
                panImage: panImageUrl,
                drivingLicenceNumber,
                drivingLicenceImage: dlImageUrl
            }, { headers: { token } });

            if (response.data.success) {
                const updatedUser = { ...userData, verificationStatus: 'pending' };
                setUserData(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                alert("Identity Submitted Successfully! Awaiting approval.");
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

    const cardClasses = "glass p-8 rounded-[2.5rem] border border-white/5 hover:border-primary/20 transition-all duration-500 group relative overflow-hidden";
    const inputClasses = "w-full h-16 bg-black/40 border border-white/10 px-6 rounded-2xl font-black tracking-[0.2em] outline-none focus:border-primary text-white transition-all placeholder:text-white/10 text-lg mb-4";
    const uploadAreaClasses = "w-full h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all relative overflow-hidden";

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='px-4 py-12 md:px-10 lg:px-16 flex-1 w-full max-w-7xl mx-auto overflow-y-auto custom-scrollbar h-screen bg-[#030303] pb-32'
        >
            <div className='flex flex-col md:flex-row items-center justify-between mb-16 gap-8'>
                <Title title="Identity Hub" subTitle="Securely authorize your identity to start listing vehicles." />
                
                <div className='flex items-center gap-4 glass px-6 py-4 rounded-3xl border-emerald-500/20'>
                    <div className='w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center'>
                        <Lock className='w-6 h-6 text-emerald-500' />
                    </div>
                    <div>
                        <p className='text-[10px] font-black uppercase tracking-widest text-emerald-500'>End-to-End Encrypted</p>
                        <p className='text-[8px] font-bold text-white/40 uppercase tracking-widest'>Your data is protected by IdleWheels Shield</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleVerify} className='space-y-8'>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Aadhaar Card */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={cardClasses}>
                        <div className='absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity'>
                            <Fingerprint className='w-20 h-20' />
                        </div>
                        <div className='relative z-10'>
                            <div className='flex items-center gap-3 mb-8'>
                                <div className='w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20'>
                                    <CreditCard className='w-5 h-5 text-primary' />
                                </div>
                                <h3 className='text-xl font-black uppercase tracking-tighter'>Aadhaar ID</h3>
                            </div>
                            
                            <input 
                                type='text' 
                                required 
                                pattern="^\d{12}$"
                                title="Aadhaar must be 12 digits"
                                onChange={(e) => setAadhaarNumber(e.target.value)} 
                                value={aadhaarNumber} 
                                className={inputClasses} 
                                placeholder='0000 0000 0000' 
                            />

                            <div className={uploadAreaClasses}>
                                <input type='file' className='hidden' id='aadhaar-upload' accept="image/*" onChange={(e) => handleFileChange(e, setAadhaarFile, setAadhaarPreview)} />
                                {aadhaarPreview ? (
                                    <div className='absolute inset-0 group/preview'>
                                        <img src={aadhaarPreview} className='w-full h-full object-cover' alt="" />
                                        <div className='absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 flex items-center justify-center transition-all'>
                                            <p className='text-[10px] font-black uppercase tracking-widest text-white'>Change Image</p>
                                        </div>
                                    </div>
                                ) : (
                                    <label htmlFor='aadhaar-upload' className='flex flex-col items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 cursor-pointer'>
                                        <Upload className='w-6 h-6 mb-1' />
                                        Upload Document
                                    </label>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* PAN Card */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={cardClasses}>
                         <div className='absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity'>
                            <FileText className='w-20 h-20' />
                        </div>
                        <div className='relative z-10'>
                            <div className='flex items-center gap-3 mb-8'>
                                <div className='w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20'>
                                    <Sparkles className='w-5 h-5 text-amber-500' />
                                </div>
                                <h3 className='text-xl font-black uppercase tracking-tighter'>PAN Number</h3>
                            </div>
                            
                            <input 
                                type='text' 
                                required 
                                pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
                                title="PAN format: ABCDE1234F"
                                onChange={(e) => setPanNumber(e.target.value)} 
                                value={panNumber} 
                                className={`${inputClasses} uppercase`} 
                                placeholder='ABCDE1234F' 
                            />

                            <div className={uploadAreaClasses}>
                                <input type='file' className='hidden' id='pan-upload' accept="image/*" onChange={(e) => handleFileChange(e, setPanFile, setPanPreview)} />
                                {panPreview ? (
                                    <div className='absolute inset-0 group/preview'>
                                        <img src={panPreview} className='w-full h-full object-cover' alt="" />
                                        <div className='absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 flex items-center justify-center transition-all'>
                                            <p className='text-[10px] font-black uppercase tracking-widest text-white'>Change Image</p>
                                        </div>
                                    </div>
                                ) : (
                                    <label htmlFor='pan-upload' className='flex flex-col items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 cursor-pointer'>
                                        <Upload className='w-6 h-6 mb-1' />
                                        Upload PAN Copy
                                    </label>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* DL Card */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={cardClasses}>
                         <div className='absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity'>
                            <ShieldCheck className='w-20 h-20' />
                        </div>
                        <div className='relative z-10'>
                            <div className='flex items-center gap-3 mb-8'>
                                <div className='w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20'>
                                    <ShieldCheck className='w-5 h-5 text-indigo-500' />
                                </div>
                                <h3 className='text-xl font-black uppercase tracking-tighter'>Driving Licence</h3>
                            </div>
                            
                            <input 
                                type='text' 
                                required 
                                pattern="^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,11}$"
                                title="Invalid DL Format"
                                onChange={(e) => setDrivingLicenceNumber(e.target.value)} 
                                value={drivingLicenceNumber} 
                                className={`${inputClasses} uppercase`} 
                                placeholder='DL-00000000000' 
                            />

                            <div className={uploadAreaClasses}>
                                <input type='file' className='hidden' id='dl-upload' accept="image/*" onChange={(e) => handleFileChange(e, setDlFile, setDlPreview)} />
                                {dlPreview ? (
                                    <div className='absolute inset-0 group/preview'>
                                        <img src={dlPreview} className='w-full h-full object-cover' alt="" />
                                        <div className='absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 flex items-center justify-center transition-all'>
                                            <p className='text-[10px] font-black uppercase tracking-widest text-white'>Change Image</p>
                                        </div>
                                    </div>
                                ) : (
                                    <label htmlFor='dl-upload' className='flex flex-col items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 cursor-pointer'>
                                        <Upload className='w-6 h-6 mb-1' />
                                        Upload Licence Copy
                                    </label>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className='pt-12 flex justify-center'
                >
                    <motion.button 
                        whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(99,102,241,0.6)" }}
                        whileTap={{ scale: 0.98 }}
                        disabled={verifying} 
                        type='submit' 
                        className='px-16 h-18 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.3em] text-xs rounded-[2rem] flex items-center justify-center gap-6 transition-all shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)] border border-white/20 relative overflow-hidden group/btn disabled:opacity-50'
                    >
                        {verifying ? (
                            <>
                                <Loader2 className='w-6 h-6 animate-spin' />
                                SECURING DATA...
                            </>
                        ) : (
                            <>
                                <CheckCircle className='w-6 h-6 group-hover:rotate-12 transition-transform' />
                                FINALIZE IDENTITY AUTHORIZATION
                            </>
                        )}
                        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite] pointer-events-none' />
                    </motion.button>
                </motion.div>
                    
                    {/* Disclaimer & Trust Badges */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className='mt-16 relative'
                    >
                        {/* Disclaimer Box */}
                        <div className='max-w-2xl mx-auto glass p-6 rounded-2xl border-white/5 bg-white/[0.02] mb-12'>
                            <div className='flex items-start gap-4'>
                                <ShieldAlert className='w-5 h-5 text-amber-500/40 shrink-0 mt-1' />
                                <p className='text-[10px] font-bold uppercase tracking-[0.15em] text-white/20 leading-relaxed text-center'>
                                    By finalizing, you agree to our <span className='text-white/40 underline cursor-pointer hover:text-white transition-colors'>Identity Verification Terms</span>. 
                                    Any attempt to submit fraudulent documents will result in immediate and permanent account termination under the <span className='text-white/40'>IdleWheels Security Protocol</span>.
                                </p>
                            </div>
                        </div>

                        {/* Trust Badges & Steps Indicator */}
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto border-t border-white/5 pt-12 opacity-40 hover:opacity-100 transition-opacity duration-700'>
                            <div className='flex flex-col items-center text-center'>
                                <div className='w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10'>
                                    <Lock className='w-4 h-4 text-white/40' />
                                </div>
                                <h4 className='text-[9px] font-black uppercase tracking-widest text-white/60 mb-2'>AES-256 Encryption</h4>
                                <p className='text-[8px] font-bold text-white/20 uppercase tracking-widest'>Military-grade data protection</p>
                            </div>
                            
                            <div className='flex flex-col items-center text-center'>
                                <div className='w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10'>
                                    <Fingerprint className='w-4 h-4 text-white/40' />
                                </div>
                                <h4 className='text-[9px] font-black uppercase tracking-widest text-white/60 mb-2'>Identity Shield</h4>
                                <p className='text-[8px] font-bold text-white/20 uppercase tracking-widest'>Biometric Cross-Reference</p>
                            </div>

                            <div className='flex flex-col items-center text-center'>
                                <div className='w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10'>
                                    <ShieldCheck className='w-4 h-4 text-white/40' />
                                </div>
                                <h4 className='text-[9px] font-black uppercase tracking-widest text-white/60 mb-2'>GDPR Compliant</h4>
                                <p className='text-[8px] font-bold text-white/20 uppercase tracking-widest'>Privacy-first architecture</p>
                            </div>
                        </div>
                    </motion.div>
            </form>
        </motion.div>
    );
};

export default VerifyIdentity;
