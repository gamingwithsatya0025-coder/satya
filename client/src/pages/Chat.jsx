import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Shield, CheckCircle, User, Car, Loader2, MessageSquare } from 'lucide-react';

const Chat = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userData, backendUrl, token } = useAppContext();
    const serverUrl = backendUrl || "http://localhost:4000";
    const [booking, setBooking] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const scrollRef = useRef(null);

    const fetchMessages = useCallback(async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/booking/get-messages?bookingId=${id}`, {
                headers: { token }
            });
            if (response.data.success) {
                setMessages(response.data.messages);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }, [id, backendUrl, token]);

    const fetchBooking = useCallback(async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/booking/list`, {
                headers: { token }
            });
            if (response.data.success) {
                const found = response.data.bookings.find(b => b._id === id);
                setBooking(found);
            }
        } catch (error) {
            console.error(error);
        }
    }, [id, backendUrl, token]);

    useEffect(() => {
        fetchBooking();
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
        return () => clearInterval(interval);
    }, [fetchBooking, fetchMessages]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || sending) return;

        setSending(true);
        try {
            const response = await axios.post(`${serverUrl}/api/booking/send-message`, {
                bookingId: id,
                text: input
            }, { headers: { token } });

            if (response.data.success) {
                setInput('');
                fetchMessages();
            } else {
                alert("Message Error: " + response.data.message);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Network Error: Could not connect to server.");
        }
        setSending(false);
    };

    if (!booking) return (
        <div className='h-screen bg-black flex items-center justify-center'>
            <Loader2 className='w-10 h-10 text-primary animate-spin' />
        </div>
    );

    const isUser = String(userData.id) === String(booking.user._id || booking.user);
    const partnerName = isUser ? "Vehicle Host" : (booking.user?.name || "Renter");

    return (
        <div className='h-screen bg-[#050505] flex flex-col'>
            {/* Header */}
            <div className='glass border-b border-white/5 p-6 flex items-center justify-between z-10'>
                <div className='flex items-center gap-6'>
                    <button onClick={() => navigate(-1)} className='p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all'>
                        <ArrowLeft className='w-5 h-5 text-white/50' />
                    </button>
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20'>
                            <User className='w-6 h-6 text-primary' />
                        </div>
                        <div>
                            <h3 className='font-black text-white uppercase tracking-tight'>{partnerName}</h3>
                            <div className='flex items-center gap-2'>
                                <div className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
                                <span className='text-[8px] font-black text-white/30 uppercase tracking-widest'>Secure Session Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='hidden md:flex items-center gap-6'>
                    <div className='text-right'>
                        <p className='text-[8px] font-black text-white/20 uppercase tracking-widest mb-1'>Deployment</p>
                        <p className='text-xs font-black text-white'>{booking.car?.brand} {booking.car?.model}</p>
                    </div>
                    <div className='w-px h-8 bg-white/10' />
                    <div className='flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20'>
                        <Shield className='w-3 h-3 text-emerald-500' />
                        <span className='text-[8px] font-black uppercase text-emerald-500 tracking-widest'>Elite Encryption</span>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className='flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/[0.02] via-transparent to-transparent'>
                {messages.length === 0 && (
                    <div className='flex flex-col items-center justify-center h-full text-center'>
                        <div className='w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5'>
                            <MessageSquare className='w-6 h-6 text-white/10' />
                        </div>
                        <p className='text-[9px] font-black uppercase tracking-[0.3em] text-white/20'>Channel established. Send a message to start.</p>
                    </div>
                )}
                <AnimatePresence>
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${String(msg.senderId) === String(userData.id) ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] md:max-w-[60%] p-5 rounded-[2rem] relative ${
                                String(msg.senderId) === String(userData.id) 
                                ? 'bg-primary text-white rounded-tr-none shadow-[0_10px_30px_-10px_rgba(99,102,241,0.5)]' 
                                : 'glass border border-white/10 text-white/80 rounded-tl-none'
                            }`}>
                                <p className='text-sm font-medium leading-relaxed'>{msg.text}</p>
                                <span className={`text-[8px] font-black uppercase tracking-widest mt-3 block ${msg.senderId === userData.id ? 'text-white/40' : 'text-white/20'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className='p-6 glass border-t border-white/5'>
                <form onSubmit={handleSend} className='max-w-5xl mx-auto relative'>
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Establish communication..."
                        className='w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-8 pr-20 text-white outline-none focus:border-primary/50 transition-all placeholder:text-white/20'
                        disabled={sending}
                    />
                    <button 
                        type="submit"
                        disabled={sending}
                        className='absolute right-2 top-2 bottom-2 w-12 rounded-xl bg-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50'
                    >
                        {sending ? <Loader2 className='w-5 h-5 text-white animate-spin' /> : <Send className='w-5 h-5 text-white' />}
                    </button>
                </form>
                <div className='mt-4 flex justify-center'>
                    <div className='flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-white/10'>
                        <CheckCircle className='w-3 h-3 text-emerald-500/40' />
                        End-to-End Encryption Active
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
