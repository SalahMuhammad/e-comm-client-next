"use client"
import { useEffect, useState, useRef } from 'react'
import Link from "next/link"
import { getCSView } from "../../actions"
import { useTranslations } from 'next-intl'
import { DocumentTextIcon, CurrencyDollarIcon, DocumentDuplicateIcon, ChartBarIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import useGenericResponseHandler from "@/components/custom hooks/useGenericResponseHandler";
import { useParams } from 'next/navigation'

export default function Page() {
    const params = useParams();
    const { ownerid } = params
    const t = useTranslations('customer-supplier.view')

    const [res, setRes] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showRaw, setShowRaw] = useState(false)
    const fetchedRef = useRef(false)
    const handleGenericErrors = useGenericResponseHandler(t)

    useEffect(() => {
        if (!ownerid) return
        if (fetchedRef.current) return
        fetchedRef.current = true
        let mounted = true
        setLoading(true)
        getCSView(ownerid)
            .then(r => { if (mounted) setRes(r) })
            .catch(err => { if (mounted) setError(err) })
            .finally(() => { if (mounted) setLoading(false) })
        setLoading(false)
        return () => { mounted = false }
    }, [ownerid])

    useEffect(() => {
        if (res?.ok === undefined) return
        if (handleGenericErrors(res)) return
    }, [res])

    if (loading) return (
        <div className="p-6 flex items-center justify-center">
            <div className="text-gray-700 dark:text-gray-300">{t('loading') || 'Loading...'}</div>
        </div>
    )

    if (error) return (
        <div className="p-6">
            <div className="bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-800 rounded-md p-4">
                <p className="text-red-800 dark:text-red-200">{t('error') || 'Failed to load data.'}</p>
            </div>
        </div>
    )

    const data = res?.data || {}

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
                        <DocumentTextIcon className="h-6 w-6 text-gray-600 dark:text-gray-300 transition-transform transform group-hover:scale-110" aria-hidden />
                        <span>{data?.owner_name || t('title')}</span>
                    </h1>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setShowRaw(prev => !prev)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                        >
                            <DocumentTextIcon className="h-5 w-5 text-gray-600 dark:text-gray-300 transition-transform transform hover:scale-110" aria-hidden />
                            <span>{showRaw ? t('showUI') : t('showRaw')}</span>
                        </button>
                    </div>
                </div>

                <div className="mt-6">
                    {showRaw ? (
                        <pre className="bg-gray-900 text-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto text-sm">
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-start gap-3">
                                    <CurrencyDollarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 transition-transform transform hover:scale-110" aria-hidden />
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">{t('creditBalance')}</h3>
                                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">${data?.credit || 0}</p>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-start gap-3">
                                    <DocumentTextIcon className="h-6 w-6 text-gray-600 dark:text-gray-300 mt-1 transition-transform transform hover:scale-110" aria-hidden />
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">{t('details')}</h3>
                                        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{data?.details || t('noDetails')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('relatedDocuments')}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <Link className="group inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200" 
                                          href={`/invoice/sales/list/?s=${data?.owner_name}`}>
                                        <DocumentDuplicateIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400 transition-transform transform group-hover:scale-110" aria-hidden />
                                        {t('salesInvoices')}
                                    </Link>
                                    <Link className="group inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200" 
                                          href={`/invoice/purchases/list/?s=${data?.owner_name}`}>
                                        <DocumentDuplicateIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400 transition-transform transform group-hover:scale-110" aria-hidden />
                                        {t('purchaseInvoices')}
                                    </Link>
                                    <Link className="group inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200" 
                                          href={`/finance/payments/list?s=${data?.owner_name}`}>
                                        <CurrencyDollarIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400 transition-transform transform group-hover:scale-110" aria-hidden />
                                        {t('payments')}
                                    </Link>
                                    <Link className="group inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200" 
                                          href={`/finance/expenses/list?s=${data?.owner_name}`}>
                                        <ChartBarIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400 transition-transform transform group-hover:scale-110" aria-hidden />
                                        {t('expenses')}
                                    </Link>
                                    <Link className="group inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200" 
                                          href={`/invoice/sales/refund/list/?s=${data?.owner_name}`}>
                                        <ArrowPathIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400 transition-transform transform group-hover:scale-110" aria-hidden />
                                        {t('salesInvoiceRefunds')}
                                    </Link>
                                    <Link className="group inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200" 
                                          href={`/refillable-items/refund/list?s=${ownerid}`}>
                                        <DocumentDuplicateIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400 transition-transform transform group-hover:scale-110" aria-hidden />
                                        {t('refillableItemsRefund')}
                                    </Link>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('reports')}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Link className="group inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200" 
                                          href={`/reports/owner-account-statement/${ownerid}`}>
                                        <ChartBarIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400 transition-transform transform group-hover:scale-110" aria-hidden />
                                        {t('accountStatement')}
                                    </Link>
                                    <Link className="group inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200" 
                                          href={`/reports/refillable-items-client-has/${ownerid}`}>
                                        <DocumentDuplicateIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400 transition-transform transform group-hover:scale-110" aria-hidden />
                                        {t('dueDcdCans')}
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
