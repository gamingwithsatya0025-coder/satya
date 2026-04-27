import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, TrendingUp, DollarSign } from 'lucide-react'

const Banner = () => {
  const navigate = useNavigate();

  return (
    <section className='section-spacing px-6 md:px-16 lg:px-24 xl:px-32'>
        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className='relative glass overflow-hidden rounded-[3rem] p-10 md:p-20 flex flex-col md:flex-row items-center gap-12 bg-linear-to-br from-primary/15 via-primary/5 to-transparent border-white/5 shadow-2xl'
        >
            {/* Ambient Background Glow */}
            <motion.div 
                animate={{ opacity: [0.15, 0.25, 0.15], scale: [1, 1.1, 1] }}
                transition={{ duration: 6, repeat: Infinity }}
                className='absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full' 
            />
            <motion.div 
                animate={{ opacity: [0.05, 0.1, 0.05] }}
                transition={{ duration: 8, repeat: Infinity }}
                className='absolute bottom-0 left-0 w-72 h-72 bg-orange-500/10 blur-[100px] rounded-full' 
            />
            
            <div className='flex-1 relative z-10'>
                <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8'>
                    <TrendingUp className='w-3.5 h-3.5 text-primary' />
                    <span className='text-[9px] font-black uppercase tracking-widest text-primary'>Monetize Your Assets</span>
                </div>
                
                <h2 className='text-4xl md:text-6xl font-black font-heading mb-6 tracking-tight uppercase leading-none'>
                    Host Your <br />
                    <span className='gradient-text-animated'>Own Car?</span>
                </h2>
                
                <p className='text-white/40 text-sm md:text-lg mb-10 max-w-md font-medium leading-relaxed'>
                    Turn your idle vehicle into a source of income. Join our elite community of car owners and start earning today with secure rentals.
                </p>

                {/* Revenue stat */}
                <div className='flex items-center gap-6 mb-10'>
                    <div className='glass px-6 py-4 rounded-2xl border-white/10'>
                        <div className='flex items-center gap-2'>
                            <DollarSign className='w-4 h-4 text-emerald-400' />
                            <span className='text-2xl font-black text-emerald-400'>₹25K</span>
                        </div>
                        <span className='text-[8px] font-bold uppercase tracking-widest text-white/30'>Avg. Monthly Earnings</span>
                    </div>
                    <div className='glass px-6 py-4 rounded-2xl border-white/10'>
                        <div className='flex items-center gap-2'>
                            <TrendingUp className='w-4 h-4 text-primary' />
                            <span className='text-2xl font-black text-primary'>95%</span>
                        </div>
                        <span className='text-[8px] font-bold uppercase tracking-widest text-white/30'>Owner Satisfaction</span>
                    </div>
                </div>
                
                <button 
                    onClick={() => { navigate('/owner'); window.scrollTo(0,0); }}
                    className='btn-primary group flex items-center gap-3'
                >
                    Get Started Now
                    <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                </button>
            </div>

            <div className='flex-1 relative z-10 w-full'>
                <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <img 
                      src={assets.banner_car_image || assets.main_car} 
                      alt="Luxury Car" 
                      className='w-full object-contain filter drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]' 
                    />
                </motion.div>
                <div className='absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-10 bg-primary/15 blur-[40px] rounded-[100%]' />
            </div>
        </motion.div>
    </section>
  )
}

export default Banner;
