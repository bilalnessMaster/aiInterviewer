import React from 'react'

const Loader = () => {
  return (
    <section className='h-full flex flex-col items-center justify-center  gap-3 '>
        <div className='border-2 border-neutral-50 border-t-2 border-t-neutral-500 size-8 rounded-full animate-spin'/>
        <span className='font-mono'>Loading</span>
    </section>
  )
}

export default Loader