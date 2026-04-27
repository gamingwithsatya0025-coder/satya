import React from 'react'
import { motion } from 'framer-motion'

const Title = ({ title, subTitle, align = "center" }) => {
  return (
    <div className={`flex flex-col ${align === "left" ? "items-start text-left" : "items-center text-center"} w-full mb-12`}>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className='flex flex-col'
        >
            {/* Decorative Label */}
            <div className={`flex items-center gap-4 mb-5 ${align === "left" ? "" : "justify-center"}`}>
                <div className='w-12 h-[1px] bg-primary/30 rounded-full' />
                <span className='text-[10px] font-black uppercase tracking-[0.4em] text-primary/50'>IdleWheels Premium</span>
                <div className='w-12 h-[1px] bg-primary/30 rounded-full' />
            </div>

            <h2 className='text-4xl md:text-6xl font-black font-heading tracking-tight mb-6 gradient-text-animated uppercase leading-none'>
              {title}
            </h2>
            <div className={`flex items-center gap-2 mb-6 ${align === "left" ? "mr-auto" : "mx-auto"}`}>
                <div className='w-3 h-3 rounded-full bg-primary/20 border border-primary/30' />
                <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '5rem' }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="h-[2px] bg-gradient-to-r from-primary to-primary/20 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                />
                <div className='w-3 h-3 rounded-full bg-primary/20 border border-primary/30' />
            </div>
        </motion.div>
        
        <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='text-white/40 text-sm md:text-base font-medium max-w-2xl leading-relaxed'
        >
          {subTitle}
        </motion.p>
    </div>
  )
}

export default Title;
