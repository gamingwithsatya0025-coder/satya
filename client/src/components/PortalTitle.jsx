import React from 'react'

const PortalTitle = ({ title, subTitle }) => {
  return (
    <div className="mb-12">
      <h2 className='text-4xl md:text-5xl font-black font-heading uppercase text-white tracking-tighter leading-none'>{title}</h2>
      <div className='flex items-center gap-4 mt-3'>
          <div className='h-px w-12 bg-primary' />
          <p className='text-[10px] font-black uppercase tracking-[0.3em] text-primary/70'>{subTitle}</p>
      </div>
    </div>
  )
}

export default PortalTitle
