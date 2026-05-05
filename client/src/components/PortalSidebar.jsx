import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import axios from 'axios'
import { motion } from 'framer-motion'

const PortalSidebar = ({ menuLinks, roleTitle, switchRolePath, switchRoleLabel }) => {
  const { userData, setUserData, backendUrl, token } = useAppContext()
  const user = userData || {};
  const location = useLocation()
  const navigate = useNavigate()
  const [image, setImage] = useState(null)
  
  const updateImage = async () => {
    if (!image) return;
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = async () => {
        try {
            const res = await axios.post(`${backendUrl}/api/user/update-dp`, { userId: user.id, image: reader.result }, { headers: { token } });
            if (res.data.success) {
                const updatedUser = { ...user, profilePicture: reader.result };
                setUserData(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setImage(null);
            }
        } catch (error) {
            console.error(error);
        }
    }
  }

  return ( 
    <div className='hidden md:flex flex-col w-72 min-h-screen glass border-r border-white/10 shrink-0 sticky top-0'>
      <div className='flex flex-col items-center pt-12 pb-8 border-b border-white/5 bg-white/[0.02]'>
        <div className='group relative mb-4'>
          <label htmlFor="sidebar-image">
            <img 
                src={image ? URL.createObjectURL(image) : user?.profilePicture || assets.user_profile} 
                alt="" 
                className='w-24 h-24 rounded-2xl object-cover border-2 border-white/10 premium-shadow transition-all duration-500 group-hover:rounded-[2rem]' 
            />
            <input type="file" id='sidebar-image' accept="image/*" hidden onChange={e=>setImage(e.target.files[0])} />
            <div className='absolute inset-0 bg-primary/20 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-500 backdrop-blur-sm group-hover:rounded-[2rem]'>
              <img src={assets.edit_icon} alt="Edit" className='w-6 h-6 invert' />
            </div>
          </label>
        </div>
        {image && (
          <button onClick={updateImage} className='px-4 py-1.5 bg-primary hover:bg-primary/80 text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all mb-4 shadow-lg shadow-primary/20'>
            Save Profile
          </button>
        )}
        <h3 className='font-black text-xl tracking-tight text-white mb-1'>{user?.name || "Guest User"}</h3>
        <div className='flex items-center gap-2'>
            <div className='w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse' />
            <p className='text-[10px] uppercase font-black tracking-[0.2em] text-white/40'>{roleTitle}</p>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto px-6 py-8 space-y-3'>
        {menuLinks.map((link, index) => {
          const isActive = link.path === location.pathname;
          return (
            <NavLink 
                key={index} 
                to={link.path} 
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 group ${isActive ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' : 'hover:bg-white/5 text-white/40 hover:text-white'}`}
            >
              <img 
                src={link.icon} 
                alt="icon" 
                className={`w-5 h-5 transition-all duration-500 ${isActive ? 'brightness-0 invert' : 'opacity-40 group-hover:opacity-100'}`} 
              />
              <span className='text-xs font-black uppercase tracking-widest'>
                  {link.name}
              </span>
            </NavLink>
          );
        })}
      </div>

      {/* Role Switcher */}
      <div className='p-6 border-t border-white/5'>
          <button 
            onClick={() => navigate(switchRolePath)}
            className='w-full py-4 rounded-2xl bg-gradient-to-r from-white/5 to-white/[0.02] hover:from-primary/20 hover:to-primary/5 border border-white/10 hover:border-primary/40 transition-all duration-500 flex flex-col items-center justify-center gap-1 group relative overflow-hidden'
          >
              <div className='absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500' />
              <div className='relative z-10 flex items-center gap-3'>
                <span className='text-[8px] font-black uppercase tracking-[0.3em] text-primary/60 group-hover:text-primary transition-colors'>Switch Context</span>
              </div>
              <div className='relative z-10 flex items-center gap-2'>
                <span className='text-[10px] font-black uppercase tracking-widest text-white group-hover:scale-110 transition-transform'>
                    {switchRoleLabel}
                </span>
              </div>
          </button>
      </div>
    </div>
  )
}

export default PortalSidebar
