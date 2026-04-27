import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const NavbarOwner = () => {
  const { userData } = useAppContext();
  const user = userData || {};
  return (
    <div className='flex items-center justify-between px-6 md:px-10 py-5 glass border-b border-white/10 sticky top-0 z-[100]'>
      <Link to='/' className='flex items-center group'>
        <span className='text-xl font-black font-heading tracking-tighter text-white uppercase group-hover:opacity-90 transition-opacity'>
            Idle<span className='text-primary'>Wheels</span>
        </span>
      </Link>
      <div className='flex items-center gap-4'>
        <p className='text-xs font-bold uppercase tracking-widest text-white/50'>{user.name || "Owner"}</p>
        <div className='w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center overflow-hidden'>
            <img src={user.profilePicture || assets.user_profile} className='w-full h-full object-cover' alt="" />
        </div>
      </div>
    </div>
  )
}

export default NavbarOwner
