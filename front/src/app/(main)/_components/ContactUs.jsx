import React from 'react'
import { FaMapMarkerAlt, FaPhone } from 'react-icons/fa'
import { GrGoogle } from 'react-icons/gr'

import SocialNetworks from './SocialNetworks'

const contactData = [
  {
    icon: <FaMapMarkerAlt />,
    label: 'آدرس :',
    value: 'خیابان امام /کوچه باهنر / جنب پارپخانه'
  },
  {
    icon: <GrGoogle />,
    label: 'آدرس سایت :',
    value: 'www.khademyar.ir'
  },
  {
    icon: <FaPhone />,
    label: 'تلفن :',
    value: '۰۹۳۶۱۳۱۰۹۱۸'
  }
]

function ContactUs() {
  return (
    <div className=' col-span-12 lg:col-span-6 xl:col-span-4 flex flex-col'>
      <div className='font-iranianSansDemiBold text-xl'>
        تماس با ما
      </div>

      {contactData.map((item, index) => (
        <div key={index} className='flex gap-2 justify-between mt-10'>
          <div className='flex gap-2 justify-center items-center'>
            <div>{item.icon}</div>
            <div>{item.label}</div>
          </div>
          <div>{item.value}</div>
        </div>
      ))}

      <div className='mt-10'>
        <SocialNetworks />
      </div>
    </div>
  )
}

export default ContactUs
