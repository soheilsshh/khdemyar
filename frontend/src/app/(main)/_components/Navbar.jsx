"use client"
import React from 'react'
import Menu from './Menu'
import { useRouter } from 'next/navigation'


function Navbar() {

  const router = useRouter()

  return (
    <div className='w-full flex justify-between items-center p-5 absolute top-0 z-50 '>

      <Menu />
      <div className='flex justify-center items-center'>
        <button
          onClick={() => router.push("/register")}  
          className='bg-green-700 text-white shadow-2xl  text-sm md:text-base p-3 px-5 cursor-pointer rounded-lg '>
          ورود به سامانه
        </button>

      </div>
    </div>
  )
}

export default Navbar
