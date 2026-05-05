import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion'
import { Users, Fuel, Settings, MapPin, Star, ArrowUpRight } from 'lucide-react'

const CarCard = ({ car }) => {
    const currency = import.meta.env.VITE_CURRENCY || '₹';
    const navigate = useNavigate();
    
    const carImage = car.images && car.images.length > 0 ? car.images[0] : assets.car_icon;
    
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    return (
        <motion.div 
            onMouseMove={handleMouseMove}
            whileHover={{ 
                y: -12,
                scale: 1.02,
                boxShadow: "0 40px 80px -15px rgba(0, 0, 0, 0.5), 0 0 30px rgba(99, 102, 241, 0.15)"
            }}
            onClick={() => { 
                if (car._id) {
                    navigate(`/car-details/${car._id}`); 
                    window.scrollTo({ top: 0, behavior: 'smooth' }); 
                } else {
                    console.error("Car ID missing", car);
                }
            }} 
            className='group bg-[#0a0f1a] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl transition-all duration-700 border border-white/5 hover:border-primary/30 relative card-animation gsap-reveal'
            data-aos="zoom-in"
        >
            {/* Spot light hover effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            600px circle at ${mouseX}px ${mouseY}px,
                            rgba(99, 102, 241, 0.15),
                            transparent 80%
                        )
                    `,
                }}
            />

            {/* Image Container */}
            <div className='relative h-56 overflow-hidden'>
                <img 
                    src={carImage} 
                    alt={car.brand} 
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110' 
                />
                
                {/* Gradient overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-transparent to-transparent' />
                
                {/* Status Badge */}
                <div className='absolute top-4 left-4 flex flex-col gap-2 z-20'>
                    {car.availability ? (
                        <span className='bg-emerald-500/80 backdrop-blur-md text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest'>
                            Available
                        </span>
                    ) : (
                        <span className='bg-red-500/80 backdrop-blur-md text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest'>
                            Booked
                        </span>
                    )}
                </div>

                {/* Price Tag */}
                <div className='absolute bottom-4 left-6 z-20'>
                    <div className='flex items-baseline gap-1'>
                        <span className='text-3xl font-black text-white drop-shadow-lg'>{currency}{car.pricePerDay}</span>
                        <span className='text-[9px] font-bold text-white/50 uppercase tracking-widest'>/ Day</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className='p-7'>
                <div className='flex justify-between items-start mb-5'>
                    <div>
                        <h3 className='text-xl font-black font-heading text-white group-hover:text-primary transition-colors leading-none mb-2'>
                            {car.brand} {car.model}
                        </h3>
                        <div className='flex items-center gap-2'>
                            <span className='text-[9px] font-bold text-primary/70 uppercase tracking-widest'>{car.category}</span>
                            <span className='w-1 h-1 rounded-full bg-white/15'></span>
                            <span className='text-[9px] font-bold text-white/25 uppercase tracking-widest'>{car.year}</span>
                        </div>
                    </div>
                </div>

                {/* Specs Grid */}
                <div className='grid grid-cols-2 gap-3 mb-6'>
                    {[
                        { icon: Users, label: 'Seats', value: `${car.seatingCapacity || 5} Pax` },
                        { icon: Fuel, label: 'Fuel', value: car.fuelType },
                        { icon: Settings, label: 'Shift', value: car.transmission },
                        { icon: MapPin, label: 'Hub', value: car.location },
                    ].map((spec, i) => (
                        <div key={i} className='flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]'>
                            <spec.icon className='w-3.5 h-3.5 text-primary/50' />
                            <div className='overflow-hidden'>
                                <p className='text-[7px] font-bold text-white/25 uppercase tracking-widest leading-none mb-0.5'>{spec.label}</p>
                                <p className='text-[11px] font-bold text-white/70 truncate'>{spec.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className='flex items-center justify-between pt-5 border-t border-white/5'>
                    <div className='flex items-center gap-1'>
                        {[1, 2, 3, 4, 5].map(i => (
                            <Star key={i} className='h-3 w-3 text-amber-400 fill-amber-400' />
                        ))}
                        <span className='text-[10px] font-bold text-white/25 ml-1'>(4.9)</span>
                    </div>
                    <div className='flex items-center gap-2 group/link'>
                        <span className='text-[9px] font-black uppercase tracking-[0.15em] text-primary group-hover/link:text-white transition-colors'>
                            View Details
                        </span>
                        <div className='w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover/link:bg-primary group-hover/link:scale-110 transition-all'>
                            <ArrowUpRight className='w-3 h-3 text-primary group-hover/link:text-white transition-colors' />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default CarCard;
