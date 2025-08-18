import React from 'react'

function FieldError({ error }) {
    return error && (
        <div className="text-red-500 text-sm mt-1">
            {error}
        </div>
    )

}

export default FieldError
