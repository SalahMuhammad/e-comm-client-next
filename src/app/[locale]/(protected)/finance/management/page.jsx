'use client'

import { useTranslations } from 'next-intl'
import { getVultsTotalBalance } from "./actions"
import { useEffect, useState } from 'react'

import {
    BanknotesIcon,
    BuildingLibraryIcon,
    DevicePhoneMobileIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

export default function Page() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            const res = await getVultsTotalBalance()
            setData(res.data)
            setLoading(false)
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300 pt-3 rounded-md p-8 flex items-center justify-center">
                <div className="text-gray-600 dark:text-gray-400">Loading...</div>
            </div>
        )
    }

    return <FinancialDashboard data={data} />
}


function FinancialDashboard({ data }) {
    const t = useTranslations('finance.management')

    const formatBalance = (balance) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(balance);
    };

    const getAccountIcon = (name) => {
        if (name.includes('mobile wallet')) return <DevicePhoneMobileIcon className="w-8 h-8 text-gray-700 dark:text-gray-200" />;
        if (name.includes('bank')) return <BuildingLibraryIcon className="w-8 h-8 text-gray-700 dark:text-gray-200" />;
        return <BanknotesIcon className="w-8 h-8 text-gray-700 dark:text-gray-200" />;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300 pt-3 rounded-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                {/* Header */}
                <div className="mb-8 sm:mb-12">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-200 bg-clip-text text-transparent mb-3">
                                {t('title')}
                            </h1>
                            {data.computed_from_transactions && (
                                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                    <span className="inline-block w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></span>
                                    {t('computedFromTransactions')}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Total Balance Card */}
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden border border-blue-500 dark:border-blue-600">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>
                        <div className="relative">
                            <p className="text-blue-100 dark:text-blue-200 text-sm uppercase tracking-wide mb-2">
                                {t('totalBalance')}
                            </p>
                            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold drop-shadow-sm break-words">
                                {formatBalance(data.total_balance)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Accounts Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                    {data.accounts.map((account) => (
                        <div
                            key={account.id}
                            className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-14 h-14 p-3 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center shrink-0">
                                        {getAccountIcon(account.name)}
                                    </div>
                                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                                        ID: {account.id}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 capitalize leading-tight">
                                    {account.name}
                                </h3>

                                <hr className="border-gray-100 dark:border-gray-700" />

                                <div className="dark:border-gray-700 pt-4 mt-2">
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 break-words">
                                        {formatBalance(account.balance)}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {((parseFloat(account.balance) / parseFloat(data.total_balance)) * 100).toFixed(1)}% {t('ofTotal')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('summary')}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700">
                                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                    {t('totalAccounts')}
                                </p>
                                <p className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white break-words">
                                    {data.accounts.length}
                                </p>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700">
                                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                    {t('activeAccounts')}
                                </p>
                                <p className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white break-words">
                                    {data.accounts.filter(a => parseFloat(a.balance) > 0).length}
                                </p>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700">
                                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                    {t('highestBalance')}
                                </p>
                                <p className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white break-words">
                                    {formatBalance(Math.max(...data.accounts.map(a => parseFloat(a.balance))))}
                                </p>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700 flex flex-col items-center justify-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                    {t('status')}
                                </p>
                                <div className="flex items-center justify-center">
                                    {data.success ? (
                                        <CheckCircleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-green-500 dark:text-green-400" />
                                    ) : (
                                        <XCircleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 dark:text-red-400" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
