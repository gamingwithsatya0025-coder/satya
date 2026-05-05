import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import PortalTitle from '../../components/PortalTitle';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { assets } from '../../assets/assets';
import { ShieldCheck, AlertTriangle, MessageSquare, Info, X, Fingerprint, FileText } from 'lucide-react';

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
                const ownerBookings = response.data.bookings.filter(b => {
                    const ownerId = b.owner?._id || b.owner || b.car?.owner?._id || b.car?.owner;
                    const myId = userData.id || userData._id;
                    return ownerId === myId;
                });
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
            <PortalTitle title="Customer Bookings" subTitle="Manage reservations and rental requests for your vehicles." />

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
                <div className='mt-8 space-y-6 shadow-sm pr-4 md:pr-10'>
                    {bookings.map((booking, index) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={booking._id} 
                            className='glass p-10 rounded-[2.5rem] flex flex-col gap-8 border-white/5 relative group hover:border-white/10 transition-all'
                        >
                            {/* Conflict Indicator */}
                            {bookings.some(b => b.status === 'Confirmed' && b.car?._id === booking.car?._id && b._id !== booking._id && 
                                ((new Date(booking.pickupDate) >= new Date(b.pickupDate) && new Date(booking.pickupDate) <= new Date(b.returnDate)) ||
                                (new Date(booking.returnDate) >= new Date(b.pickupDate) && new Date(booking.returnDate) <= new Date(b.returnDate)))) && (
                                <div className='absolute top-0 right-0 bg-red-500/20 text-red-500 px-4 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-bl-2xl border-l border-b border-red-500/20 flex items-center gap-2'>
                                    <AlertTriangle className='w-3 h-3' /> Schedule Conflict
                                </div>
                            )}

                            <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
                                <div className='flex items-center gap-4'>
                                    <div className='w-16 h-16 rounded-2xl overflow-hidden border border-white/10 bg-primary/5 flex items-center justify-center shrink-0'>
                                        <img src={booking.user?.profilePicture || assets.user_profile} alt="" className='w-full h-full object-cover' />
                                    </div>
                                    <div>
                                        <p className='font-black text-white tracking-tight'>{booking.user?.name}</p>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-2 h-2 rounded-full bg-green-500' />
                                            <p className='text-[10px] text-white/30 uppercase tracking-widest font-bold'>{booking.user?.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-wrap gap-10'>
                                    <div className='space-y-1'>
                                        <p className='text-[8px] font-black uppercase tracking-[0.2em] text-primary'>Vehicle</p>
                                        <h4 className='font-black text-white text-sm'>{booking.car?.brand} {booking.car?.model}</h4>
                                        <p className='text-[8px] text-white/30 uppercase tracking-widest'>{booking.car?.location}</p>
                                    </div>

                                    <div className='space-y-1'>
                                        <p className='text-[8px] font-black uppercase tracking-[0.2em] text-primary'>Duration</p>
                                        <p className='text-xs font-black text-white/80'>
                                            {new Date(booking.pickupDate).toLocaleDateString()} — {new Date(booking.returnDate).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className='space-y-1'>
                                        <p className='text-[8px] font-black uppercase tracking-[0.2em] text-primary'>Total Earnings</p>
                                        <p className='text-xl font-black text-white'>{currency}{booking.totalPrice}</p>
                                    </div>

                                    <div className='flex items-center'>
                                        <div className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] ${
                                            booking.status === 'Confirmed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                                            booking.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                        }`}>
                                            {booking.status}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {booking.status === 'Confirmed' && (
                                <div className='flex items-center gap-4 pt-6 border-t border-white/5'>
                                    <Link to={`/chat/${booking._id}`} className='flex-1'>
                                        <button className='w-full py-4 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border border-primary/20 flex items-center justify-center gap-3'>
                                            <MessageSquare className='w-4 h-4' /> Start Conversation with Renter
                                        </button>
                                    </Link>
                                </div>
                            )}

                            {booking.status === 'Pending' && (
                                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-white/5'>
                                    <button 
                                        onClick={async () => {
                                            try {
                                                const res = await axios.post(`${backendUrl}/api/user/get-profile`, { userId: booking.user._id || booking.user.id }, { headers: { token } });
                                                if (res.data.success) {
                                                    setSelectedUser(res.data.user);
                                                } else {
                                                    setSelectedUser(booking.user);
                                                }
                                            } catch (err) {
                                                setSelectedUser(booking.user);
                                            }
                                        }}
                                        className='px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border border-white/10 flex items-center gap-2 whitespace-nowrap'
                                    >
                                        <ShieldCheck className='w-3 h-3' /> Analyze Credentials
                                    </button>
                                    
                                    <div className='flex items-center gap-3 w-full sm:w-auto'>
                                        <button 
                                            onClick={() => updateStatus(booking._id, 'Confirmed')}
                                            className='flex-1 sm:flex-none px-8 py-3 bg-primary text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 border border-white/10 whitespace-nowrap'
                                        >
                                            Approve Request
                                        </button>
                                        <button 
                                            onClick={() => updateStatus(booking._id, 'Cancelled')}
                                            className='flex-1 sm:flex-none px-8 py-3 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border border-red-500/20 whitespace-nowrap'
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Credentials Modal */}
            <AnimatePresence>
                {selectedUser && (
                    <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 md:p-10' onClick={() => setSelectedUser(null)}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className='glass w-full max-w-5xl rounded-[3rem] p-10 md:p-16 border border-white/10 relative overflow-y-auto max-h-[90vh] custom-scrollbar shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]'
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onClick={() => setSelectedUser(null)} className='absolute top-10 right-10 w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 group'>
                                <X className='w-6 h-6 text-white/40 group-hover:text-white group-hover:rotate-90 transition-all' />
                            </button>

                            <div className='flex flex-col md:flex-row items-start md:items-center gap-8 mb-16'>
                                <div className='w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_50px_-10px_rgba(99,102,241,0.5)]'>
                                    <Fingerprint className='w-12 h-12 text-primary' />
                                </div>
                                <div>
                                    <h2 className='text-4xl lg:text-5xl font-black font-heading uppercase tracking-tighter text-white leading-none'>{selectedUser.name}</h2>
                                    <p className='text-primary text-[10px] font-black uppercase tracking-[0.5em] mt-4'>Official Identity Protocol</p>
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
                                {/* Aadhaar */}
                                <div className='space-y-6'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-2 h-2 rounded-full bg-primary animate-pulse' />
                                        <span className='text-[10px] font-black uppercase tracking-widest text-white/40'>Aadhaar Identification</span>
                                    </div>
                                    <p className='text-xl font-black text-white tracking-[0.3em] uppercase'>{selectedUser.aadhaarNumber || 'NOT PROVIDED'}</p>
                                    <div className='aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black/40 group relative'>
                                        {selectedUser.aadhaarImage ? (
                                            <img src={selectedUser.aadhaarImage} className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-700' alt="Aadhaar" />
                                        ) : (
                                            <div className='absolute inset-0 flex flex-col items-center justify-center gap-3'>
                                                <AlertTriangle className='w-6 h-6 text-white/10' />
                                                <span className='text-[8px] font-black uppercase tracking-widest text-white/10'>Document Missing</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* PAN */}
                                <div className='space-y-6'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-2 h-2 rounded-full bg-amber-500 animate-pulse' />
                                        <span className='text-[10px] font-black uppercase tracking-widest text-white/40'>PAN Verification</span>
                                    </div>
                                    <p className='text-xl font-black text-white tracking-[0.3em] uppercase'>{selectedUser.panNumber || 'NOT PROVIDED'}</p>
                                    <div className='aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black/40 group relative'>
                                        {selectedUser.panImage ? (
                                            <img src={selectedUser.panImage} className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-700' alt="PAN" />
                                        ) : (
                                            <div className='absolute inset-0 flex flex-col items-center justify-center gap-3'>
                                                <AlertTriangle className='w-6 h-6 text-white/10' />
                                                <span className='text-[8px] font-black uppercase tracking-widest text-white/10'>Document Missing</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* DL */}
                                <div className='space-y-6'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-2 h-2 rounded-full bg-indigo-500 animate-pulse' />
                                        <span className='text-[10px] font-black uppercase tracking-widest text-white/40'>Driving Authorization</span>
                                    </div>
                                    <p className='text-xl font-black text-white tracking-[0.3em] uppercase'>{selectedUser.drivingLicenceNumber || 'NOT PROVIDED'}</p>
                                    <div className='aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black/40 group relative'>
                                        {selectedUser.drivingLicenceImage ? (
                                            <img src={selectedUser.drivingLicenceImage} className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-700' alt="License" />
                                        ) : (
                                            <div className='absolute inset-0 flex flex-col items-center justify-center gap-3'>
                                                <AlertTriangle className='w-6 h-6 text-white/10' />
                                                <span className='text-[8px] font-black uppercase tracking-widest text-white/10'>Document Missing</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className='mt-20 pt-10 border-t border-white/5 text-center'>
                                <p className='text-[10px] font-black text-white/20 uppercase tracking-[0.5em]'>
                                    Please cross-reference all documents before finalizing the rental contract.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageBookings;
