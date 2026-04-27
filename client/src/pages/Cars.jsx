import React, { useState, useMemo } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CarCard from '../components/CarCard';
import Map from '../components/Map';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { Search, SlidersHorizontal, Car, MapPin } from 'lucide-react';

const SkeletonCard = () => (
    <div className='bg-[#0a0f1a] rounded-[2rem] overflow-hidden border border-white/5 animate-pulse'>
        <div className='h-56 bg-white/[0.03]' />
        <div className='p-7 space-y-4'>
            <div className='h-5 bg-white/[0.05] rounded-lg w-3/4' />
            <div className='h-3 bg-white/[0.03] rounded-lg w-1/2' />
            <div className='grid grid-cols-2 gap-3 mt-4'>
                <div className='h-10 bg-white/[0.03] rounded-xl' />
                <div className='h-10 bg-white/[0.03] rounded-xl' />
                <div className='h-10 bg-white/[0.03] rounded-xl' />
                <div className='h-10 bg-white/[0.03] rounded-xl' />
            </div>
        </div>
    </div>
);

const Cars = () => {
  const { cars } = useAppContext();
  const [input, setInput] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);
  
  const filteredCars = useMemo(() => {
    if (!cars) return [];
    return cars.filter(car => 
      car.brand.toLowerCase().includes(input.toLowerCase()) || 
      car.model.toLowerCase().includes(input.toLowerCase()) ||
      car.location.toLowerCase().includes(input.toLowerCase())
    );
  }, [input, cars]);

  const handleMarkerClick = (car) => {
    setSelectedCar(car);
    const element = document.getElementById(`car-${car._id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className='bg-[#030712] min-h-screen relative overflow-hidden'>
      <div className="h-32 md:h-48" /> {/* Hard Spacer for Navbar Clearance */}
      {/* Refined Background Accent */}
      <div className='absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/[0.05] to-transparent pointer-events-none' />

      <div className='pt-10 px-6 md:px-16 lg:px-24 xl:px-32 relative z-10'>
        {/* Minimalist Professional Header */}
        <div className='flex flex-col md:flex-row md:items-end justify-between gap-10 mb-14 border-b border-white/5 pb-10'>
            <div className='space-y-2'>
                <h1 className='text-2xl md:text-4xl font-black font-heading tracking-tighter uppercase leading-none'>
                    Our <span className='text-primary italic'>Fleet</span>
                </h1>
                <p className='text-[9px] font-bold uppercase tracking-[0.3em] text-white/20'>
                    {filteredCars.length} Premium vehicles available
                </p>
            </div>

            <div className='w-full max-w-sm group'>
                <div className='relative flex items-center glass h-11 rounded-xl border-white/5 shadow-2xl px-4 hover:border-primary/20 transition-all'>
                    <Search className='w-4 h-4 text-white/20 group-hover:text-primary/60 transition-colors mr-4' />
                    <input 
                        type="text" 
                        placeholder='Search brand, model, or city...' 
                        className='w-full h-full outline-none bg-transparent font-bold placeholder:text-white/10 text-xs text-white' 
                        onChange={(e) => setInput(e.target.value)} 
                        value={input} 
                    />
                    <div className='flex items-center gap-3 pl-4 border-l border-white/5'>
                        <SlidersHorizontal className='w-3.5 h-3.5 text-white/20 cursor-pointer hover:text-white' />
                    </div>
                </div>
            </div>
        </div>

        {/* Main Split Layout */}
        <div className='flex flex-col lg:flex-row gap-12 pb-32'>
          
          {/* Car List (Left) */}
          <div className='w-full lg:w-3/5 lg:max-h-[80vh] lg:overflow-y-auto pr-2 custom-scrollbar'>
            <AnimatePresence mode='popLayout'>
              {filteredCars.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
                  {filteredCars.map((car, index) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      key={car._id} 
                      id={`car-${car._id}`}
                      onMouseEnter={() => setSelectedCar(car)}
                    >
                      <CarCard car={car} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-40 glass rounded-[3rem] border-white/5'>
                  <Search className='w-12 h-12 text-white/5 mx-auto mb-6' />
                  <p className='text-[10px] font-black text-white/20 uppercase tracking-[0.2em]'>No matches found</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Map (Right) - The Important Element */}
          <div className='w-full lg:w-2/5 h-[450px] lg:h-[80vh] sticky top-28'>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className='w-full h-full rounded-[2.5rem] overflow-hidden border border-white/5 shadow-3xl relative'
            >
              <Map 
                cars={filteredCars} 
                selectedCar={selectedCar} 
                onMarkerClick={handleMarkerClick}
              />
              <div className='absolute inset-0 pointer-events-none border-[1px] border-white/5 rounded-[2.5rem]' />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cars;
