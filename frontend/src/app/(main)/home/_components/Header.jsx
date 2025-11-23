import Image from 'next/image'
import React from 'react'
import Subtitle from './Subtitle'

function Header() {
    return (
        <div
            className={`
        relative w-full h-80 sm:h-[600px] 
        bg-[url('/images/bg-sm.png')] 
        sm:bg-[url('/images/bg-2.jpg')] 
        bg-cover bg-bottom
      `}
        >
            {/* لوگو */}
            <div className="absolute max-sm:w-full top-1/2 max-sm:bg-white/40 max-sm:h-full max-sm:flex max-sm:justify-center max-sm:items-center sm:right-30 -translate-y-1/2 z-20">
                <div className="block sm:hidden">
                    <Image src="/images/logo-2.png" alt="لوگو" width={180} height={50} priority />
                </div>
                <div className="hidden sm:block">
                    <Image src="/images/logo-2.png" alt="لوگو" width={320} height={120} priority />
                </div>
            </div>

            {/* <Subtitle /> */}
        </div>
    )
}

export default Header
