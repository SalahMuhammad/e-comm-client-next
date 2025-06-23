import React from 'react'

async function page({ params }) {
    const { id } = await params
  return (
    <div>
      fds{id}
    </div>
  )
}

export default page
