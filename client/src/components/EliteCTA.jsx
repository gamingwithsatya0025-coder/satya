import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ElegantShape from './ui/ElegantShape';

const EliteCTA = () => {
    return (
        <section className='px-6 md:px-16 lg:px-24 xl:px-32 mb-20'>
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className='glass p-10 md:p-14 rounded-[3rem] border-white/5 relative overflow-hidden max-w-7xl mx-auto group'
            >
                {/* Geometric Shapes */}
                <ElegantShape delay={0.2} width={300} height={80} rotate={12} gradient="from-primary/[0.12]" className="-right-10 -top-10" />
                <ElegantShape delay={0.4} width={200} height={60} rotate={-8} gradient="from-primary/[0.08]" className="-left-10 -bottom-10" />
                <motion.div 
                    animate={{ 
                        background: [
                            "radial-gradient(800px at 0% 0%, rgba(99, 102, 241, 0.15), transparent)",
                            "radial-gradient(800px at 100% 100%, rgba(99, 102, 241, 0.15), transparent)",
                            "radial-gradient(800px at 0% 100%, rgba(99, 102, 241, 0.15), transparent)",
                            "radial-gradient(800px at 0% 0%, rgba(99, 102, 241, 0.15), transparent)"
                        ]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className='absolute inset-0 pointer-events-none'
                />
                <div className='relative z-10 flex flex-col md:flex-row items-center justify-between gap-8'>
                    <div className='max-w-xl'>
                        <h3 className='text-2xl md:text-3xl font-black font-heading uppercase tracking-tight mb-4'>
                            Experience <span className='gradient-text'>Elite Mobility</span>
                        </h3>
                        <p className='text-white/40 text-sm font-medium leading-relaxed'>
                            From chauffeured luxury to high-performance self-drives, we provide the ultimate automotive experience tailored to your distinguished lifestyle.
                        </p>
                    </div>
                    <Link 
                        to="/cars" 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className='btn-primary group flex items-center gap-3 whitespace-nowrap'
                    >
                        Explore the Fleet
                        <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                    </Link>
                </div>
            </motion.div>
        </section>
    );
};

export default EliteCTA;
