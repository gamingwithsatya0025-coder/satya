import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext';
import Title from '../../components/owner/Title';
import axios from 'axios';
import { motion } from 'framer-motion';
import { assets } from '../../assets/assets';

const ManageBookings = () => {
    const { userData, backendUrl, token } = useAppContext();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const currency = import.meta.env.VITE_CURRENCY;

    const fetchAllBookings = useCallback(async () => {
        if (!userData) return;
        try {
            const response = await axios.get(`${backendUrl}/api/booking/list`, {
                headers: { token }
            });
            if (response.data.success) {
                // Filter bookings for cars owned by this user
                const ownerBookings = response.data.bookings.filter(b => 
                    b.car?.owner === userData.id || b.car?.owner?._id === userData.id
                );
                setBookings(ownerBookings.reverse());
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
        setLoading(false);
    }, [backendUrl, token, userData]);

    useEffect(() => {
        Promise.resolve().then(() => fetchAllBookings());
    }, [fetchAllBookings]);

    return (
        <div className='px-4 pt-10 md:px-10 flex-1 h-screen overflow-y-auto custom-scrollbar pb-20'>
            <Title title="Customer Bookings" subTitle="Manage reservations and rental requests for your vehicles." />

            {loading ? (
                <div className='py-20 flex justify-center'>
                    <div className='w-10 h-10 border-4 border-primary border-t-transparent animate-spin rounded-full'></div>
                </div>
            ) : bookings.length === 0 ? (
                <div className='glass p-12 rounded-3xl text-center mt-8 border-white/5'>
                    <h3 className='text-xl font-bold mb-2'>No bookings found</h3>
                    <p className='text-muted-foreground'>Rental requests for your cars will appear here.</p>
                </div>
            ) : (
                <div className='mt-8 space-y-4 shadow-sm'>
                    {bookings.map((booking, index) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={booking._id} 
                            className='glass p-6 rounded-3xl grid grid-cols-1 lg:grid-cols-4 items-center gap-6 border-white/5'
                        >
                            <div className='flex items-center gap-4'>
                                <div className='w-14 h-14 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center shrink-0'>
                                     <img src={assets.user_profile} alt="" className='w-full h-full object-cover opacity-50' />
                                </div>
                                <div>
                                    <p className='font-bold text-sm'>{booking.user?.name}</p>
                                    <p className='text-[10px] text-muted-foreground uppercase tracking-widest'>{booking.user?.email}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className='font-bold text-sm'>{booking.car?.brand} {booking.car?.model}</h4>
                                <p className='text-[10px] text-muted-foreground uppercase'>{booking.car?.location}</p>
                            </div>

                            <div className='space-y-1'>
                                <p className='text-[10px] font-bold uppercase tracking-widest text-primary'>Rental Dates</p>
                                <p className='text-xs font-medium'>
                                    {new Date(booking.pickupDate).toLocaleDateString()} — {new Date(booking.returnDate).toLocaleDateString()}
                                </p>
                            </div>

                            <div className='flex items-center justify-between lg:justify-end gap-6'>
                                <div className='text-right'>
                                    <p className='text-[10px] font-bold text-white/30 uppercase'>Earnings</p>
                                    <p className='text-lg font-black'>{currency}{booking.totalPrice}</p>
                                </div>
                                <div className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest ${
                                    booking.status === 'Confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                }`}>
                                    {booking.status}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageBookings;
