import React from 'react'
import UserInfoForm from '../_components/UserInfoForm';

async function page({ params }) {
  // const { id } = params;

  return (
    <div className='pb-10'>
      <UserInfoForm  />
    </div>
  )
}

export default page;
