import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import Loader from '../components/Loader';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { SearchX, ArrowLeft, ShieldCheck, CreditCard, FileText, Upload } from 'lucide-react';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUrl, token, userData, setUserData } = useAppContext();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  
  // Verification Modal State
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [drivingLicenceNumber, setDrivingLicenceNumber] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [dlFile, setDlFile] = useState(null);

  const fetchCarDetails = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/car/single/${id}`);
      if (response.data.success) {
        setCar(response.data.car);
      }
    } catch (error) {
      console.error("Error fetching car details:", error);
    }
    setLoading(false);
  }, [backendUrl, id]);

  useEffect(() => {
    Promise.resolve().then(() => fetchCarDetails());
  }, [fetchCarDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
        alert("Please sign in to confirm a booking.");
        return;
    }

    if (userData.verificationStatus !== 'approved') {
        setShowVerifyModal(true);
        return;
    }

    try {
        const response = await axios.post(`${backendUrl}/api/booking/place`, {
            userId: userData.id,
            carId: car._id,
            pickupDate,
            returnDate,
            totalPrice: car.pricePerDay * 2, // Simple calculation for demo
            pickupLocation: car.location
        }, { headers: { token } });

        if (response.data.success) {
            alert("Booking Confirmed!");
            navigate('/my-bookings');
        } else {
            alert(response.data.message);
        }
    } catch (error) {
        console.error(error);
        alert("Error placing booking.");
    }
  };

  const handleVerifyAndBook = async (e) => {
      e.preventDefault();
      setVerifying(true);
      const uploadFile = async (file) => {
          if (!file) return null;
          const formData = new FormData();
          formData.append('file', file);
          try {
              const res = await axios.post(`${backendUrl}/api/upload`, formData, {
                  headers: { 'Content-Type': 'multipart/form-data', token }
              });
              return res.data.success ? res.data.fileUrl : null;
          } catch (error) {
              console.error("Upload error:", error);
              return null;
          }
      };

      try {
          // Upload images first
          const aadhaarImageUrl = await uploadFile(aadhaarFile);
          const panImageUrl = await uploadFile(panFile);
          const dlImageUrl = await uploadFile(dlFile);

          if (!aadhaarImageUrl || !panImageUrl || !dlImageUrl) {
              alert("Please upload all required documents.");
              setVerifying(false);
              return;
          }

          const verifyRes = await axios.post(`${backendUrl}/api/user/verify-request`, {
              userId: userData.id,
              aadhaarNumber,
              aadhaarImage: aadhaarImageUrl,
              panNumber,
              panImage: panImageUrl,
              drivingLicenceNumber,
              drivingLicenceImage: dlImageUrl
          }, { headers: { token } });

          if (verifyRes.data.success) {
               // Update local state to 'pending'
               const updatedUser = { ...userData, verificationStatus: 'pending' };
               setUserData(updatedUser);
               localStorage.setItem('user', JSON.stringify(updatedUser));
               
               // Automatically proceed to booking
               const bookingRes = await axios.post(`${backendUrl}/api/booking/place`, {
                  userId: userData.id,
                  carId: car._id,
                  pickupDate,
                  returnDate,
                  totalPrice: car.pricePerDay * 2, // Simple calculation for demo
                  pickupLocation: car.location
               }, { headers: { token } });

               if (bookingRes.data.success) {
                   alert("Identity Submitted & Booking Request Sent! Awaiting Owner Approval.");
                   setShowVerifyModal(false);
                   navigate('/my-bookings');
               } else {
                   alert(bookingRes.data.message);
               }
          } else {
              alert(verifyRes.data.message);
          }
      } catch (error) {
          console.error(error);
          alert("Error verifying identity.");
      }
      setVerifying(false);
  };

  if (loading) return <Loader />;
  if (!car) return (
    <div className='min-h-[80vh] flex flex-col items-center justify-center px-6 pt-20 relative'>
      <div className='absolute inset-0 bg-[#030712] pointer-events-none' />
      <motion.div 
         initial={{ opacity: 0, scale: 0.95, y: 30 }}
         animate={{ opacity: 1, scale: 1, y: 0 }}
         transition={{ type: "spring", stiffness: 300, damping: 25 }}
         className='glass max-w-md w-full p-10 md:p-12 rounded-[2.5rem] text-center border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden z-10'
      >
         {/* Ambient Glow */}
         <div className='absolute -top-32 -right-32 w-64 h-64 bg-[#f59e0b]/20 blur-[100px] pointer-events-none rounded-full' />
         <div className='absolute -bottom-32 -left-32 w-64 h-64 bg-amber-600/10 blur-[100px] pointer-events-none rounded-full' />
         
         <div className='w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-inner group'>
             <SearchX className='w-10 h-10 text-[#f59e0b] opacity-80 group-hover:scale-110 transition-transform' strokeWidth={1.5} />
         </div>
         <h2 className='text-3xl font-black font-heading uppercase tracking-tighter text-white mb-3'>Vehicle Unavailable</h2>
         <p className='text-white/40 text-[10px] font-black uppercase tracking-[0.1em] leading-relaxed mb-8'>
             The vehicle signature is invalid or it has been temporarily retired from our active fleet.
         </p>
         <button onClick={() => navigate('/cars')} className='w-full h-14 bg-[#f59e0b] hover:bg-[#ea580c] text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-xl flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_-5px_rgba(245,158,11,0.5)] border border-[#fde68a]/20 hover:scale-[1.02] active:scale-[0.98] group overflow-hidden relative'>
             <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]'></div>
             <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform relative z-10' /> 
             <span className='relative z-10'>Return to Fleet</span>
         </button>
      </motion.div>
    </div>
  );

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 pb-20 bg-background min-h-screen relative z-10 pt-32 md:pt-40'>
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className='flex items-center justify-center gap-3 mb-12 h-12 px-6 glass border border-white/10 rounded-2xl w-fit group hover:bg-white/10 transition-all cursor-pointer shadow-[0_0_30px_-5px_rgba(245,158,11,0.2)]' 
        onClick={() => navigate('/cars')}
      >
        <ArrowLeft className='w-4 h-4 text-white/50 group-hover:text-white group-hover:-translate-x-1 transition-all' />
        <span className='text-[10px] font-black uppercase tracking-[0.2em] text-white/70 group-hover:text-white transition-colors mt-[1px]'>Return to Fleet</span>
      </motion.button>
      
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
        <div className='lg:col-span-2 space-y-12'>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='relative rounded-[2.5rem] overflow-hidden premium-shadow group'
          >
            <img src={car.images?.[0] || car.image} alt="" className='w-full h-auto md:max-h-[500px] object-cover transition-transform duration-700 group-hover:scale-105' />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
            <div className='absolute bottom-8 left-8'>
               <span className='px-4 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-widest mb-2 inline-block'>Available Now</span>
               <h1 className='text-4xl md:text-6xl font-black text-white font-heading'>{car.brand} {car.model}</h1>
            </div>
          </motion.div>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {[
              { icon: assets.users_icon, label: 'Capacity', value: `${car.seatingCapacity || car.seating_capacity} Seats` },
              { icon: assets.fuel_icon, label: 'Fuel', value: car.fuelType || car.fuel_type },
              { icon: assets.car_icon, label: 'Trans.', value: car.transmission },
              { icon: assets.location_icon, label: 'Location', value: car.location },
            ].map((item, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={index} 
                className='glass p-6 rounded-3xl flex flex-col items-center gap-3 border-white/5 hover:border-primary/20 transition-all'
              >
                <img src={item.icon} alt="" className='h-6 opacity-50'/>
                <div className='text-center'>
                    <p className='text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1'>{item.label}</p>
                    <p className='text-sm font-bold'>{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className='space-y-6'>
            <h2 className='text-3xl font-black font-heading'>About this vehicle</h2>
            <p className='text-muted-foreground text-lg leading-relaxed max-w-3xl'>
                {car.description}
            </p>
          </div>

            {car.video && (
             <div className='space-y-6'>
                <h2 className='text-3xl font-black font-heading'>Video Demonstration</h2>
                <div className='aspect-video rounded-[2rem] overflow-hidden glass border-white/10 shadow-2xl relative group'>
                    <iframe 
                        className='absolute inset-0 w-full h-full object-cover transition-opacity duration-500' 
                        src={car.video} 
                        title="Vehicle Video Demonstration" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen>
                    </iframe>
                </div>
             </div>
          )}
        </div>

        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className='lg:col-span-1'
        >
            <form onSubmit={handleSubmit} className='glass p-8 rounded-[2.5rem] sticky top-32 premium-shadow border-white/10 space-y-8'>
                <div className='flex items-end justify-between border-b border-white/10 pb-6'>
                    <div>
                        <p className='text-xs font-bold uppercase tracking-widest text-white/40 mb-1'>Daily Rate</p>
                        <span className='text-4xl font-black font-heading text-primary'>₹{car.pricePerDay}</span>
                    </div>
                </div>
                
                <div className='space-y-6'>
                    <div className='space-y-2'>
                        <label className='text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1'>Pickup Date</label>
                        <input 
                            type="date" 
                            className='w-full h-14 bg-white/5 border border-white/10 px-4 rounded-xl font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all text-white' 
                            required 
                            min={new Date().toISOString().split("T")[0]} 
                            onChange={(e) => setPickupDate(e.target.value)}
                        />
                    </div>
                    <div className='space-y-2'>
                        <label className='text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1'>Return Date</label>
                        <input 
                            type="date" 
                            className='w-full h-14 bg-white/5 border border-white/10 px-4 rounded-xl font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all text-white' 
                            required 
                            min={new Date().toISOString().split("T")[0]} 
                            onChange={(e) => setReturnDate(e.target.value)}
                        />
                    </div>
                </div>

                <button className='btn-primary w-full h-16 text-lg tracking-wide rounded-2xl'>Confirm Booking</button>
                <div className='flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30'>
                    <img src={assets.tick_icon} className='w-3 h-3 invert opacity-30' alt="" />
                    Insurance & Maintenance included
                </div>
            </form>
        </motion.div>
      </div>

      {/* Inline Checkout Verification Modal */}
      <AnimatePresence>
        {showVerifyModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-[2000] flex items-center justify-center bg-[#020617]/90 backdrop-blur-xl p-4'
          >
            <motion.div 
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className='glass w-full max-w-4xl rounded-[3rem] border border-white/10 p-10 md:p-14 shadow-[0_40px_100px_-20px_rgba(0,0,0,1)] relative max-h-[90vh] overflow-y-auto custom-scrollbar'
            >
              {/* Decorative Glows */}
              <div className='absolute -top-40 -right-40 w-96 h-96 bg-primary/20 blur-[120px] pointer-events-none rounded-full' />
              <div className='absolute -bottom-40 -left-40 w-96 h-96 bg-amber-500/10 blur-[120px] pointer-events-none rounded-full' />

              <button 
                onClick={() => setShowVerifyModal(false)}
                className='absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all z-20 group'
              >
                <X className='w-5 h-5 text-white/50 group-hover:text-white transition-colors' />
              </button>

              <div className='mb-12 text-center relative z-10 flex flex-col items-center'>
                <div className='w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 border border-primary/20 shadow-[0_0_50px_-10px_rgba(99,102,241,0.5)]'>
                    <ShieldCheck className='w-10 h-10 text-primary' />
                </div>
                <h2 className='text-4xl lg:text-5xl font-black font-heading uppercase tracking-tighter leading-none'>Renter Authorization</h2>
                <div className='flex items-center gap-3 mt-4'>
                    <div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
                    <p className='text-primary text-[10px] font-black uppercase tracking-[0.4em]'>Instant Verification Protocol</p>
                </div>
              </div>

              <form onSubmit={handleVerifyAndBook} className='space-y-10 relative z-10'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                    {/* Aadhaar Section */}
                    <div className='space-y-4 glass p-6 rounded-3xl border-white/5'>
                        <label className='flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1'>
                            <CreditCard className='w-4 h-4 text-primary' /> Aadhaar ID
                        </label>
                        <input type='text' required pattern="^\d{12}$" title="Aadhaar must be 12 digits" onChange={(e) => setAadhaarNumber(e.target.value)} value={aadhaarNumber} className='w-full h-14 bg-black/40 border border-white/10 px-5 rounded-2xl font-black tracking-[0.3em] outline-none focus:border-primary text-white transition-colors placeholder:text-white/10' placeholder='0000 0000 0000' />
                        <div className='w-full h-24 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group overflow-hidden relative'>
                             <input type='file' className='hidden' id='modal-aadhaar' accept="image/*" onChange={(e) => {
                                 const file = e.target.files[0];
                                 if (file) setAadhaarFile(file);
                             }} />
                             {aadhaarFile ? (
                                 <div className='flex items-center gap-3 text-emerald-400'>
                                     <CheckCircle className='w-5 h-5' />
                                     <span className='text-[10px] font-black uppercase tracking-widest'>Uploaded</span>
                                 </div>
                             ) : (
                                <label htmlFor='modal-aadhaar' className='flex flex-col items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 cursor-pointer w-full h-full justify-center group-hover:text-white transition-colors'>
                                    <Upload className='w-5 h-5' /> Upload Front View
                                </label>
                             )}
                        </div>
                    </div>

                    {/* PAN Section */}
                    <div className='space-y-4 glass p-6 rounded-3xl border-white/5'>
                        <label className='flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1'>
                            <FileText className='w-4 h-4 text-amber-500' /> PAN Card
                        </label>
                        <input type='text' required pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$" title="PAN format: ABCDE1234F" onChange={(e) => setPanNumber(e.target.value)} value={panNumber} className='w-full h-14 bg-black/40 border border-white/10 px-5 rounded-2xl font-black tracking-[0.3em] outline-none focus:border-amber-500 text-white transition-colors placeholder:text-white/10 uppercase' placeholder='ABCDE1234F' />
                        <div className='w-full h-24 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:border-amber-500/40 hover:bg-amber-500/5 transition-all group overflow-hidden relative'>
                             <input type='file' className='hidden' id='modal-pan' accept="image/*" onChange={(e) => {
                                 const file = e.target.files[0];
                                 if (file) setPanFile(file);
                             }} />
                             {panFile ? (
                                 <div className='flex items-center gap-3 text-emerald-400'>
                                     <CheckCircle className='w-5 h-5' />
                                     <span className='text-[10px] font-black uppercase tracking-widest'>Uploaded</span>
                                 </div>
                             ) : (
                                <label htmlFor='modal-pan' className='flex flex-col items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 cursor-pointer w-full h-full justify-center group-hover:text-white transition-colors'>
                                    <Upload className='w-5 h-5' /> Upload Document
                                </label>
                             )}
                        </div>
                    </div>

                    {/* DL Section - Full Width */}
                    <div className='md:col-span-2 space-y-4 glass p-8 rounded-[2.5rem] border-white/5'>
                        <label className='flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1'>
                            <ShieldCheck className='w-4 h-4 text-indigo-400' /> Driving Licence Credentials
                        </label>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <input type='text' required pattern="^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,11}$" title="Invalid DL Format" onChange={(e) => setDrivingLicenceNumber(e.target.value)} value={drivingLicenceNumber} className='w-full h-14 bg-black/40 border border-white/10 px-6 rounded-2xl font-black tracking-[0.3em] outline-none focus:border-indigo-400 text-white transition-colors placeholder:text-white/10 uppercase' placeholder='DL-00000000000' />
                            <div className='w-full h-14 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:border-indigo-400/40 hover:bg-indigo-400/5 transition-all group overflow-hidden relative'>
                                <input type='file' className='hidden' id='modal-dl' accept="image/*" onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) setDlFile(file);
                                }} />
                                {dlFile ? (
                                    <div className='flex items-center gap-3 text-emerald-400'>
                                        <CheckCircle className='w-4 h-4' />
                                        <span className='text-[10px] font-black uppercase tracking-widest'>Uploaded</span>
                                    </div>
                                ) : (
                                    <label htmlFor='modal-dl' className='flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 cursor-pointer w-full h-full justify-center group-hover:text-white transition-colors'>
                                        <Upload className='w-4 h-4' /> Upload License Copy
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='pt-6 flex justify-center'>
                    <motion.button 
                        whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(99,102,241,0.5)" }}
                        whileTap={{ scale: 0.98 }}
                        disabled={verifying} 
                        type='submit' 
                        className='px-12 h-16 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl flex items-center justify-center gap-4 transition-all shadow-[0_15px_40px_-10px_rgba(99,102,241,0.4)] border border-white/20 relative overflow-hidden group/btn disabled:opacity-50'
                    >
                        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite] pointer-events-none' />
                        <span className='relative z-10 flex items-center gap-4'>
                            {verifying ? (
                                <>
                                    <Loader2 className='w-5 h-5 animate-spin' />
                                    AUTHORIZING...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className='w-5 h-5 group-hover:rotate-12 transition-transform' />
                                    CONFIRM IDENTITY & BOOK
                                </>
                            )}
                        </span>
                    </motion.button>
                </div>
                
                <p className='text-center text-[9px] font-bold uppercase tracking-widest text-white/20 mt-6'>
                    Data is end-to-end encrypted and automatically processed via SecureShield™ protocol.
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CarDetails;
