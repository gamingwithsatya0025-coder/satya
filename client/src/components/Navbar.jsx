import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { Menu, X } from "lucide-react";
import NavHeader from "./ui/nav-header";

const menulinks = [
  { name: "Home", path: "/" },
  { name: "Cars", path: "/cars" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" }
];

const Navbar = ({ setShowLogin }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
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

  const { scrollYProgress } = useScroll();

  return (
    <nav
      className="fixed top-0 left-0 right-0 h-[80px] z-50 flex items-center justify-between px-6 md:px-16 lg:px-24 bg-[#030303] border-b border-white/5"
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
            <div className="relative flex items-center">
                <div 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className={`w-12 h-12 rounded-xl glass border flex items-center justify-center overflow-hidden transition-all cursor-pointer p-0.5 ${showProfileDropdown ? 'border-primary shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'border-white/10 hover:border-white/20'}`}
                >
                    <div className="w-full h-full rounded-lg overflow-hidden">
                        <img 
                          src={userData?.profilePicture && userData.profilePicture !== "null" && userData.profilePicture !== "" ? userData.profilePicture : assets.user_profile} 
                          onError={(e) => { e.target.onerror = null; e.target.src = assets.user_profile; }}
                          alt="Profile" 
                          className="w-full h-full object-cover" 
                        />
                    </div>
                </div>
                
                {/* Desktop Dropdown - Professional Minimalist */}
                <AnimatePresence>
                  {showProfileDropdown && (
                    <>
                      {/* Invisible Backdrop to close on click outside */}
                      <div className="fixed inset-0 z-[-1]" onClick={() => setShowProfileDropdown(false)} />
                      
                      <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          className="absolute right-0 top-full mt-3 w-[240px] bg-[#0A0A0A]/95 backdrop-blur-3xl border border-white/10 rounded-[1.5rem] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100]"
                      >
                          <div className="px-5 py-4 border-b border-white/5 mb-1">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-0.5">Verified Account</p>
                              <p className="text-sm font-bold text-white truncate">{userData.name || "Guest User"}</p>
                          </div>

                          <div className="p-1 space-y-1">
                              <Link 
                                to="/owner" 
                                onClick={() => setShowProfileDropdown(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all group/item"
                              >
                                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover/item:bg-primary/10 transition-colors">
                                      <img src={assets.carIcon} className="w-4 h-4 opacity-40 group-hover/item:opacity-100 brightness-0 invert transition-all" alt="" />
                                  </div>
                                  <span className="text-[11px] font-bold uppercase tracking-widest text-white/50 group-hover/item:text-white">Owner Portal</span>
                              </Link>
                              
                              <Link 
                                to="/user" 
                                onClick={() => setShowProfileDropdown(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all group/item"
                              >
                                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover/item:bg-blue-500/10 transition-colors">
                                      <img src={assets.listIcon} className="w-4 h-4 opacity-40 group-hover/item:opacity-100 brightness-0 invert transition-all" alt="" />
                                  </div>
                                  <span className="text-[11px] font-bold uppercase tracking-widest text-white/50 group-hover/item:text-white">Renter Portal</span>
                              </Link>
                          </div>
                          
                          <div className="h-px bg-white/5 my-1 mx-2" />
                          
                          <button 
                            onClick={() => { logout(); setShowProfileDropdown(false); }} 
                            className="w-full flex items-center gap-3 px-5 py-4 rounded-xl hover:bg-red-500/5 transition-all group/item"
                          >
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500/40 group-hover:bg-red-500 transition-colors" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-red-500/50 group-hover/item:text-red-500">Sign Out</span>
                          </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
            </div>
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
                       <Link to="/user" onClick={() => setOpen(false)} className="text-2xl font-black uppercase text-white hover:text-primary transition-colors">User Portal</Link>
                       <Link to="/owner" onClick={() => setOpen(false)} className="btn-primary w-full text-center py-4">Owner Mode</Link>
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