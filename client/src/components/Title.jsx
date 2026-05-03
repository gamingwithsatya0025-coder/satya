import React from 'react'
import { motion } from 'framer-motion'

const Title = ({ title, subTitle, align = "center" }) => {
  return (
    <div className={`flex flex-col ${align === "left" ? "items-start text-left" : "items-center text-center"} w-full mb-12 relative group`}>
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className='flex flex-col w-full'
        >
            {/* Decorative Label */}
            <div className={`flex items-center gap-4 mb-6 ${align === "left" ? "" : "justify-center"}`}>
                <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: 48 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className='h-[1px] bg-primary/40 rounded-full' 
                />
                <span className='text-[10px] font-black uppercase tracking-[0.5em] text-primary/60'>IdleWheels Premium</span>
                <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: 48 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className='h-[1px] bg-primary/40 rounded-full' 
                />
            </div>

            <h2 className='text-4xl md:text-6xl lg:text-7xl font-black font-heading tracking-tight mb-8 gradient-text-animated uppercase leading-[0.9] gsap-reveal'>
              {title}
            </h2>
            
            <div className={`flex items-center gap-2 mb-8 ${align === "left" ? "mr-auto" : "mx-auto"}`}>
                <div className='w-3 h-3 rounded-full bg-primary/20 border border-primary/40 animate-pulse' />
                <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '120px' }}
                    transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="h-[2px] bg-gradient-to-r from-primary via-primary/50 to-transparent rounded-full shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                />
                <div className='w-3 h-3 rounded-full bg-primary/20 border border-primary/40' />
            </div>
        </motion.div>
        
        <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='text-white/40 text-sm md:text-base font-medium max-w-2xl leading-relaxed gsap-reveal'
        >
          {subTitle}
        </motion.p>
    </div>
  )
}

export default Title;
