import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import Title from './Title';
import { assets } from '../assets/assets';
import CarCard from './CarCard';
import { Car, ArrowUpRight } from 'lucide-react';
import ElegantShape from './ui/ElegantShape';

const SkeletonCard = () => (
    <div className='bg-[#0f172a] rounded-[2rem] overflow-hidden border border-white/5 animate-pulse'>
        <div className='h-64 bg-white/[0.03]' />
        <div className='p-8 space-y-4'>
            <div className='h-6 bg-white/[0.05] rounded-lg w-3/4' />
            <div className='h-4 bg-white/[0.03] rounded-lg w-1/2' />
            <div className='grid grid-cols-2 gap-3 mt-6'>
                <div className='h-12 bg-white/[0.03] rounded-xl' />
                <div className='h-12 bg-white/[0.03] rounded-xl' />
                <div className='h-12 bg-white/[0.03] rounded-xl' />
                <div className='h-12 bg-white/[0.03] rounded-xl' />
            </div>
            <div className='h-px bg-white/5 mt-6' />
            <div className='flex justify-between items-center pt-2'>
                <div className='h-4 bg-white/[0.03] rounded w-24' />
                <div className='h-4 bg-white/[0.03] rounded w-20' />
            </div>
        </div>
    </div>
);

const FeaturedSection = () => {
  const { cars } = useAppContext();
  const navigate = useNavigate();

  return (
    <section className='section-spacing px-6 md:px-16 lg:px-24 xl:px-32 bg-background relative overflow-hidden'>
        {/* Geometric Background Shapes */}
        <ElegantShape delay={0.2} width={400} height={100} rotate={15} gradient="from-primary/[0.1]" className="-left-20 top-20" />
        <ElegantShape delay={0.4} width={300} height={80} rotate={-10} gradient="from-primary/[0.05]" className="-right-20 bottom-20" />
        
        {/* Ambient background */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.02] blur-[200px] rounded-full pointer-events-none' />

        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='flex flex-col items-center text-center max-w-3xl mx-auto'
        >
            <Title 
              title="Featured Fleet" 
              subTitle="Explore our hand-picked selection of premium automobiles. Find the perfect match for your next distinguished journey." 
            />
        </motion.div>

        {cars && cars.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mt-20 mb-20'>
                {cars.slice(0, 6).map((car, index) => (
                    <motion.div 
                        key={car._id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                            duration: 0.8, 
                            delay: index * 0.1,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                    >
                        <CarCard car={car} />
                    </motion.div>
                ))}
            </div>
        ) : (
            /* Skeleton Loading State */
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mt-20 mb-20'>
                {[1, 2, 3].map(i => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                    >
                        <SkeletonCard />
                    </motion.div>
                ))}
            </div>
        )}

        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className='flex justify-center'
        >
            <button 
                onClick={() => {navigate('/cars'); window.scrollTo({top: 0, behavior: 'smooth'})}} 
                className='btn-secondary group flex items-center gap-4 px-12 py-5'
            >
                <Car className='w-4 h-4 text-primary' />
                View Full Collection 
                <div className='w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all'>
                    <ArrowUpRight className='w-3.5 h-3.5 text-white' />
                </div>
            </button>
        </motion.div>
    </section>
  )
}

export default FeaturedSection;
