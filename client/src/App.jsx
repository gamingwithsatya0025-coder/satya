import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import { Routes, Route,  useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';
import Chat from './pages/Chat';
import About from './pages/About';
import Contact from './pages/Contact';

// Portal Components
import OwnerLayout from './pages/owner/Layout';
import OwnerDashboard from './pages/owner/Dashboard';
import ManageCars from './pages/owner/ManageCars';
import ManageBookings from './pages/owner/ManageBookings';
import AddCar from './pages/owner/AddCar';

import UserLayout from './pages/user/Layout';
import UserDashboard from './pages/user/Dashboard';
import MyBookings from './pages/user/MyBookings';
import Payments from './pages/user/Payments';
import Verify from './pages/user/Verify';

import Footer from './components/Footer';
import Login from './components/Login';
import Chatbot from './components/Chatbot';
import { AnimatePresence, motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const isPortal = location.pathname.startsWith('/owner') || location.pathname.startsWith('/user');

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-in-out',
    });
  }, []);

  return (
    <div className='font-sans text-foreground bg-background min-h-screen selection:bg-primary/30 selection:text-primary'>
      <Login show={showLogin} setShow={setShowLogin} />
      {!isPortal && <Navbar setShowLogin={setShowLogin}/> }
      <Chatbot />
      
      {!isPortal && <div className='h-[80px] w-full bg-[#030303]' />}

      <AnimatePresence mode="wait">
          <motion.div
             key={location.pathname}
             initial={{ opacity: 0, filter: "blur(10px)" }}
             animate={{ opacity: 1, filter: "blur(0px)" }}
             exit={{ opacity: 0, filter: "blur(10px)" }}
             transition={{ duration: 0.3 }}
          >
            <Routes location={location}>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/cars" element={<Cars />} />
              <Route path="/car-details/:id" element={<CarDetails />} />
              <Route path="/chat/:id" element={<Chat />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/my-bookings" element={<Navigate to="/user/my-bookings" replace />} />

              {/* User Portal */}
              <Route path="/user" element={<UserLayout />} >
                <Route index element={<UserDashboard />} />
                <Route path="my-bookings" element={<MyBookings />} />
                <Route path="payments" element={<Payments />} />
                <Route path="verify" element={<Verify />} />
              </Route>

              {/* Owner Portal */}
              <Route path="/owner" element={<OwnerLayout />} >
                <Route index element={<OwnerDashboard />} />
                <Route path="manage-cars" element={<ManageCars />} />
                <Route path="manage-bookings" element={<ManageBookings />} />
                <Route path="add-car" element={<AddCar />} />
                <Route path="verify" element={<Verify />} />
              </Route>
            </Routes>
          </motion.div>
      </AnimatePresence>

      {!isPortal && <Footer /> }
    </div>
  )
}

export default App
