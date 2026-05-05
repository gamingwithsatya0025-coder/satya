import React from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const PortalNavbar = () => {
  const { userData, setToken, setUserData } = useAppContext();
  const user = userData || {};
  const navigate = useNavigate();

  const logout = () => {
      setToken('');
      setUserData(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
  }

  return (
    <div className='flex items-center justify-between px-8 py-5 glass border-b border-white/10 sticky top-0 z-[100] backdrop-blur-2xl'>
      <Link to='/' className='flex items-center group'>
        <span className='text-2xl font-black tracking-tighter text-white uppercase'>
            Idle<span className='text-primary'>Wheels</span>
        </span>
      </Link>

      <div className='flex items-center gap-6'>
        <div className='hidden sm:flex flex-col items-end'>
            <p className='text-[10px] font-black uppercase tracking-widest text-white'>{user.name || "Owner"}</p>
            <p className='text-[8px] font-bold uppercase tracking-[0.2em] text-white/30'>{user.email}</p>
        </div>
        
        <div className='relative group'>
            <div className='w-10 h-10 rounded-xl border border-white/10 overflow-hidden cursor-pointer'>
                <img src={user.profilePicture || assets.user_profile} className='w-full h-full object-cover' alt="" />
            </div>
            
            {/* Dropdown */}
            <div className='absolute right-0 top-full pt-4 hidden group-hover:block'>
                <div className='glass border border-white/10 rounded-2xl p-2 min-w-[150px] shadow-2xl'>
                    <button 
                        onClick={logout}
                        className='w-full px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-between'
                    >
                        Sign Out
                        <div className='w-1.5 h-1.5 rounded-full bg-red-500' />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default PortalNavbar
