'use client'

import { useState } from "react"


function ViewReceivedBy({ recivedBy }) {
    const [value, setValue] = useState(recivedBy)

    return (
        <>
            <input className="none-printable absolute right-[-211px] bottom-[-50px]" style={{background: 'red'}} type="text" value={value} onChange={(e) => setValue(e.target.value)} />
            {value && (
                <div className="flex absolute right-2 bottom-0">
                    <span className="text-sm font-medium min-w-[110px] text-[#333]">Received By:</span>
                    <div className="text-gray-600 bg-white flex items-center justify-center text-xs">
                        {value}
                    </div>
                </div>
            )}
        </>
    )
}

export default ViewReceivedBy
