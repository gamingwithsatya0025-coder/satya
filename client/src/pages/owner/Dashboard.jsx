import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PortalTitle from '../../components/PortalTitle';
import { useAppContext } from '../../context/AppContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { assets } from '../../assets/assets';

import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { userData, backendUrl, token, cars } = useAppContext();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const currency = import.meta.env.VITE_CURRENCY;

  const fetchStats = useCallback(async () => {
    if (!userData) return;
    try {
        const response = await axios.get(`${backendUrl}/api/booking/list`, {
            headers: { token }
        });
        if (response.data.success) {
            const ownerBookings = response.data.bookings.filter(b => 
                b.car?.owner === userData.id || b.car?.owner?._id === userData.id
            );
            setBookings(ownerBookings);
        }
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
    }
    setLoading(false);
  }, [backendUrl, token, userData]);

  useEffect(() => {
    Promise.resolve().then(() => fetchStats());
  }, [fetchStats]);

  const stats = useMemo(() => {
    const userCarsCount = cars.filter(c => c.owner === userData?.id || c.owner?._id === userData?.id).length;
    bookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0);
    const pending = bookings.filter(b => b.status === 'Pending').length;
    const confirmed = bookings.filter(b => b.status === 'Confirmed').length;

    return [
        { title: "Total Fleet", value: userCarsCount, icon: assets.carIconColored, color: 'primary' },
        { title: "Reservations", value: bookings.length, icon: assets.listIconColored, color: 'blue' },
        { title: "Pending", value: pending, icon: assets.cautionIconColored, color: 'yellow' },
        { title: "Confirmed", value: confirmed, icon: assets.tick_icon, color: 'green' }
    ];
  }, [cars, bookings, userData]);

  return (
    <div className='flex-1 h-screen overflow-y-auto custom-scrollbar'>
      <div className='px-6 pt-12 pb-20 md:px-10 lg:px-16 max-w-7xl mx-auto'>
      <PortalTitle title="Fleet Overview" subTitle="Comprehensive insights into your vehicle performance and rental analytics." />
      
      {loading ? (
        <div className='py-20 flex justify-center'>
            <div className='w-10 h-10 border-4 border-primary border-t-transparent animate-spin rounded-full'></div>
        </div>
      ) : (
        <div className='space-y-12 mt-8'>
            {/* Verification Status Card */}
            {!userData?.verificationStatus || userData?.verificationStatus !== 'approved' ? (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='glass p-8 rounded-[2.5rem] border border-primary/20 bg-primary/5 mb-10 flex flex-col md:flex-row items-center justify-between gap-6'
                >
                    <div className='flex items-center gap-6'>
                        <div className='w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30'>
                            <img src={assets.cautionIconColored} className='w-8 h-8' alt="" />
                        </div>
                        <div>
                            <h3 className='text-xl font-black font-heading'>Account Verification Required</h3>
                            <p className='text-sm text-white/50'>Please complete your Aadhaar verification to enable car booking features.</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate('/owner/verify-identity')} 
                        className='px-8 h-14 bg-primary text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:scale-105 transition-transform'
                    >
                        Verify Identity
                    </button>
                </motion.div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='glass p-6 rounded-3xl border border-green-500/20 bg-green-500/5 mb-10 flex items-center gap-4'
                >
                    <div className='w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center border border-green-500/30'>
                        <img src={assets.tick_icon} className='w-5 h-5' alt="" />
                    </div>
                    <div>
                        <p className='text-[10px] font-bold uppercase tracking-widest text-green-500'>Identity Verified</p>
                        <p className='text-xs text-white/50'>Your account is fully verified and ready for all platform features.</p>
                    </div>
                </motion.div>
            )}

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                {stats.map((stat, index) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        key={index} 
                        className='glass p-6 rounded-3xl border-white/5 premium-shadow flex items-center justify-between group hover:border-primary/30 transition-all duration-500'
                    >
                        <div>
                            <p className='text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1'>{stat.title}</p>
                            <h2 className='text-3xl font-black font-heading'>{stat.value}</h2>
                        </div>
                        <div className='w-14 h-14 bg-white/[0.03] rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors'>
                            <img src={stat.icon} alt="" className='w-6 h-6' />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch'>
                <div className='lg:col-span-2 glass p-8 rounded-[2.5rem] border-white/5 flex flex-col'>
                    <div className='flex items-center justify-between mb-8'>
                        <h3 className='text-xl font-bold font-heading'>Recent Activity</h3>
                        <button className='text-xs font-bold uppercase tracking-widest text-primary hover:underline'>View Full Report</button>
                    </div>
                    {bookings.length === 0 ? (
                        <div className='flex-1 flex flex-col items-center justify-center py-10'>
                            <p className='text-muted-foreground text-center'>No recent activities recorded.</p>
                        </div>
                    ) : (
                        <div className='space-y-4 flex-1'>
                            {bookings.slice(0, 4).map((booking, index) => (
                                <div key={index} className='flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-colors'>
                                    <div className='flex items-center gap-4'>
                                        <div className='w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center font-black text-primary text-xl'>
                                            {booking.car?.brand[0]}
                                        </div>
                                        <div>
                                            <p className='font-bold text-sm tracking-tight'>{booking.car?.brand} {booking.car?.model}</p>
                                            <p className='text-[10px] text-white/30 uppercase font-black tracking-widest'>{new Date(booking.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className='text-right'>
                                        <p className='font-black text-primary text-lg'>{currency}{booking.totalPrice}</p>
                                        <div className='flex items-center justify-end gap-1.5 mt-1'>
                                            <div className={`w-1.5 h-1.5 rounded-full ${booking.status === 'Confirmed' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                                            <p className='text-[9px] text-white/40 uppercase font-bold tracking-widest'>{booking.status}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className='glass p-8 rounded-[2.5rem] border-white/5 flex flex-col justify-center items-center text-center relative overflow-hidden group min-h-[300px]'>
                    <div className='absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none'></div>
                    <div className='w-20 h-20 bg-green-500/10 rounded-[2rem] flex items-center justify-center mb-8 border border-green-500/20 shadow-[0_0_40px_-10px_rgba(34,197,94,0.3)] group-hover:scale-110 transition-transform'>
                        <span className='text-4xl font-black text-green-500'>₹</span>
                    </div>
                    <p className='text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3'>Projected Earnings</p>
                    <h2 className='text-6xl font-black font-heading text-white mb-3 tracking-tighter'>
                        {currency}{bookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0)}
                    </h2>
                    <p className='text-[10px] font-bold uppercase tracking-widest text-green-500/60'>Revenue Overview</p>
                    <div className='mt-8 pt-8 border-t border-white/5 w-full flex items-center justify-center gap-6'>
                        <div className='text-center'>
                            <p className='text-[9px] font-black text-white/20 uppercase tracking-widest mb-1'>Net Profit</p>
                            <p className='text-sm font-bold text-white/60'>92%</p>
                        </div>
                        <div className='w-[1px] h-6 bg-white/5'></div>
                        <div className='text-center'>
                            <p className='text-[9px] font-black text-white/20 uppercase tracking-widest mb-1'>Tax rate</p>
                            <p className='text-sm font-bold text-white/60'>8%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default Dashboard;
