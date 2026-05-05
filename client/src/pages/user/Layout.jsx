import React from 'react'
import PortalNavbar from '../../components/PortalNavbar'
import PortalSidebar from '../../components/PortalSidebar'
import { Outlet } from 'react-router-dom'
import { userMenuLinks } from '../../assets/assets'

const Layout = () => {
  return (
    <div className='flex flex-col bg-[#050505] min-h-screen'>
      <PortalNavbar />
      <div className='flex flex-1'>
        <PortalSidebar 
            menuLinks={userMenuLinks} 
            roleTitle="Verified Renter" 
            switchRolePath="/owner" 
            switchRoleLabel="Switch to Hosting" 
        />
        <main className='flex-1 relative'>
            <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
