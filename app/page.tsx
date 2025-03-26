
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <section className="h-full flex flex-col  gap-16 items-start justify-start py-3 px-3">
    <div className=" h-screen max-w-5xl  w-full mx-auto flex items-center justify-center">
        <Link href={'/login'} className='px-3 py-1 bg-neutral-50 border border-neutral-200 rounded'>Login</Link>
    </div>
  </section>
  )
}

export default page