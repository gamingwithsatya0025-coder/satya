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
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCar, setSelectedCar] = useState(null);
  
  const categories = ['All', 'SUV', 'Sedan', 'Luxury', 'Sports'];

  const filteredCars = useMemo(() => {
    if (!cars) return [];
    return cars.filter(car => {
      const matchSearch = car.brand.toLowerCase().includes(input.toLowerCase()) || 
                          car.model.toLowerCase().includes(input.toLowerCase());
      const matchCategory = selectedCategory === 'All' || car.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [input, cars, selectedCategory]);

  const handleMarkerClick = (car) => {
    setSelectedCar(car);
    const element = document.getElementById(`car-${car._id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className='bg-[#030303] min-h-screen'>

      {/* HERO SECTION */}
      <div className='px-6 md:px-16 lg:px-24 mb-6 mt-4 max-w-[1600px] mx-auto w-full'>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className='space-y-4'
        >
          <h1 className='text-4xl md:text-6xl font-black tracking-tight uppercase leading-tight text-white'>
            Explore <span className='gradient-text-animated italic'>Fleet</span>
          </h1>

          <p className='text-sm md:text-base text-white/40 max-w-xl leading-relaxed'>
            Experience the pinnacle of automotive engineering. Discover our elite collection of {filteredCars.length} luxury vehicles.
          </p>
        </motion.div>
      </div>

      {/* STICKY FILTER BAR */}
      <div className='sticky z-40 bg-[#030303]/95 backdrop-blur-2xl shadow-xl py-4 top-0'>
        <div className='px-6 md:px-16 lg:px-24 max-w-[1600px] mx-auto flex flex-col md:flex-row gap-6 md:items-center justify-between'>
            {/* Categories */}
            <div className='flex gap-3 overflow-x-auto no-scrollbar'>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                            selectedCategory === cat
                            ? 'bg-primary text-white shadow-lg'
                            : 'bg-white/5 text-white/40 hover:text-white'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className='w-full md:w-[300px]'>
                <div className='flex items-center bg-white/[0.03] px-5 h-11 rounded-xl border border-white/5 focus-within:border-primary/40 transition-all'>
                    <Search className='w-4 h-4 text-white/20 mr-3' />
                    <input
                        type="text"
                        placeholder="Search vehicles..."
                        className='bg-transparent outline-none text-xs w-full font-bold placeholder:text-white/10 text-white'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>
            </div>
        </div>
      </div>

      {/* EXPLORER SECTION */}
      <div className='flex gap-12 px-6 md:px-16 lg:px-24 max-w-[1600px] mx-auto w-full py-12'>
        
        {/* LEFT: VEHICLE GRID */}
        <div className='w-full lg:w-[60%]'>
            <AnimatePresence mode='popLayout'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                    {filteredCars.map((car, index) => (
                        <motion.div
                            key={car._id}
                            id={`car-${car._id}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onMouseEnter={() => setSelectedCar(car)}
                        >
                            <CarCard car={car} />
                        </motion.div>
                    ))}
                </div>
            </AnimatePresence>
        </div>

        {/* RIGHT: INTERACTIVE MAP */}
        <div className='hidden lg:block lg:w-[40%] sticky h-[calc(100vh-120px)] top-[20px]'>
            <div className='w-full h-full rounded-[3rem] overflow-hidden border border-white/5 relative group'>
                <Map
                    cars={filteredCars}
                    selectedCar={selectedCar}
                    onMarkerClick={handleMarkerClick}
                />
                <div className='absolute top-8 left-8 z-[1000]'>
                    <div className='glass px-5 py-2.5 rounded-full border-white/10 flex items-center gap-2'>
                        <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
                        <span className='text-[9px] font-black uppercase tracking-widest text-white/60'>Active Tracking</span>
                    </div>
                </div>
                <div className='absolute inset-0 pointer-events-none border border-white/5 rounded-[3rem]' />
            </div>
        </div>

      </div>

      <div className='fixed bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[200px] rounded-full pointer-events-none z-0' />
    </div>
  )
}

export default Cars;
