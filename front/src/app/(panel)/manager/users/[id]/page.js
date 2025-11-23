import React from 'react'
import UserDetail from './_components/UserDetail'

function page({ params }) {
  return (
    <UserDetail userId={params.id} />
  )
}

export default page
