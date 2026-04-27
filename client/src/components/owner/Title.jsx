import React from 'react'

const Title = ({title, subTitle}) => {
  return (
    <div className="mb-8">
      <h2 className='text-3xl md:text-4xl font-black font-heading uppercase text-white tracking-tighter'>{title}</h2>
      <p className='text-[10px] font-bold uppercase tracking-widest text-primary/70 mt-2'>{subTitle}</p>
    </div>
  )
}

export default Title
