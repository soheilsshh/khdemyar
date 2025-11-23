import React from 'react'
import ManagerDetail from './_components/ManagerDetail'

function page({ params }) {
  return (
    <ManagerDetail managerId={params.id} />
  )
}

export default page

