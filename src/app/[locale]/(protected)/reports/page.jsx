import Link from 'next/link'
import { ArrowPathIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

async function page({ params }) {

    return (
        <div className='grid grid-cols-2 p-4 items-center'>
            <div>
                <h1>Warehouse</h1>
                {/* {link.icon} */}
                <Link 
                    className='text-blue-600 hover:text-blue-500 group transition-colors dark:text-blue-400 dark:hover:text-blue-300'
                    href={`/reports/item-movement`}
                >
                    Item Movement
                </Link>
            </div>
            <div>
                <h1>refillable items</h1>
                {/* {link.icon} */}
                <Link 
                    className='text-blue-600 hover:text-blue-500 group transition-colors dark:text-blue-400 dark:hover:text-blue-300'
                    href={`/reports/refilled-used-items`}
                >
                    <ArrowPathIcon className="w-4 h-4" />
                    refilled and used items in period
                </Link>

                <Link 
                    className='text-blue-600 hover:text-blue-500 group transition-colors dark:text-blue-400 dark:hover:text-blue-300'
                    href={`/reports/refillable-items-client-has`}
                >
                    <ArrowPathIcon className="w-4 h-4" />
                    refillable items client has
                </Link>
            </div>
            <div>
                <h1>finance</h1>
                {/* {link.icon} */}
                <Link 
                    className='text-blue-600 hover:text-blue-500 group transition-colors dark:text-blue-400 dark:hover:text-blue-300'
                    href={`/reports/payments-in-period`}
                >
                    <CurrencyDollarIcon className="w-4 h-4" />
                    payments in period
                </Link>
            </div>
            <div>
                <h1>client/supplier</h1>
                {/* {link.icon} */}
                <Link 
                    className='text-blue-600 hover:text-blue-500 group transition-colors dark:text-blue-400 dark:hover:text-blue-300'
                    href={`/reports/owner-account-statement`}
                >
                    <CurrencyDollarIcon className="w-4 h-4" />
                    account statement
                </Link>
            </div>
        </div>
    )
}

export default page
