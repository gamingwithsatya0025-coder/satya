import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { X, Mail, Lock, User, Target, Loader2, ArrowRight } from 'lucide-react';

// Animation variants for staggering children
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const InputWrapper = ({ icon: Icon, type, placeholder, value, onChange }) => (
    <div className='relative w-full group'>
        <div className='absolute left-0 top-0 bottom-0 w-14 flex items-center justify-center text-white/30 group-focus-within:text-[#f59e0b] group-focus-within:scale-110 transition-all duration-300 pointer-events-none'>
            <Icon className="w-5 h-5" strokeWidth={2} />
        </div>
        <input 
            type={type} 
            placeholder={placeholder} 
            required 
            value={value}
            onChange={onChange}
            style={{ paddingLeft: '3.5rem', paddingRight: '1rem' }}
            className="w-full h-[54px] bg-white/[0.03] hover:bg-white/[0.05] focus:bg-[#020617] border border-white/10 hover:border-white/20 focus:border-[#f59e0b] rounded-[1rem] outline-none text-white text-sm font-medium transition-all duration-300 focus:ring-4 focus:ring-[#f59e0b]/10 placeholder:text-white/20 shadow-inner"
        />
        {/* Animated Bottom Border Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent group-focus-within:w-full transition-all duration-500 opacity-0 group-focus-within:opacity-100"></div>
    </div>
);

const Login = ({ show, setShow }) => {
    const { backendUrl, setToken, setUserData } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [currentState, setCurrentState] = useState('Login');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (!show) return null;

    const handleSuccessData = (data) => {
        setToken(data.token);
        setUserData(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setName(''); setEmail(''); setPassword('');
        setShow(false);
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let response;
            if (currentState === 'Sign Up') {
                response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
            } else {
                response = await axios.post(`${backendUrl}/api/user/login`, { email, password });
            }

            if (response.data.success) {
                handleSuccessData(response.data);
            } else {
                alert(response.data.message || "Authentication failed");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred during authentication.");
        }
        setLoading(false);
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            const token = credentialResponse.credential;
            const response = await axios.post(`${backendUrl}/api/user/google`, { token });

            if (response.data.success) {
                handleSuccessData(response.data);
            } else {
                alert(response.data.message || "Authentication failed");
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("An error occurred during Google authentication.");
        }
        setLoading(false);
    };

    const handleGoogleError = () => {
        console.error("Google Login Failed");
        alert("Google authentication failed. Please try again.");
    };

    return (
        <AnimatePresence>
            {show && (
                <div className='fixed inset-0 z-[1100] flex items-center justify-center px-4'>
                    {/* Darker premium backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        onClick={() => setShow(false)}
                        className='absolute inset-0 bg-[#020617]/90 backdrop-blur-[20px]'
                    />

                    {/* Premium Card Container */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 40, rotateX: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40, rotateX: -10 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        style={{ perspective: 1000 }}
                        className='relative w-full max-w-[420px] bg-zinc-950/80 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_-10px_rgba(245,158,11,0.2)]'
                    >
                        {/* Elegant ambient glow - Slowly rotating */}
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className='absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-[#f59e0b]/30 to-amber-600/10 blur-[100px] pointer-events-none rounded-full' 
                        />
                        <motion.div 
                            animate={{ rotate: -360 }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            className='absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-[#f59e0b]/30 to-orange-600/10 blur-[100px] pointer-events-none rounded-full' 
                        />

                        {/* Elegant exit button */}
                        <motion.button 
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShow(false)}
                            className='absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-colors z-20 group'
                        >
                            <X className='w-4 h-4 text-white/50 group-hover:text-white transition-colors' strokeWidth={2.5} />
                        </motion.button>

                        <motion.div variants={containerVariants} initial="hidden" animate="show" className='relative z-10'>
                            
                            {/* Minimalist Header */}
                            <motion.div variants={itemVariants} className='text-center mb-10 mt-2'>
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 400, delay: 0.2 }}
                                >
                                    <Target className='w-8 h-8 text-[#f59e0b] mx-auto mb-4 opacity-80' strokeWidth={1.5} />
                                </motion.div>
                                <AnimatePresence mode="wait">
                                    <motion.h2 
                                        key={currentState}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className='text-3xl font-black font-heading uppercase tracking-tight text-white mb-2'
                                    >
                                        {currentState === 'Login' ? 'Welcome Back' : 'Create Account'}
                                    </motion.h2>
                                </AnimatePresence>
                                <p className='text-white/50 text-xs font-medium'>
                                    {currentState === 'Login' ? 'Access your IdleWheels fleet portal.' : 'Join the gold standard of car rentals.'}
                                </p>
                            </motion.div>

                            {/* Form Body */}
                            <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
                                <AnimatePresence mode="popLayout">
                                    {currentState === 'Sign Up' && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                            exit={{ opacity: 0, height: 0, scale: 0.9 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <InputWrapper icon={User} type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                
                                <motion.div variants={itemVariants}>
                                    <InputWrapper icon={Mail} type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} />
                                </motion.div>
                                
                                <motion.div variants={itemVariants}>
                                    <InputWrapper icon={Lock} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                                    <AnimatePresence>
                                        {currentState === 'Login' && (
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className='flex justify-end mt-2 px-1 overflow-hidden'
                                            >
                                                <a href="#" className='text-[11px] font-bold text-white/40 hover:text-[#f59e0b] transition-colors'>Forgot password?</a>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                <motion.button 
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={loading}
                                    className='w-full h-[54px] mt-2 rounded-[1rem] bg-[#f59e0b] hover:bg-[#ea580c] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_rgba(245,158,11,0.5)] border border-[#fde68a]/20 relative overflow-hidden group'
                                >
                                    {/* Shimmering glass effect on button hover */}
                                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]'></div>
                                    <div className='relative flex items-center gap-2'>
                                        {loading ? <Loader2 className='w-5 h-5 animate-spin' /> : (
                                            <>
                                                {currentState} <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
                                            </>
                                        )}
                                    </div>
                                </motion.button>
                            </form>

                            {/* Separator */}
                            <motion.div variants={itemVariants} className='flex items-center gap-4 my-8 opacity-60'>
                                <div className='h-[1px] bg-gradient-to-r from-transparent to-white/30 flex-1'></div>
                                <span className='text-[10px] font-bold text-white/50 tracking-[0.2em] uppercase'>Continue With</span>
                                <div className='h-[1px] bg-gradient-to-l from-transparent to-white/30 flex-1'></div>
                            </motion.div>

                            {/* Google Button */}
                            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className='w-full flex justify-center bg-white/[0.02] rounded-[1rem] border border-white/10 hover:border-white/30 hover:bg-white/[0.05] transition-all duration-300 overflow-hidden shadow-lg'>
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                    theme="filled_black"
                                    size="large"
                                    shape="rectangular"
                                    text="continue_with"
                                    width="340"
                                />
                            </motion.div>

                            {/* Footer actions */}
                            <motion.div variants={itemVariants} className='mt-8 pt-6 border-t border-white/5 w-full text-center'>
                                <p className='text-xs font-medium text-white/40'>
                                    {currentState === 'Login' ? "Don't have an account?" : "Already a member?"}{' '}
                                    <button 
                                        type="button" 
                                        onClick={() => setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')} 
                                        className='text-white font-bold hover:text-[#f59e0b] transition-colors ml-1'
                                    >
                                        {currentState === 'Login' ? 'Sign Up' : 'Log In'}
                                    </button>
                                </p>
                            </motion.div>

                        </motion.div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Login;
