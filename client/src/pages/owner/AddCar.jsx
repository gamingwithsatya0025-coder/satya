import React, { useState, useEffect } from 'react';
import PortalTitle from '../../components/PortalTitle';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, X, CheckCircle, ImagePlus, Video, Loader2, Info, CarFront, Zap, Users, IndianRupee, MapPin, AlignLeft } from 'lucide-react';

const AddCar = () => {
    const { userData, backendUrl, token, fetchCars } = useAppContext();
    const navigate = useNavigate();
    
    // State for media
    const [images, setImages] = useState([]);
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(false);

    const [car, setCar] = useState({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        pricePerDay: '',
        category: '',
        transmission: '',
        fuel_type: '',
        seating_capacity: '',
        location: '',
        description: '',
    });

    useEffect(() => {
        if (!userData) {
            navigate('/');
        }
    }, [userData, navigate]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 5) {
            alert("You can upload a maximum of 5 photos.");
            return;
        }
        setImages([...images, ...files]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        if (images.length < 4) {
            alert("Please upload at least 4 photos of your car.");
            return;
        }
        if (!video) {
            alert("Please upload 1 video demonstration of your car.");
            return;
        }

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

        setLoading(true);
        try {
            // Upload all images
            const imageUrls = await Promise.all(images.map(img => uploadFile(img)));
            const videoUrl = await uploadFile(video);

            if (imageUrls.includes(null) || !videoUrl) {
                alert("Error uploading media. Please try again.");
                setLoading(false);
                return;
            }

            const payload = {
                ...car,
                images: imageUrls,
                video: videoUrl,
                ownerId: userData.id,
                fuelType: car.fuel_type,
                seatingCapacity: car.seating_capacity,
                features: "[]",
            };

            const response = await axios.post(`${backendUrl}/api/car/add`, payload, {
                headers: { token }
            });

            if (response.data.success) {
                alert("Car listed successfully!");
                fetchCars();
                navigate('/owner/manage-cars');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Error adding car.");
        }
        setLoading(false);
    };

    const inputClasses = "w-full h-14 bg-zinc-950/40 border border-white/5 px-5 rounded-2xl font-medium outline-none focus:border-[#f59e0b]/50 focus:bg-zinc-950 transition-all text-white placeholder:text-white/20 hover:bg-white/[0.02]";
    const labelClasses = "text-[10px] font-black uppercase tracking-widest text-[#f59e0b] ml-2 mb-2 block flex items-center gap-1.5";

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='px-4 py-10 md:px-10 flex-1 w-full max-w-5xl mx-auto'
        >
            <div className='flex items-center justify-between mb-8'>
                <PortalTitle title="List Your Vehicle" subTitle="Upload high-quality media and precise details" />
                {(!userData?.verificationStatus || userData?.verificationStatus !== 'approved') && (
                    <motion.button 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => navigate('/user/verify')}
                        className='hidden md:flex items-center gap-4 px-5 py-3 glass border border-primary/30 rounded-2xl bg-primary/10 hover:bg-primary/20 transition-all group'
                    >
                        <div className='relative'>
                            <div className='w-2.5 h-2.5 bg-primary rounded-full animate-ping absolute inset-0 opacity-40'></div>
                            <div className='w-2.5 h-2.5 bg-primary rounded-full relative z-10'></div>
                        </div>
                        <div className='text-left'>
                            <p className='text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-0.5'>Verification Pending</p>
                            <p className='text-[8px] font-bold text-white/40 uppercase tracking-widest group-hover:text-white/60 transition-colors'>Secure your account — <span className='text-white underline decoration-primary/40'>Verify Now</span></p>
                        </div>
                    </motion.button>
                )}
            </div>
            
            <form onSubmit={onSubmitHandler} className='space-y-8'>
                
                {/* Media Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className='glass p-8 md:p-10 rounded-[2rem] border border-white/5 premium-shadow relative overflow-hidden group'
                >
                    <div className='absolute inset-0 bg-gradient-to-br from-[#f59e0b]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none'></div>
                    
                    <div className='relative z-10'>
                        <h3 className='text-2xl font-black font-heading flex items-center gap-3 mb-8 tracking-tighter'>
                            <div className='p-2 bg-[#f59e0b]/10 rounded-xl border border-[#f59e0b]/20'>
                                <ImagePlus className='w-5 h-5 text-[#f59e0b]' />
                            </div>
                            Visual Media
                        </h3>
                        
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                            {/* Images Upload */}
                            <div className='space-y-4 bg-zinc-900/40 p-6 rounded-3xl border border-white/5'>
                                <div className='flex justify-between items-center mb-1'>
                                    <p className='text-xs font-black uppercase tracking-widest text-white/50 flex items-center gap-2'>
                                        <ImagePlus className='w-4 h-4 text-white/30' /> Photos
                                    </p>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${images.length >= 4 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500'}`}>
                                        {images.length}/5 (Min 4)
                                    </span>
                                </div>
                                <div className='flex flex-wrap gap-4'>
                                    <AnimatePresence>
                                        {images.map((img, index) => (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                key={index} 
                                                className='relative w-[88px] h-[88px] rounded-2xl overflow-hidden group border border-white/10 shadow-lg'
                                            >
                                                <img src={URL.createObjectURL(img)} alt="" className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' />
                                                <button 
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className='absolute inset-0 bg-red-500/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-sm'
                                                >
                                                    <X className='w-6 h-6 text-white' />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    
                                    {images.length < 5 && (
                                        <label className='w-[88px] h-[88px] border-2 border-dashed border-white/10 hover:border-[#f59e0b]/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-white/5 hover:bg-[#f59e0b]/5 transition-all group shadow-inner'>
                                            <input type="file" multiple accept='image/*' hidden onChange={handleImageChange} />
                                            <UploadCloud className='w-6 h-6 text-white/30 group-hover:text-[#f59e0b] transition-colors mb-1' />
                                            <span className='text-[8px] font-bold uppercase tracking-widest text-white/30 group-hover:text-[#f59e0b]'>Upload</span>
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Video Upload */}
                            <div className='space-y-4 bg-zinc-900/40 p-6 rounded-3xl border border-white/5 flex flex-col'>
                                <div className='flex justify-between items-center mb-1'>
                                    <p className='text-xs font-black uppercase tracking-widest text-white/50 flex items-center gap-2'>
                                        <Video className='w-4 h-4 text-white/30' /> Video Demo
                                    </p>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${video ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500'}`}>
                                        {video ? '1/1' : '0/1 (Required)'}
                                    </span>
                                </div>
                                <div className='flex-1 relative w-full min-h-[140px] border-2 border-dashed border-white/10 hover:border-[#f59e0b]/50 rounded-2xl flex items-center justify-center bg-white/[0.02] hover:bg-[#f59e0b]/5 transition-all overflow-hidden group shadow-inner'>
                                    {video ? (
                                        <div className='flex flex-col items-center justify-center z-10 w-full h-full glass backdrop-blur-md absolute inset-0'>
                                            <div className='w-12 h-12 bg-[#f59e0b]/20 rounded-full flex items-center justify-center mb-3 border border-[#f59e0b]/30'>
                                                <Video className='w-5 h-5 text-[#f59e0b]' />
                                            </div>
                                            <span className='font-bold text-sm text-white max-w-[80%] truncate'>{video.name}</span>
                                            <button type="button" onClick={() => setVideo(null)} className='mt-3 flex items-center gap-1 text-red-400 text-[10px] font-black uppercase tracking-widest bg-red-400/10 px-3 py-1.5 rounded-lg hover:bg-red-400/20 transition-colors'>
                                                <X className='w-3 h-3' /> Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <label className='cursor-pointer flex flex-col items-center justify-center w-full h-full absolute inset-0'>
                                            <input type="file" accept='video/*' hidden onChange={e => setVideo(e.target.files[0])} />
                                            <div className='w-14 h-14 rounded-full bg-white/5 group-hover:bg-[#f59e0b]/10 group-hover:scale-110 flex items-center justify-center transition-all mb-3'>
                                                <UploadCloud className='w-6 h-6 text-white/30 group-hover:text-[#f59e0b] transition-colors' />
                                            </div>
                                            <span className='text-[10px] font-black uppercase tracking-widest text-white/30 group-hover:text-[#f59e0b]'>Click or Drag Video</span>
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Details Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className='glass p-8 md:p-10 rounded-[2rem] border border-white/5 premium-shadow relative overflow-hidden'
                >
                    <div className='absolute -right-20 -top-20 w-64 h-64 bg-[#f59e0b]/10 rounded-full blur-3xl pointer-events-none'></div>

                    <h3 className='text-2xl font-black font-heading flex items-center gap-3 mb-8 tracking-tighter relative z-10'>
                        <div className='p-2 bg-[#f59e0b]/10 rounded-xl border border-[#f59e0b]/20'>
                            <CarFront className='w-5 h-5 text-[#f59e0b]' />
                        </div>
                        Vehicle Specifications
                    </h3>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mb-6'>
                        <div>
                            <label className={labelClasses}>Brand</label>
                            <input type="text" placeholder='e.g. Mercedes-Benz' required className={inputClasses} value={car.brand} onChange={e => setCar({ ...car, brand: e.target.value })} />
                        </div>
                        <div>
                            <label className={labelClasses}>Model</label>
                            <input type="text" placeholder='e.g. S-Class Maybach' required className={inputClasses} value={car.model} onChange={e => setCar({ ...car, model: e.target.value })} />
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10 mb-6'>
                        <div>
                            <label className={labelClasses}>Year</label>
                            <input type="number" placeholder="2024" required className={inputClasses} value={car.year} onChange={e => setCar({ ...car, year: e.target.value })} />
                        </div>
                        <div className='md:col-span-2'>
                            <label className={labelClasses}><IndianRupee className='w-3 h-3' /> Daily Price</label>
                            <input type="number" placeholder="₹15000" required className={`${inputClasses} font-black text-[#f59e0b] text-lg pl-6`} value={car.pricePerDay} onChange={e => setCar({ ...car, pricePerDay: e.target.value })} />
                        </div>
                        <div>
                            <label className={labelClasses}>Category</label>
                            <div className='relative'>
                                <select onChange={e => setCar({ ...car, category: e.target.value })} value={car.category} className={`${inputClasses} appearance-none cursor-pointer pr-10 hover:text-white`}>
                                    <option value="" className='bg-zinc-950 text-white/50'>Select</option>
                                    <option value="Sedan" className='bg-zinc-950'>Sedan</option>
                                    <option value="SUV" className='bg-zinc-950'>SUV</option>
                                    <option value="Luxury" className='bg-zinc-950'>Luxury</option>
                                    <option value="Sports" className='bg-zinc-950'>Sports</option>
                                </select>
                                <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'>
                                    <div className='w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-white/30'></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 mb-6'>
                        <div>
                            <label className={labelClasses}><Zap className='w-3 h-3' /> Transmission</label>
                            <div className='relative'>
                                <select onChange={e => setCar({ ...car, transmission: e.target.value })} value={car.transmission} className={`${inputClasses} appearance-none cursor-pointer pr-10 hover:text-white`}>
                                    <option value="" className='bg-zinc-950 text-white/50'>Select</option>
                                    <option value="Manual" className='bg-zinc-950'>Manual</option>
                                    <option value="Automatic" className='bg-zinc-950'>Automatic</option>
                                </select>
                                <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'><div className='w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-white/30'></div></div>
                            </div>
                        </div>
                        <div>
                            <label className={labelClasses}>Fuel Type</label>
                            <div className='relative'>
                                <select onChange={e => setCar({ ...car, fuel_type: e.target.value })} value={car.fuel_type} className={`${inputClasses} appearance-none cursor-pointer pr-10 hover:text-white`}>
                                    <option value="" className='bg-zinc-950 text-white/50'>Select</option>
                                    <option value="Petrol" className='bg-zinc-950'>Petrol</option>
                                    <option value="Diesel" className='bg-zinc-950'>Diesel</option>
                                    <option value="Electric" className='bg-zinc-950'>Electric</option>
                                </select>
                                <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'><div className='w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-white/30'></div></div>
                            </div>
                        </div>
                        <div>
                            <label className={labelClasses}><Users className='w-3 h-3' /> Seats</label>
                            <input type="number" placeholder="4" required className={inputClasses} value={car.seating_capacity} onChange={e => setCar({ ...car, seating_capacity: e.target.value })} />
                        </div>
                    </div>

                    <div className='relative z-10 mb-6'>
                        <label className={labelClasses}><MapPin className='w-3 h-3' /> Hub Location</label>
                        <input type="text" placeholder='e.g. Visakhapatnam' required className={inputClasses} value={car.location} onChange={e => setCar({ ...car, location: e.target.value })} />
                    </div>

                    <div className='relative z-10 mb-8'>
                        <label className={labelClasses}><AlignLeft className='w-3 h-3' /> Description</label>
                        <textarea rows={4} placeholder="Describe the condition, special features, and any rules..." required className='w-full bg-zinc-950/40 border border-white/5 px-5 py-4 rounded-3xl font-medium outline-none focus:border-[#f59e0b]/50 focus:bg-zinc-950 transition-all text-white resize-none placeholder:text-white/20 hover:bg-white/[0.02]' value={car.description} onChange={e => setCar({ ...car, description: e.target.value })}></textarea>
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading} 
                        className='w-full h-16 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all relative overflow-hidden group disabled:opacity-70 cursor-pointer'
                    >
                        {/* Button Background with animated gradient */}
                        <div className='absolute inset-0 bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#f59e0b] bg-[length:200%_100%] animate-gradient-x'></div>
                        <div className='absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity'></div>
                        <div className='absolute -top-[1px] inset-x-4 h-[1px] bg-white/30'></div>
                        
                        <div className='relative z-10 flex items-center gap-3 text-white'>
                            {loading ? (
                                <>
                                    <Loader2 className='w-5 h-5 animate-spin' />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className='w-5 h-5' />
                                    Publish Listing
                                </>
                            )}
                        </div>
                    </motion.button>
                </motion.div>
                
                <div className='flex items-start gap-2 justify-center mt-6 text-white/30 text-[10px] font-bold uppercase tracking-widest text-center'>
                    <Info className='w-3 h-3 mt-[1px]' />
                    <p>All listings undergo a brief verification check before going live on the platform.</p>
                </div>
            </form>
        </motion.div>
    );
};

export default AddCar;
