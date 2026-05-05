import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Mail, ArrowRight } from 'lucide-react'
import NavHeader from './ui/nav-header'

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-background text-white pt-32 pb-12 border-t border-white/5 relative overflow-hidden w-full">
        {/* Ambient glow */}
        <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[150px] pointer-events-none rounded-full' />

        <div className="w-full px-6 md:px-12 lg:px-20 max-w-7xl mx-auto relative z-10">


            {/* Main Footer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-12">
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="text-3xl font-black tracking-tighter font-heading uppercase">
                            IDLE<span className="gradient-text-animated">WHEELS</span>
                        </span>
                    </div>
                    <p className="text-white/35 max-w-sm mb-10 leading-relaxed font-medium">
                        Redefining the gold standard of premium car rentals. We provide world-class automobiles and unparalleled luxury service for your most distinguished journeys.
                    </p>
                    <div className="flex gap-3">
                        {['facebook', 'twitter', 'instagram'].map((platform) => (
                            <motion.a 
                                whileHover={{ y: -4, scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                key={platform} 
                                href="#" 
                                className="w-12 h-12 rounded-2xl glass border-white/5 hover:border-primary/30 flex items-center justify-center transition-all hover:bg-primary/10"
                            >
                                <img src={assets[`${platform}_logo`]} alt={platform} className="w-5 h-5 invert opacity-50 hover:opacity-100 transition-opacity" />
                            </motion.a>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/25 mb-8">Quick Links</h4>
                    <ul className="flex flex-col gap-4 text-white/45 font-bold text-sm">
                        <li><Link to="/" className="hover:text-primary hover:translate-x-1 transition-all inline-block">Home Overview</Link></li>
                        <li><Link to="/cars" className="hover:text-primary hover:translate-x-1 transition-all inline-block">Explore Fleet</Link></li>
                        <li><Link to="/user/my-bookings" className="hover:text-primary hover:translate-x-1 transition-all inline-block">Manage Bookings</Link></li>
                        <li><Link to="/about" className="hover:text-primary hover:translate-x-1 transition-all inline-block">About Us</Link></li>
                        <li><Link to="/contact" className="hover:text-primary hover:translate-x-1 transition-all inline-block">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/25 mb-8">Contact Concierge</h4>
                    <ul className="flex flex-col gap-5 text-white/45 font-bold text-sm">
                        <li className="flex items-center gap-4">
                            <span className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] text-primary font-black">E</span>
                            concierge@idlewheels.com
                        </li>
                        <li className="flex items-center gap-4">
                            <span className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] text-primary font-black">P</span>
                            +91 (800) 123-4567
                        </li>
                        <li className="flex items-center gap-4">
                            <span className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] text-primary font-black">L</span>
                            Visakhapatnam, Andhra
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-white/15 text-[10px] font-black uppercase tracking-widest">
                <p>© 2026 IDLEWHEELS. Crafted for Excellence by Team IdleWheels.</p>
                <NavHeader links={[
                    { name: 'Privacy', path: '#' },
                    { name: 'Terms', path: '#' },
                    { name: 'Cookies', path: '#' }
                ]} />
            </div>
        </div>
    </footer>
  )
}

export default Footer;
