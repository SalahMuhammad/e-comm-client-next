'use client'

import { useState } from 'react';
import style from './view.module.css';
import useGenericResponseHandler from '@/components/custom hooks/useGenericResponseHandler';
import { changeRepositoryPermit } from './actions';



function RepositoryPermitButton({ id, type, permitValue }) {
    const handleResponse = useGenericResponseHandler()
    const [ permit, setpermit ] = useState(permitValue);
    
    const toggleRepositoryPermit = async () => {
        const res = await changeRepositoryPermit(id, type)
        if (handleResponse(res)) return;

        res.status === 200 &&
            setpermit(prev => !prev)
    };

    return (
        <button
            onClick={toggleRepositoryPermit}
            className={`${style['delivery-button']} ${permit ? style['delivered'] : style['not-delivered']}`}
        >
            {permit ? 'Delivered' : 'Not Delivered'}
        </button>
    )
}

export default RepositoryPermitButton
