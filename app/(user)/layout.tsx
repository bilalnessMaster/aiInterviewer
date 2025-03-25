import Navbar from '@/components/Navbar'
import React from 'react'

const layout = ({children} : {children: React.ReactNode}) => {
  return (
    <main className='flex min-h-screen '>
        <header className='w-10'>
                <Navbar />
        </header>
        <section className='flex-grow'>
            {children}
        </section>
    </main>
  )
}

export default layout