import Link from 'next/link'
import React from 'react'

function page() {
    return (
        <div className='grid grid-cols-2 p-4 items-center'>
            <div>
                <h1>Warehouse</h1>
                <Link 
                    className='text-blue-600 hover:text-blue-500 group transition-colors dark:text-blue-400 dark:hover:text-blue-300'
                    href={`/reports/item-movement`}
                >
                    Item Movement
                </Link>
            </div>
        </div>
    )
}

export default page
