'use client'

import { useState } from 'react';
import style from '@/app/[locale]/(protected)/invoice/common/view.module.css';
import useGenericResponseHandler from '@/components/custom hooks/useGenericResponseHandler';
import { updateStatus } from './actions';
import { useTranslations } from 'next-intl';


function Toggle({ obj, type }) {
    const handleResponse = useGenericResponseHandler()
    const [ status, setStatus ] = useState(obj.paid);
    const t = useTranslations('finance')
    
    const toggleRepositoryStatus = async () => {
        const res = await updateStatus(obj.hashed_id, type, obj.paid)
        if (handleResponse(res)) return;

        res.status === 200 &&
            setStatus(prev => !prev)
    };

    return (
        <button
            onClick={toggleRepositoryStatus}
            className={`${style['delivery-button']} ${status ? style['delivered'] : style['not-delivered']}`}
        >
            {status ? t('status.paid') : t('status.onHold')}
        </button>
    )
}

export default Toggle
