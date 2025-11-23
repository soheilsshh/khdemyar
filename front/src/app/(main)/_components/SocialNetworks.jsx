import React from 'react'
import Bale from '@/components/Bale'
import Eata from '@/components/Eata'
import Insta from '@/components/Insta'
import Soroush from '@/components/Soroush'

function SocialNetworks() {
    return (
        <div >
            <div className='font-iranianSansDemiBold'>
                مارا در شبکه های اجتماعی دنبال کنید :
            </div>
            <div className='flex mt-4 justify-center items-center *:hover:scale-120 *:cursor-pointer gap-10 *:transition-all *:hover:-translate-y-1  ' >
                <div className='w-12 h-12'>
                    <Bale />
                </div>
                <div className='text-orange-400 w-12 h-12  '>
                    <Eata />
                </div>
                <div className='w-12 h-12'>
                    <Soroush />
                </div>
                <div className='w-16 h-16'>
                    <Insta />
                </div>
            </div>
        </div>
    )
}

export default SocialNetworks