import React, { useState, useEffect, useCallback } from 'react';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Lock, Car, Calendar, MapPin, X, Eye } from 'lucide-react';

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
    <div className='page-container relative'>
      {/* Background */}
      <div className='absolute top-20 right-0 w-[400px] h-[400px] bg-primary/[0.03] blur-[150px] rounded-full pointer-events-none' />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='mb-14 relative z-10'
      >
        <Title title='My Bookings' subTitle='Manage your upcoming and past rentals in your private dashboard.' align="left"/>
      </motion.div>

      {loading ? (
          <div className='py-32 flex flex-col items-center justify-center gap-4'>
              <div className='w-10 h-10 border-2 border-primary border-t-transparent animate-spin rounded-full'></div>
              <p className='text-white/20 text-[10px] font-bold uppercase tracking-widest'>Loading bookings...</p>
          </div>
      ) : bookings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='glass p-16 md:p-24 rounded-[3rem] text-center border-white/5 relative overflow-hidden'
          >
              <div className='absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none' />
              <div className='w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary/10 relative z-10'>
                 <Car className='w-8 h-8 text-primary/30' />
              </div>
              <h3 className='text-2xl font-black mb-3 uppercase tracking-tighter relative z-10'>No active bookings</h3>
              <p className='text-white/25 mb-10 max-w-sm mx-auto font-medium relative z-10'>You haven't reserved any luxury wheels yet. Ready to start your next journey?</p>
              <Link to="/cars" className='btn-primary px-12 h-16 inline-flex items-center justify-center relative z-10'>Explore Collections</Link>
          </motion.div>
      ) : (
        <div className='space-y-6'>
          {bookings.map((booking, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              key={booking._id} 
              className='glass overflow-hidden rounded-[2rem] border-white/5 flex flex-col md:flex-row group hover:border-primary/15 transition-all duration-500'
            >
              <div className='md:w-1/3 aspect-video md:aspect-auto relative overflow-hidden'>
                <img src={booking.car?.images?.[0] || booking.car?.image || assets.car_image1} alt="" className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105' />
                <div className='absolute inset-0 bg-linear-to-r from-black/40 to-transparent' />
              </div>

              <div className='flex-1 p-8 md:p-10 flex flex-col md:flex-row gap-8'>
                <div className='flex-1 space-y-5'>
                    <div>
                        <div className='flex items-center gap-3 mb-3'>
                            <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em] rounded-full border ${
                                booking.status === 'Confirmed' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 
                                booking.status === 'Cancelled' ? 'border-red-500/20 bg-red-500/10 text-red-400' : 'border-primary/20 bg-primary/10 text-primary'
                            }`}>
                                {booking.status}
                            </span>
                            <span className='text-[9px] font-bold uppercase tracking-widest text-white/15 px-2 py-0.5 bg-white/5 rounded-full'>REF: {booking._id.slice(-8)}</span>
                        </div>
                        <h3 className='text-2xl font-black font-heading tracking-tighter uppercase mb-1'>{booking.car?.brand} {booking.car?.model}</h3>
                        <p className='text-white/25 text-[10px] font-bold uppercase tracking-widest'>{booking.car?.year} • {booking.car?.fuelType || booking.car?.fuel_type} • {booking.car?.location}</p>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        <div className='bg-white/[0.02] p-4 rounded-xl border border-white/[0.04] flex items-center gap-3'>
                            <Calendar className='w-4 h-4 text-primary/50' />
                            <div>
                                <p className='text-[7px] font-black uppercase tracking-widest text-primary/60 mb-0.5'>Rental Window</p>
                                <p className='font-bold text-xs text-white/70'>{new Date(booking.pickupDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})} — {new Date(booking.returnDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}</p>
                            </div>
                        </div>
                        <div className='bg-white/[0.02] p-4 rounded-xl border border-white/[0.04] flex items-center gap-3'>
                            <MapPin className='w-4 h-4 text-primary/50' />
                            <div>
                                <p className='text-[7px] font-black uppercase tracking-widest text-primary/60 mb-0.5'>Pickup Hub</p>
                                <p className='font-bold text-xs text-white/70'>{booking.pickupLocation}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='md:w-48 flex flex-col justify-between items-end md:border-l border-white/5 md:pl-8'>
                    <div className='text-right'>
                        <p className='text-[8px] font-black uppercase tracking-widest text-white/15 mb-1'>Total</p>
                        <h4 className='text-3xl font-black text-white font-heading tracking-tighter'>{currency}{booking.totalPrice || booking.price}</h4>
                    </div>

                    <div className='flex flex-col items-end gap-2 w-full mt-4'>
                        <button className='w-full py-2.5 bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/5 flex items-center justify-center gap-2'>
                            <Eye className='w-3 h-3' /> View Details
                        </button>
                        {booking.status === 'Confirmed' && (
                            <button 
                                onClick={() => cancelBooking(booking._id)}
                                className='w-full py-2.5 text-[9px] font-black text-red-500/40 hover:text-red-400 hover:bg-red-500/5 transition-all uppercase tracking-widest rounded-xl flex items-center justify-center gap-2'
                            >
                                <X className='w-3 h-3' /> Cancel
                            </button>
                        )}
                    </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
