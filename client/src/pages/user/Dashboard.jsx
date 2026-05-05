import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, CreditCard, Star, ChevronRight, Zap, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PortalTitle from '../../components/PortalTitle';

const Dashboard = () => {
    const { userData, backendUrl, token } = useAppContext();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserStats = async () => {
            if (!token) return;
            try {
                const response = await axios.get(`${backendUrl}/api/booking/user-bookings`, {
                    headers: { token }
                });
                if (response.data.success) {
                    setBookings(response.data.bookings);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
            setLoading(false);
        };
        fetchUserStats();
    }, [backendUrl, token]);

    const stats = [
        { label: "Total Bookings", value: bookings.length, icon: Zap, color: "text-primary", bg: "bg-primary/10" },
        { label: "Total Spent", value: `₹${bookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0).toLocaleString()}`, icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Active Trips", value: bookings.filter(b => b.status === 'Confirmed').length, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Trust Rating", value: userData?.verificationStatus === 'approved' ? "5.0" : "4.2", icon: Star, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    ];

    if (loading) return (
        <div className='flex items-center justify-center h-screen bg-[#050505]'>
            <Loader2 className='w-10 h-10 text-primary animate-spin' />
        </div>
    );

    return (
        <div className='p-8 md:p-12 h-screen overflow-y-auto custom-scrollbar bg-[#050505] pb-32'>
            <div className='max-w-6xl mx-auto'>
                <PortalTitle title={`Welcome Back, ${userData?.name}`} subTitle="Your real-time luxury rental analytics and account performance." />

                {/* Stats Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
                    {stats.map((stat, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className='glass p-6 rounded-3xl border border-white/5 flex items-center gap-5 group hover:border-white/10 transition-all'
                        >
                            <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className='text-[10px] font-black uppercase tracking-widest text-white/30 mb-1'>{stat.label}</p>
                                <p className='text-2xl font-black text-white'>{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Verification Status */}
                    <div className='lg:col-span-2 glass rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden'>
                        <div className='absolute top-0 right-0 p-10 opacity-5'>
                            <ShieldCheck className='w-40 h-40 text-primary' />
                        </div>
                        <div className='relative z-10'>
                            <div className='flex items-center gap-4 mb-6'>
                                <div className={`px-4 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${userData?.verificationStatus === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-primary/10 border-primary/20 text-primary'}`}>
                                    {userData?.verificationStatus === 'approved' ? 'Verified Elite' : 'Standard Account'}
                                </div>
                                <span className='text-white/20 text-[10px] font-black uppercase tracking-widest'>Identity: {userData?.verificationStatus || 'Unverified'}</span>
                            </div>
                            <h2 className='text-3xl font-black text-white uppercase tracking-tight mb-4'>
                                {userData?.verificationStatus === 'approved' ? 'Authorization Confirmed' : 'Identity Authorization'}
                            </h2>
                            <p className='text-white/40 text-sm leading-relaxed mb-8 max-w-lg'>
                                {userData?.verificationStatus === 'approved' 
                                    ? 'Your identity has been fully authorized. You have unrestricted access to our ultra-luxury fleet and priority owner chat features.'
                                    : 'To unlock premium luxury vehicles and higher speed limits, please complete your identity verification. Your data is protected by IdleWheels Shield.'
                                }
                            </p>
                            <button 
                                onClick={() => navigate('/user/my-bookings')}
                                className='px-8 py-4 bg-white text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-white transition-all flex items-center gap-3 group'
                            >
                                {userData?.verificationStatus === 'approved' ? 'View Active Rentals' : 'Complete Verification'}
                                <ChevronRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                            </button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className='space-y-6'>
                        <div className='glass rounded-3xl p-8 border border-white/5 hover:bg-white/[0.02] transition-all cursor-pointer group' onClick={() => navigate('/cars')}>
                            <h4 className='text-white font-black uppercase tracking-widest text-sm mb-2'>Explore Fleet</h4>
                            <p className='text-white/30 text-[10px] font-bold uppercase mb-4'>Browse the latest luxury additions</p>
                            <div className='w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-all'>
                                <ChevronRight className='w-4 h-4 text-primary group-hover:text-white' />
                            </div>
                        </div>
                        <div className='glass rounded-3xl p-8 border border-white/5 hover:bg-white/[0.02] transition-all cursor-pointer group' onClick={() => navigate('/user/my-bookings')}>
                            <h4 className='text-white font-black uppercase tracking-widest text-sm mb-2'>Rental History</h4>
                            <p className='text-white/30 text-[10px] font-bold uppercase mb-4'>Access records and invoices</p>
                            <div className='w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500 transition-all'>
                                <ChevronRight className='w-4 h-4 text-emerald-500 group-hover:text-white' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
