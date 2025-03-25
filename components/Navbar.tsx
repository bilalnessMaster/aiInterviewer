'use client'
import { signOut, useSession } from 'next-auth/react'
import { StaticImport } from 'next/dist/shared/lib/get-img-props'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
const Links = [
    {
        id: 1,
        name: 'Dashboard',
        href: '/dashboard',
        icon: 'hgi hgi-stroke hgi-dashboard-square-edit text-xl text-neutral-700'
    },
    {
        id: 2,
        name: 'Create interview',
        href: '/create-interview',
        icon: "hgi hgi-stroke hgi-ai-programming text-xl text-neutral-700"
    }
]
const Navbar = () => {
    const { data: session } = useSession()
    const [isLoading, setIsLoading] = useState(false)
    const handleLogout = async () => {
        setIsLoading(true)
        await signOut({ redirectTo: '/login' })
        setIsLoading(false)
    }

    return (
        <aside className='w-full bg-neutral-50 h-full border-r border-r-neutral-200/85 py-2'>
            <header className='w-full flex flex-col items-center h-full '>
                <nav className='flex flex-col justify-between items-center h-full'>
                    <div className='flex flex-col gap-10'>
                        <i className="hgi hgi-stroke hgi-ai-computer text-xl"></i>
                        <ul className='flex flex-col '>
                            {
                                Links.map(({ id, name, href, icon }) => (
                                    <Link key={id} href={href} className='relative group/link'>
                                        <i className={icon}></i>
                                        <span className='absolute  text-xs pointer-events-none inset-y-0 inline-flex bg- items-center w-32 font-mono  first-letter:capitalize  transition-opacity duration-150 opacity-0 -right-36 group-hover/link:opacity-100  group-hover/link:pointer-events-auto '>
                                            <span className='px-1 bg-yellow-300/45 font-medium'>{name}</span>
                                        </span>
                                    </Link>
                                ))
                            }
                        </ul>
                    </div>
                    <div className='relative group/details'>
                        <span className='inline-flex size-7 items-center justify-center bg-amber-200 rounded-full font-mono text-xs cursor-pointer '>
                            {
                                session?.user?.image && (
                                    <Image src={session?.user?.image} width={100} height={100} alt='profile picture' className='rounded-full' />
                                )
                            }
                        </span>
                        <div className='bg-red-400 h-24 w-4 pointer-events-none group-hover/details:pointer-events-auto absolute -top-16 opacity-0 left-6'>

                        </div>
                        <div className='absolute grid pointer-events-none group-hover/details:pointer-events-auto opacity-0 group-hover/details:opacity-100 divide-y divide-neutral-100 w-56 border h-24 bottom-0 left-10 bg-neutral-50 border-neutral-200 rounded  font-mono z-10'>
                            <div className='flex  items-center gap-2 p-1 '>
                                <span className='inline-flex size-9 items-center justify-center bg-yellow-200 rounded-full font-mono text-xs cursor-pointer over'>
                                    {
                                        session?.user?.image && (
                                            <Image src={session?.user?.image} width={100} height={100} alt='profile picture' className='rounded-full' />
                                        )
                                    }
                                </span>
                                <span className='text-xs flex flex-col'>
                                    <span>{session?.user?.name}</span>
                                    <span className='text-neutral-400'>{session?.user?.email}</span>
                                </span>
                            </div>
                            <button className='flex  cursor-pointer  hover:bg-neutral-100 items-center gap-2 p-1 ' onClick={handleLogout}>
                                <span className='inline-flex size-9 items-center justify-center  rounded-full font-mono text-xs '>
                                    <i className="hgi hgi-stroke hgi-logout-02 text-xl"></i>
                                </span>
                                <span className='text-xs flex flex-col'>
                                    <span>Log out</span>
                                </span>
                            </button>
                        </div>
                    </div>
                </nav>
            </header>
        </aside>
    )
}

export default Navbar