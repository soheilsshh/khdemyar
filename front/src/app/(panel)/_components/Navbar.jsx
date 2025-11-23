import Image from 'next/image'
import React from 'react'

import { IoSearchOutline } from "react-icons/io5";

function Navbar() {
    return (
        <div className='p-2 max-lg:pr-15 fixed w-full bg-dThird shadow-xs z-40'>
            <div className='flex  justify-between w-full '>
                {/* logo */}
                <div className='max-md:w-full'>
                    <div className='flex justify-center w-full xl:min-w-sm text-sm items-center h-11 gap-5 bg-gray-200  px-2 pr-4 rounded-lg shadow-xl'>
                        <IoSearchOutline size={30} />
                        <input type="text" className='w-full outline-none' placeholder='جستجو کنید ...' />
                    </div>
                </div>
          
                    <div className=" w-fit z-50  hidden  flex-1 md:flex justify-end pl-6 lg:pl-63 items-center scale-110">
                        <Image
                            src="/images/logo-1-large.png"
                            alt="example"
                            width={220}
                            height={100}
                            className=" z-100"
                        />
    
                </div>


            </div>
        </div>
    )
}

export default Navbar