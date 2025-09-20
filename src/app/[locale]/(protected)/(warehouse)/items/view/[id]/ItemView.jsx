// app/[locale]/(protected)/warehouse/items/view/[id]/ItemView.jsx
'use server'

import { getItem } from "../../actions";
import { getItemFluctuationDuringlast60Dayes } from "../actions";
import './itemView.modul.css'


async function ItemView({ id }) {
    const item = (await getItem(id))?.data
    const itemFluctuation = await getItemFluctuationDuringlast60Dayes(id)
    const itemFluctuationData = itemFluctuation.data
    const value = itemFluctuationData.current - itemFluctuationData.previous
    const percentage = value * 100 / itemFluctuationData.previous

    if (! item?.id) throw new Response('Not Found', {status: 404})
    
    const isUpdated = new Date(item.created_at).toLocaleString() !== new Date(item.updated_at).toLocaleString()

    return (
        <div className="p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-[8px_8px_8px_-3px_rgba(0,0,0,0.3)]">
                {/* Header Section */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {item.name}
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                ID: #{item.id}
                            </p>
                        </div>

                        {value !== 0 && (
                            <div className="flex gap-2">
                                {value > 0 && (
                                    <div className="flex flex-col items-center">
                                        <svg className="w-10 h-10 text-green-500 animate-bounce-up" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 19V5M5 12l7-7 7 7"/>
                                        </svg>
                                    </div>
                                )}

                                {value < 0 && (
                                    <div className="flex flex-col items-center">
                                        <svg className="w-10 h-10 text-red-500 animate-bounce-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 5v14M19 12l-7 7-7-7"/>
                                        </svg>
                                    </div>
                                )}
                                <p className={value > 0 ? "text-green-400" : 'text-red-400'}>{percentage} %</p>
                                <div className="relative group">
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-6 w-6 text-gray-500 hover:text-gray-900 cursor-pointer" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth="2" 
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                        />
                                    </svg>
                                    
                                    <div className="absolute hidden group-hover:block -top-8 left-1/2 transform -translate-x-1/2 p-2 rounded-md bg-gray-800 text-white text-xs whitespace-nowrap">
                                        These values represent comparison of last 30 days with previous 30 dayes
                                        <br />Please note that items with 0 price or with false repository premit are ignored from both sales and rufund_sales invoices...
                                    </div>
                                </div>
              
                                <p>
                                    Absolute values: <br />
                                    Previous: {itemFluctuationData.previous} unit<br />
                                    Current: {itemFluctuationData.current} unit
                                </p>
                            </div>
                        )}

                        {item.is_refillable && (
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                Refillable
                            </span>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-[8px_8px_8px_-8px_rgba(0,0,0,0.3)]">
                            <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Stock Information</h2>
                            {item.stock.map((stockItem) => (
                                <div key={stockItem.id} className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300">{stockItem.repository_name}:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{stockItem.quantity} units</span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-[8px_8px_8px_-8px_rgba(0,0,0,0.3)]">
                            <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Pricing</h2>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">Price 1:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">${item.price1}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">Price 2:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">${item.price2}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">Price 3:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">${item.price3}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">Price 4:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">${item.price4}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-[8px_8px_8px_-8px_rgba(0,0,0,0.3)]">
                            <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Details</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">Type:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{item.type_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">Origin:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{item.origin}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">Place:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{item.place}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-[8px_8px_8px_-8px_rgba(0,0,0,0.3)]">
                            <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Creation and update info</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">Created:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {new Date(item.created_at).toLocaleString()}
                                    </span>
                                </div>
                                {isUpdated && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">Updated:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {new Date(item.updated_at).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">{isUpdated ? 'Last Updated' : 'Created'} by:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {item.by_username}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemView;
