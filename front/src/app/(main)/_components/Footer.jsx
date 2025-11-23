import React from 'react'
import SendFeedback from './SendFeedback'
import QuickAccess from './QuickAccess'
import ContactUs from './ContactUs'

function Footer() {
  return (
    <div  id="contact-us" className='grid shadow-2xl grid-cols-12 p-10 max-xl:gap-y-10 bg-green-50 rounded-t-4xl'>
        <SendFeedback />
        <QuickAccess />
        <ContactUs />
    </div>
  )
}

export default Footer