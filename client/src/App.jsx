import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { Routes, Route,  useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';
import MyBookings from './pages/MyBookings';
import About from './pages/About';
import Contact from './pages/Contact';
import Layout from './pages/owner/Layout';
import Dashboard from './pages/owner/Dashboard';
import ManageCars from './pages/owner/ManageCars';
import ManageBookings from './pages/owner/ManageBookings';
import AddCar from './pages/owner/AddCar';
import VerifyIdentity from './pages/owner/VerifyIdentity';

import Footer from './components/Footer';
import Login from './components/Login';
import GlobalBackButton from './components/GlobalBackButton';
import Chatbot from './components/Chatbot';
import { AnimatePresence, motion } from 'framer-motion';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const isOwnerPath = location.pathname.startsWith('/owner');

  return (
    <div className='font-sans text-foreground bg-background min-h-screen selection:bg-primary/30 selection:text-primary'>
      <Login show={showLogin} setShow={setShowLogin} />
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin}/> }
      <Chatbot />
      
      <AnimatePresence mode="wait">
        <motion.div
           key={location.pathname}
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 0.2 }}
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/car-details/:id" element={<CarDetails />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/owner" element={<Layout />} >
              <Route index element={<Dashboard />} />
              <Route path="manage-cars" element={<ManageCars />} />
              <Route path="manage-bookings" element={<ManageBookings />} />
              <Route path="add-car" element={<AddCar />} />
              <Route path="verify-identity" element={<VerifyIdentity />} />
            </Route>
          </Routes>
        </motion.div>
      </AnimatePresence>

      {!isOwnerPath && <Footer /> }
    </div>
  )
}

export default App
