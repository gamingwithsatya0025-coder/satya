import React, { useState, useEffect, useCallback } from 'react';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Lock, Car, Calendar, MapPin, X, Eye, Shield, Zap } from 'lucide-react';

const MyBookings = () => {
  const { userData, backendUrl, token } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const currency = import.meta.env.VITE_CURRENCY || '₹';

  const fetchMyBookings = useCallback(async () => {
    if (!userData) return;
    try {
      const response = await axios.get(`${backendUrl}/api/booking/user/${userData.id}`, {
        headers: { token }
      });
      if (response.data.success) {
        setBookings(response.data.bookings.reverse());
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
    setLoading(false);
  }, [backendUrl, token, userData]);

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
        const response = await axios.post(`${backendUrl}/api/booking/cancel`, { bookingId }, {
            headers: { token }
        });
        if (response.data.success) {
            alert("Booking cancelled successfully.");
            fetchMyBookings();
        }
    } catch (error) {
        console.error(error);
        alert("Error cancelling booking.");
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => fetchMyBookings());
  }, [fetchMyBookings]);

  if (!userData) {
      return (
          <div className='page-container flex flex-col items-center justify-center text-center'>
              <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className='flex flex-col items-center'
              >
                  <div className='w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-white/5'>
                      <Lock className='w-8 h-8 text-white/15' />
                  </div>
                  <h1 className='text-3xl font-black mb-4 uppercase tracking-tighter gradient-text-animated'>Access Restricted</h1>
                  <p className='text-white/35 mb-10 max-w-xs font-medium'>Please sign in to access your personal dashboard and active rentals.</p>
                  <Link to="/" className='btn-primary'>Return Home</Link>
              </motion.div>
          </div>
      );
  }

    return (
        <div className='page-container pt-20 pb-40 relative bg-black'>
            {/* Elegant Background Accents */}
            <div className='absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.015] blur-[150px] rounded-full pointer-events-none' />

            {/* HEADER AREA */}
            <div className='mb-24 px-4'>
                <Title title='My Bookings' subTitle={`Welcome back, ${userData?.name}. Oversee your active fleet and premium rentals.`} align="left" />
            </div>

            {loading ? (
                <div className='py-32 flex flex-col items-center justify-center gap-4'>
                    <div className='w-6 h-6 border-2 border-primary border-t-transparent animate-spin rounded-full'></div>
                    <p className='text-white/20 text-[9px] font-bold uppercase tracking-[0.3em]'>Synchronizing...</p>
                </div>
            ) : bookings.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='glass-card p-24 rounded-[3rem] text-center border border-white/5 mx-4'
                >
                    <div className='w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5'>
                        <Car className='w-6 h-6 text-white/10' />
                    </div>
                    <span className='block text-xl font-black mb-4 uppercase tracking-tighter text-white'>No active fleet</span>
                    <p className='text-white/20 mb-10 max-w-sm mx-auto font-medium leading-relaxed text-sm'>Your reservation history is currently empty. Ready to start your next luxury journey?</p>
                    <Link to="/cars" className='btn-primary px-12 h-16 inline-flex items-center justify-center'>Explore Collections</Link>
                </motion.div>
            ) : (
                <div className='max-w-7xl mx-auto space-y-40 px-4'>
                    
                    {/* BOOKINGS LIST */}
                    <div className='space-y-16'>
                        <div className='flex items-center gap-6 border-b border-white/5 pb-10'>
                            <span className='text-[10px] font-black uppercase tracking-[0.5em] text-white/30'>Active Deployments</span>
                            <div className='h-px flex-1 bg-white/[0.03]' />
                            <span className='text-[10px] font-bold text-primary/40'>{bookings.length} Vehicles</span>
                        </div>

                        <div className='space-y-24'>
                            {bookings.map((booking, index) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.8 }}
                                    key={booking._id} 
                                    className='flex flex-col lg:flex-row gap-12 lg:gap-20 group relative'
                                >
                                    {/* Image Section */}
                                    <div className='lg:w-[400px] xl:w-[480px] aspect-[16/10] relative rounded-[2.5rem] overflow-hidden border border-white/5 bg-white/[0.01] shrink-0'>
                                        <img 
                                            src={booking.car?.images?.[0] || booking.car?.image || assets.car_image1} 
                                            alt="" 
                                            className='w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000' 
                                        />
                                        <div className='absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60' />
                                    </div>

                                    {/* Info Section */}
                                    <div className='flex-1 flex flex-col justify-between py-2'>
                                        <div className='space-y-10'>
                                            <div className='flex flex-col gap-4'>
                                                <div className='flex items-center gap-4'>
                                                    <span className={`px-4 py-1 text-[8px] font-black uppercase tracking-[0.2em] rounded-full border ${
                                                        booking.status === 'Confirmed' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 
                                                        booking.status === 'Cancelled' ? 'border-red-500/20 bg-red-500/10 text-red-400' : 'border-primary/20 bg-primary/10 text-primary'
                                                    }`}>
                                                        {booking.status}
                                                    </span>
                                                    <span className='text-[8px] font-bold text-white/10 uppercase tracking-[0.3em]'>REF: {booking._id.slice(-8)}</span>
                                                </div>
                                                <span className='text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-tight'>{booking.car?.brand} {booking.car?.model}</span>
                                                <p className='text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]'>{booking.car?.year} • {booking.car?.fuelType || booking.car?.fuel_type} • {booking.car?.location}</p>
                                            </div>

                                            <div className='grid grid-cols-2 gap-12'>
                                                <div className='space-y-3'>
                                                    <span className='block text-[8px] font-black uppercase tracking-[0.4em] text-primary/40'>Duration</span>
                                                    <p className='text-sm font-bold text-white/60 tracking-tight'>
                                                        {new Date(booking.pickupDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})} — {new Date(booking.returnDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}
                                                    </p>
                                                </div>
                                                <div className='space-y-3'>
                                                    <span className='block text-[8px] font-black uppercase tracking-[0.4em] text-primary/40'>Pickup Hub</span>
                                                    <p className='text-sm font-bold text-white/60 tracking-tight uppercase'>{booking.pickupLocation}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='mt-12 pt-10 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8'>
                                            <div>
                                                <span className='text-[8px] font-black uppercase tracking-[0.4em] text-white/15 mb-2 block'>Total Investment</span>
                                                <span className='text-4xl font-black text-white tracking-tighter flex items-center gap-1'>
                                                    <span className='text-primary/50 text-2xl'>{currency}</span>{booking.totalPrice || booking.price}
                                                </span>
                                            </div>
                                            
                                            <div className='flex items-center gap-6 w-full sm:w-auto'>
                                                <Link to={`/car-details/${booking.car?._id || booking.carId}`} className='flex-1 sm:flex-none'>
                                                    <button className='w-full sm:w-auto h-16 px-10 bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-[0.4em] rounded-full transition-all border border-white/5 flex items-center justify-center gap-3'>
                                                        <Eye className='w-4 h-4' /> Details
                                                    </button>
                                                </Link>
                                                {booking.status === 'Confirmed' && (
                                                    <button 
                                                        onClick={() => cancelBooking(booking._id)}
                                                        className='text-[9px] font-black text-red-500/30 hover:text-red-400 transition-all uppercase tracking-[0.4em]'
                                                    >
                                                        Terminate
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* SERVICES FOOTER SECTION */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-20 pt-20 border-t border-white/5'>
                        <div className='group'>
                            <div className='flex items-center gap-6 mb-8'>
                                <div className='w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/5 group-hover:border-primary/40 transition-all'>
                                    <Shield className='w-4 h-4 text-primary/60' />
                                </div>
                                <span className='text-lg font-black uppercase tracking-tighter text-white'>Elite Care active</span>
                            </div>
                            <p className='text-white/20 text-xs font-medium leading-relaxed mb-10 max-w-sm'>Our 24/7 roadside concierge and premium insurance shield are active for every mile of your deployment.</p>
                            <button className='text-[9px] font-black uppercase tracking-[0.4em] text-primary/60 hover:text-primary transition-all border-b border-primary/20 pb-1'>Request Support</button>
                        </div>

                        <div className='group'>
                            <div className='flex items-center gap-6 mb-8'>
                                <div className='w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/5 group-hover:border-primary/40 transition-all'>
                                    <Zap className='w-4 h-4 text-primary/60' />
                                </div>
                                <span className='text-lg font-black uppercase tracking-tighter text-white'>Priority Upgrades</span>
                            </div>
                            <p className='text-white/20 text-xs font-medium leading-relaxed mb-10 max-w-sm'>Chauffeur deployments and long-term fleet management arriving next month for platinum members.</p>
                            <div className='h-px w-32 bg-white/5 relative overflow-hidden'>
                                <motion.div animate={{ x: [-128, 128] }} transition={{ duration: 2, repeat: Infinity }} className='absolute inset-0 bg-primary/40' />
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default MyBookings;
