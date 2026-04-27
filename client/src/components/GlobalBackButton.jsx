import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalBackButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    if (location.pathname === '/') return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ 
                    opacity: 1, 
                    x: 0,
                    transition: { type: "spring", stiffness: 300, damping: 25 }
                }}
                exit={{ opacity: 0, x: -40 }}
                className='fixed top-[100px] left-6 xl:left-10 z-[900]'
            >
                <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(-1)}
                    className='w-11 h-11 flex items-center justify-center glass border border-white/10 hover:border-primary/30 rounded-full group transition-all duration-300 shadow-lg overflow-hidden'
                >
                    <ArrowLeft 
                        className='w-4 h-4 text-white/40 group-hover:text-white group-hover:-translate-x-0.5 transition-all duration-300' 
                        strokeWidth={2} 
                    />
                </motion.button>
            </motion.div>
        </AnimatePresence>
    )
}

export default GlobalBackButton;
