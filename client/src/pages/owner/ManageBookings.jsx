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
    const [selectedUser, setSelectedUser] = useState(null);
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

    const updateStatus = async (bookingId, status) => {
        try {
            const response = await axios.post(`${backendUrl}/api/booking/status`, { bookingId, status }, { headers: { token } });
            if (response.data.success) {
                fetchAllBookings();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Error updating status");
        }
    }

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
                                    booking.status === 'Confirmed' ? 'bg-green-500/20 text-green-400' : 
                                    booking.status === 'Pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                                }`}>
                                    {booking.status}
                                </div>
                            </div>

                            {booking.status === 'Pending' && (
                                <div className='lg:col-span-4 flex flex-wrap gap-3 pt-4 border-t border-white/5 mt-2'>
                                    <button 
                                        onClick={() => setSelectedUser(booking.user)}
                                        className='px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10'
                                    >
                                        View Credentials
                                    </button>
                                    <button 
                                        onClick={() => updateStatus(booking._id, 'Confirmed')}
                                        className='px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-green-500/20'
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => updateStatus(booking._id, 'Cancelled')}
                                        className='px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-red-500/20'
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Credentials Modal */}
            {selectedUser && (
                <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4' onClick={() => setSelectedUser(null)}>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className='glass w-full max-w-2xl rounded-[2.5rem] p-8 border border-white/10 relative'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={() => setSelectedUser(null)} className='absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors'>
                            <img src={assets.close_icon} alt="" className='w-3 h-3 invert opacity-50' />
                        </button>

                        <h3 className='text-2xl font-black mb-6 uppercase tracking-tighter'>Customer Credentials</h3>
                        
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                            <div className='space-y-4'>
                                <div>
                                    <p className='text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1'>Customer Name</p>
                                    <p className='font-bold'>{selectedUser.name}</p>
                                </div>
                                <div>
                                    <p className='text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1'>Verification Status</p>
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                                        selectedUser.verificationStatus === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                                    }`}>
                                        {selectedUser.verificationStatus}
                                    </span>
                                </div>
                            </div>

                            <div className='space-y-4'>
                                <div>
                                    <p className='text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1'>Aadhaar Number</p>
                                    <p className='font-mono text-sm tracking-widest'>{selectedUser.aadhaarNumber || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className='text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1'>Driving Licence</p>
                                    <p className='font-mono text-sm tracking-widest uppercase'>{selectedUser.drivingLicenceNumber || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className='text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1'>PAN Number</p>
                                    <p className='font-mono text-sm tracking-widest uppercase'>{selectedUser.panNumber || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        <div className='mt-8 pt-8 border-t border-white/5 text-[10px] text-white/30 uppercase tracking-[0.2em] leading-relaxed'>
                            Note: Credentials have been pre-validated via regex patterns. Please verify the document numbers match your records if necessary.
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ManageBookings;
