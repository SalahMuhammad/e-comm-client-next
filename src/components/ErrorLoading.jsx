"use client"

import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

export default function ErrorLoading({name, err="error"}) {
    const t = useTranslations(name)
    
    return (
        <div className='w-full mt-20 transform-translate-x-1/2 flex justify-center items-center font-bold'><InformationCircleIcon className='w-6 h-6 mr-3' /> {t(err)}</div>
    )
}