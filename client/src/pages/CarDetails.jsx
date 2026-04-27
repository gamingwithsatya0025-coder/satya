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
      try {
          const dummyImage = "https://placeholder.com/doc.png";
          const verifyRes = await axios.post(`${backendUrl}/api/user/verify-request`, {
              userId: userData.id,
              aadhaarNumber,
              aadhaarImage: dummyImage,
              panNumber,
              panImage: dummyImage,
              drivingLicenceNumber,
              drivingLicenceImage: dummyImage
          }, { headers: { token } });

          if (verifyRes.data.success) {
               const updatedUser = { ...userData, verificationStatus: 'approved' };
               setUserData(updatedUser);
               localStorage.setItem('user', JSON.stringify(updatedUser));
               setShowVerifyModal(false);
               
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
                   alert("Identity Auto-Approved & Booking Confirmed!");
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
              className='glass w-full max-w-3xl rounded-[2.5rem] border border-white/10 p-10 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,1)] relative max-h-[90vh] overflow-y-auto custom-scrollbar'
            >
              {/* Ambient Glows */}
              <div className='absolute -top-32 -right-32 w-64 h-64 bg-[#f59e0b]/20 blur-[100px] pointer-events-none rounded-full' />
              <div className='absolute -bottom-32 -left-32 w-64 h-64 bg-amber-600/10 blur-[100px] pointer-events-none rounded-full' />

              <button 
                onClick={() => setShowVerifyModal(false)}
                className='absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors z-20 group'
              >
                <img src={assets.close_icon} alt="Close" className='w-4 h-4 invert opacity-50 group-hover:opacity-100 transition-opacity' />
              </button>

              <div className='mb-10 text-center relative z-10 flex flex-col items-center'>
                <div className='w-16 h-16 bg-[#f59e0b]/20 rounded-2xl flex items-center justify-center mb-6 border border-[#f59e0b]/30 shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]'>
                    <ShieldCheck className='w-8 h-8 text-[#f59e0b]' />
                </div>
                <h2 className='text-3xl lg:text-4xl font-black font-heading uppercase tracking-tighter'>Renter Verification</h2>
                <p className='text-[#f59e0b] text-[11px] font-black uppercase tracking-[0.2em] mt-3'>Instant Auto-Approval Security Protocol</p>
              </div>

              <form onSubmit={handleVerifyAndBook} className='space-y-8 relative z-10'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    {/* Aadhaar Section */}
                    <div className='space-y-3'>
                        <label className='flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-1'>
                            <CreditCard className='w-3 h-3' /> Aadhaar ID
                        </label>
                        <input type='text' required maxLength="12" onChange={(e) => setAadhaarNumber(e.target.value)} value={aadhaarNumber} className='w-full h-14 bg-[#020617]/50 border border-white/10 px-5 rounded-2xl font-black tracking-[0.2em] outline-none focus:border-[#f59e0b]/50 text-white transition-colors placeholder:text-white/20' placeholder='0000 0000 0000' />
                    </div>
                    <div className='space-y-3'>
                        <label className='flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-1'>
                             Proof of Aadhaar
                        </label>
                        <div className='w-full h-14 bg-[#020617]/50 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:border-[#f59e0b]/50 hover:bg-[#f59e0b]/5 transition-all group'>
                            <input type='file' className='hidden' id='modal-aadhaar' />
                            <label htmlFor='modal-aadhaar' className='flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 cursor-pointer w-full justify-center group-hover:text-[#f59e0b] transition-colors'>
                                <Upload className='w-4 h-4' /> Secure Upload
                            </label>
                        </div>
                    </div>

                    {/* PAN Section */}
                    <div className='space-y-3'>
                        <label className='flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-1'>
                            <FileText className='w-3 h-3' /> PAN Number
                        </label>
                        <input type='text' required maxLength="10" onChange={(e) => setPanNumber(e.target.value)} value={panNumber} className='w-full h-14 bg-[#020617]/50 border border-white/10 px-5 rounded-2xl font-black tracking-[0.2em] outline-none focus:border-[#f59e0b]/50 text-white transition-colors placeholder:text-white/20 uppercase' placeholder='ABCDE1234F' />
                    </div>
                    <div className='space-y-3'>
                        <label className='flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-1'>
                            Proof of PAN
                        </label>
                        <div className='w-full h-14 bg-[#020617]/50 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:border-[#f59e0b]/50 hover:bg-[#f59e0b]/5 transition-all group'>
                            <input type='file' className='hidden' id='modal-pan' />
                            <label htmlFor='modal-pan' className='flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 cursor-pointer w-full justify-center group-hover:text-[#f59e0b] transition-colors'>
                                <Upload className='w-4 h-4' /> Secure Upload
                            </label>
                        </div>
                    </div>

                    {/* DL Section */}
                    <div className='space-y-3'>
                        <label className='flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-1'>
                            <CreditCard className='w-3 h-3' /> Driving Licence
                        </label>
                        <input type='text' required maxLength="16" onChange={(e) => setDrivingLicenceNumber(e.target.value)} value={drivingLicenceNumber} className='w-full h-14 bg-[#020617]/50 border border-white/10 px-5 rounded-2xl font-black tracking-[0.2em] outline-none focus:border-[#f59e0b]/50 text-white transition-colors placeholder:text-white/20 uppercase' placeholder='DL-00000000000' />
                    </div>
                    <div className='space-y-3'>
                        <label className='flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-1'>
                            Proof of DL
                        </label>
                        <div className='w-full h-14 bg-[#020617]/50 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:border-[#f59e0b]/50 hover:bg-[#f59e0b]/5 transition-all group'>
                            <input type='file' className='hidden' id='modal-dl' />
                            <label htmlFor='modal-dl' className='flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 cursor-pointer w-full justify-center group-hover:text-[#f59e0b] transition-colors'>
                                <Upload className='w-4 h-4' /> Secure Upload
                            </label>
                        </div>
                    </div>
                </div>

                <div className='pt-4'>
                    <button disabled={verifying} type='submit' className='w-full h-16 bg-[#f59e0b] hover:bg-[#ea580c] text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_-5px_rgba(245,158,11,0.5)] border border-[#fde68a]/20 relative overflow-hidden group'>
                        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]'></div>
                        <span className='relative z-10'>
                            {verifying ? 'VERIFYING CREDENTIALS...' : 'AUTHORIZE IDENTITY & CONFIRM BOOKING'}
                        </span>
                    </button>
                    <p className='text-center text-[9px] font-bold uppercase tracking-widest text-white/30 mt-4'>
                        Data is end-to-end encrypted and automatically destroyed after verification.
                    </p>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CarDetails;
