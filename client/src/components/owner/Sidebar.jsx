import React, { useState } from 'react'
import { assets, ownerMenuLinks } from '../../assets/assets'
import {NavLink, useLocation} from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import axios from 'axios'

const Sidebar = () => {
  const { userData, setUserData, backendUrl, token } = useAppContext()
  const user = userData || {};
  const location=useLocation()
  const [image, setImage]=useState(null)
  
  const updateImage = async ()=>{
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
    <div className='hidden md:flex flex-col w-64 min-h-screen glass border-r border-white/10 shrink-0 sticky top-0'>
      <div className='flex flex-col items-center pt-12 pb-8 border-b border-white/5'>
        <div className='group relative mb-4'>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : user?.profilePicture || assets.user_profile} alt="" className='w-20 h-20 rounded-full object-cover border-4 border-white/5 premium-shadow transition-transform group-hover:scale-105' />
            <input type="file" id='image' accept="image/*" hidden onChange={e=>setImage(e.target.files[0])} />
            <div className='absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity backdrop-blur-sm'>
              <img src={assets.edit_icon} alt="Edit" className='w-6 h-6 invert opacity-80' />
            </div>
          </label>
        </div>
        {image && (
          <button onClick={updateImage} className='px-4 py-2 bg-primary/20 hover:bg-primary/40 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full transition-colors flex items-center gap-2'>
            Save Changes <img src={assets.check_icon} alt="" width={10} className='invert brightness-0' />
          </button>
        )}
        <p className='mt-2 font-bold font-heading text-lg'>{user?.name || "Partner Owner"}</p>
        <p className='text-[10px] uppercase font-bold tracking-widest text-white/30'>Verified Partner</p>
      </div>

      <div className='flex-1 overflow-y-auto px-4 py-6 space-y-2'>
        {ownerMenuLinks.map((link, index) => {
          const isActive = link.path === location.pathname;
          return (
            <NavLink 
                key={index} 
                to={link.path} 
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-primary/10 border border-primary/20 premium-shadow' : 'hover:bg-white/5 border border-transparent'}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-primary' : 'bg-white/5 group-hover:bg-white/10'}`}>
                  <img src={link.icon} alt="icon" className={`w-4 h-4 transition-all ${isActive ? 'brightness-200' : 'opacity-40 group-hover:opacity-100'}`} />
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white'}`}>
                  {link.name}
              </span>
            </NavLink>
          );
        })}
      </div>
    </div>
  )
}

export default Sidebar
