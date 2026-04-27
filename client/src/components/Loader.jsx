import React from 'react'
import { motion } from 'framer-motion'

const Loader = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-background'>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className='w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full mb-6'
      />
      <motion.p
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className='text-[10px] font-black uppercase tracking-[0.3em] text-white/20'
      >
        Loading
      </motion.p>
    </div>
  )
}

export default Loader;
