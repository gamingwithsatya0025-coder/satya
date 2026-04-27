import React, { useEffect, useMemo } from 'react';
import { assets } from '../../assets/assets';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';
import axios from 'axios';
import { motion } from 'framer-motion';

const ManageCars = () => {
  const { userData, backendUrl, token, cars, fetchCars } = useAppContext();
  const [loading, setLoading] = React.useState(true);
  
  const userCars = useMemo(() => {
    if (cars && userData) {
        return cars.filter(car => car.owner === userData.id || car.owner?._id === userData.id);
    }
    return [];
  }, [cars, userData]);

  useEffect(() => {
    if (cars) {
      setLoading(false);
    }
  }, [cars]);

  const removeCar = async (carId) => {
    if (!window.confirm("Are you sure you want to remove this car?")) return;
    try {
        const response = await axios.post(`${backendUrl}/api/car/remove`, { carId }, {
            headers: { token }
        });
        if (response.data.success) {
            alert("Car removed successfully.");
            fetchCars();
        }
    } catch (error) {
        console.error(error);
        alert("Error removing car.");
    }
  };

  return (
    <div className='px-4 pt-10 md:px-10 flex-1 h-screen overflow-y-auto custom-scrollbar pb-20'>
      <Title title="Manage Your Fleet" subTitle="Monitor your listed vehicles and their availability status." />
      
      {loading ? (
        <div className='py-20 flex justify-center'>
            <div className='w-10 h-10 border-4 border-primary border-t-transparent animate-spin rounded-full'></div>
        </div>
      ) : userCars.length === 0 ? (
        <div className='glass p-12 rounded-3xl text-center mt-8 border-white/5'>
            <h3 className='text-xl font-bold mb-2'>No cars listed yet</h3>
            <p className='text-muted-foreground'>Start your journey by adding your first vehicle.</p>
        </div>
      ) : (
        <div className='mt-8 flex flex-col gap-4'>
            {userCars.map((car, index) => (
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={car._id} 
                    className='glass p-6 rounded-3xl flex items-center justify-between gap-6 border-white/5 premium-shadow group'
                >
                    <div className='flex items-center gap-6'>
                        <div className='w-24 h-24 rounded-2xl overflow-hidden'>
                            <img src={car.images?.[0] || car.image} alt="" className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' />
                        </div>
                        <div>
                            <h3 className='text-xl font-bold font-heading'>{car.brand} {car.model}</h3>
                            <p className='text-sm text-muted-foreground'>{car.year} • {car.fuelType || car.fuel_type} • {car.location}</p>
                            <div className='flex items-center gap-3 mt-2'>
                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md ${car.availability ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-500'}`}>
                                    {car.availability ? 'Active' : 'Unavailable'}
                                </span>
                                <span className='text-[10px] font-bold uppercase text-white/30 tracking-widest'>ID: {car._id.slice(-6)}</span>
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center gap-12'>
                        <div className='text-right'>
                            <p className='text-[10px] font-bold uppercase tracking-widest text-white/30'>Daily Rate</p>
                            <p className='text-xl font-black text-primary'>{currency}{car.pricePerDay}</p>
                        </div>
                        <button 
                            onClick={() => removeCar(car._id)}
                            className='p-4 rounded-2xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all duration-300'
                        >
                            <img src={assets.delete_icon} alt="Delete" className='w-5 h-5 invert group-hover:brightness-200' />
                        </button>
                    </div>
                </motion.div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ManageCars;
