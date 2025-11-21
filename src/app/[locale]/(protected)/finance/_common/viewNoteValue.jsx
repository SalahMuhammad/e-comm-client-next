'use client'

import { useState } from "react"



function ViewNoteValue({ note, recieptAmount, ref_order, ref_order_total_amount }) {
    const [isDefaultNote, setIsDefaultNote] = useState(false)

    let message = ''
    if (ref_order_total_amount) {
        message = recieptAmount == ref_order_total_amount 
                ? `order nu#${ref_order}'s amount.`
                : `part of order nu#${ref_order}'s amount.`
    }


    return (
        <div className={`flex items-center mb-3 gap-2`}>
            <input className="none-printable" type="checkbox" value={isDefaultNote} onChange={(e) => setIsDefaultNote(!isDefaultNote)}/>
            <span className={`text-sm font-medium min-w-[110px] text-[#333]`}>Description</span>
            <div className={`flex-1 h-[25px] border-b border-[#333] bg-white flex items-center justify-center px-2 text-sm`}>{note}{isDefaultNote ? message : ''}</div>
        </div>
    )
}

export default ViewNoteValue
