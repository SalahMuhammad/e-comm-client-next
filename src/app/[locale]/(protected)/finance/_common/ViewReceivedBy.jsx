'use client'

import { useState } from "react"


function ViewReceivedBy({ recivedBy }) {
    const [value, setValue] = useState(recivedBy)

    return (
        <>
            <div className="none-printable mb-4 flex">
                <label htmlFor="received_by" className="block mr-2 text-sm font-medium text-gray-700 mb-1">
                    Received By
                </label>
                <input
                    id="received_by"
                    name="received_by"
                    type="text"
                    placeholder="Enter name..."
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="max-w-xs w-full border border-gray-300 rounded-md shadow-sm text-sm text-gray-700
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                             placeholder-gray-400"
                />
            </div>

            {value && (
                <div className="flex absolute right-2 bottom-0">
                    <span className="text-sm font-semibold min-w-[110px] text-gray-900 print:text-black">Received By:</span>
                    <div className="text-gray-800 bg-white flex items-center justify-center text-sm print:text-black ml-2">
                        {value}
                    </div>
                </div>
            )}
        </>
    )
}

export default ViewReceivedBy
