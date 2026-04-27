import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { Menu, X } from "lucide-react";
import NavHeader from "./ui/nav-header";

const menulinks = [
  { name: "Home", path: "/" },
  { name: "Cars", path: "/cars" },
  { name: "My Bookings", path: "/my-bookings" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" }
];

const Navbar = ({ setShowLogin }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { userData, logout } = useAppContext();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => setOpen(false));
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ${
        scrolled 
          ? "bg-[#030712]/90 backdrop-blur-3xl py-3 border-b border-white/5 shadow-2xl" 
          : "bg-transparent py-5"
      } px-6 md:px-16 lg:px-24 flex items-center justify-between`}
    >
      {/* Logo */}
      <Link to="/" className='flex items-center gap-3 group relative'>
        <div className="relative">
          <span className='text-xl md:text-2xl font-black font-heading tracking-tighter text-white uppercase'>
              Idle<span className='gradient-text-animated'>Wheels</span>
          </span>
          <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300"></div>
        </div>
      </Link>

      {/* Desktop Nav Links - Absolutely Centered for precision */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden lg:block">
        <NavHeader links={menulinks} />
      </div>

      {/* Desktop Actions */}
      <div className="hidden md:flex items-center gap-5">
        {userData ? (
          <div className="flex items-center gap-4">
            <Link to="/owner" className="btn-primary !px-5 !py-2.5 !text-[9px] !rounded-xl">
                Partner Portal
            </Link>
            <Link title="My Bookings" to="/my-bookings" className="w-10 h-10 rounded-xl glass border-white/10 flex items-center justify-center overflow-hidden hover:border-primary/30 transition-all">
                <img src={userData?.profilePicture || assets.user_profile} alt="Profile" className="w-full h-full object-cover" />
            </Link>
            <button onClick={logout} className="text-[9px] font-black uppercase tracking-widest text-white/25 hover:text-red-400 transition-colors">
                Logout
            </button>
          </div>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(245, 158, 11, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowLogin(true)} 
            className="btn-primary !px-8 !py-3 !rounded-xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            <span className="relative">Sign In</span>
          </motion.button>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button className='lg:hidden w-10 h-10 rounded-xl glass flex items-center justify-center border-white/10' onClick={() => setOpen(!open)}>
        {open ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
            />
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full max-w-[300px] bg-background/95 backdrop-blur-2xl border-l border-white/5 p-8 flex flex-col z-[1001]"
            >
               <div className="flex justify-between items-center mb-14">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Navigation</span>
                  <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg glass flex items-center justify-center">
                    <X className="w-4 h-4 text-white/60" />
                  </button>
               </div>
               <nav className="flex flex-col gap-6">
                  {menulinks.map((link, index) => (
                    <Link 
                      to={link.path} 
                      onClick={() => setOpen(false)} 
                      key={index} 
                      className={`text-2xl font-black uppercase transition-colors ${
                        location.pathname === link.path ? 'text-primary' : 'text-white hover:text-primary'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="h-px bg-white/5 my-4" />
                  {userData ? (
                     <div className="flex flex-col gap-6 mt-2">
                       <Link to="/owner" onClick={() => setOpen(false)} className="btn-primary w-full text-center py-4">Partner Portal</Link>
                       <button onClick={() => { logout(); setOpen(false); }} className="text-left text-red-500/70 hover:text-red-500 font-black uppercase tracking-widest text-xs transition-colors">Logout</button>
                     </div>
                  ) : (
                     <button onClick={() => { setShowLogin(true); setOpen(false); }} className="btn-primary w-full py-4 mt-2">Sign In</button>
                  )}
               </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;