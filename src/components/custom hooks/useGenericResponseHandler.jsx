'use client'

import { useTranslations } from 'next-intl'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'


export default function useGenericResponseHandler(t = useTranslations('global.errors')) {
    // const t = useTranslations('global.errors')

    const handleResponse = (res, errorMessage) => {
        if (!res.status) return true

        switch (res.status) {
            case 200:
            case 201:
            case 204:
                break;
            case 400:
                if (res.data?.detail) {
                    toast.error(res.data?.detail)
                } else if (errorMessage) {
                    toast.error(errorMessage)
                }
                break;
            case 403:
                if (errorMessage === false) break;
                if (res.data?.detail?.includes('jwt')) {
                    redirect(`/auth/logout?nexturl=${window.location.pathname}`, 'replace')
                }
                toast.error(t('403'))
                return true
            case 404:
                toast.error(t('404'))
                return true
            case 500:
                toast.error(t('500'))
                return true
            case undefined:
                toast.error(t('503'))
                return true
            default:
                toast.error(`<<<<${res.status}>>>>: ` + (res.data?.detail || t('etc')))
                return true
        }
    }

    return handleResponse
}
