'use client';

import { useEffect, useState } from 'react';
import { getExpenses } from '../actions';
import PaginationControls from '@/components/PaginationControls';
// import TableNote from '@/components/TableNote';
import FilterButtons from './StatusFilters';
import { formatDateTime, formatDate } from '@/utils/dateFormatter';
import { formatCurrency } from '@/utils/CurrencyFormatter';
import Gallery from '../../../(warehouse)/items/list/Gallery';
import ImageView from '@/components/ImageView';
import { useSearchParams } from 'next/navigation';
import { URLQueryParameterSetter } from '@/components/inputs/index';
import Link from 'next/link';
import { PencilIcon, TrashIcon, ChevronDownIcon, PhotoIcon, ExclamationCircleIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { deleteExpense } from '../actions';
import { useTranslations } from 'next-intl';

export default function ExpenseList() {
    const t = useTranslations('inputs.search');
    const tExpense = useTranslations('finance.expense.list');
    const tGlobal = useTranslations('global');
    const tStatus = useTranslations('finance.statusOptions');

    const statusMap = {
        '1': { label: tStatus('pending'), color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: ClockIcon },
        '2': { label: tStatus('confirmed'), color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: CheckCircleIcon },
        '3': { label: tStatus('rejected'), color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: XCircleIcon },
        '4': { label: tStatus('reimbursed'), color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircleIcon },
    };

    const [expandedId, setExpandedId] = useState(null);
    const [res, setRes] = useState([])
    const [image, setImage] = useState([])
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchExpenses = async () => {
            const res = await getExpenses(`?${searchParams.toString()}`)
            setRes(res)
        }
        fetchExpenses()
    }, [searchParams])

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleDelete = async (hashedId) => {
        toast(tGlobal('delete.confirmMessage'), {
            action: {
                label: tGlobal('delete.actionLabel'),
                onClick: async () => {
                    const deleteRes = await deleteExpense(hashedId);
                    if (deleteRes.ok) {
                        toast.success(tGlobal('delete.success'));
                        // Refresh the list
                        const res = await getExpenses(`?${searchParams.toString()}`);
                        setRes(res);
                    } else {
                        toast.error(deleteRes.data?.detail || tGlobal('errors.deleteError'));
                    }
                },
            },
            cancel: {
                label: tGlobal('delete.cancelLabel'),
                onClick: () => {
                    toast.info(tGlobal('delete.assert.canceled'));
                },
            },
            duration: 10000,
        });
    };

    function onImageViewClose() {
        setImage([])
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                {/* <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Expenses</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage and track your business expenses</p>
                </div> */}

                <URLQueryParameterSetter paramOptions={[
                    { label: t('categoryName'), value: 'category__name' },
                    { label: t('accountName'), value: 'business_account__account_name' },
                    { label: t('notes'), value: 'notes' },
                    { label: t('date'), value: 'date', inputType: 'date' },
                    // { label: t('fromDate'), value: 'date_range_after', inputType: 'date' },
                    // { label: t('toDate'), value: 'date_range_before', inputType: 'date' }
                ]} />

                {/* Filter Buttons */}
                <FilterButtons
                    statusMap={statusMap}
                    allLabel={tGlobal('all')}
                    createLink={{
                        href: '/finance/expense/form',
                        label: tExpense('createTitle')
                    }}
                />

                {/* Expenses List */}
                <div className="space-y-3">
                    {res.data?.results?.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col items-center justify-center">
                                <ExclamationCircleIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
                                <p className="text-gray-600 dark:text-gray-400">{tExpense('noExpenses')}</p>
                            </div>
                        </div>
                    ) : (
                        res.data?.results?.map(expense => {
                            const StatusIcon = statusMap[expense.status].icon;
                            const isExpanded = expandedId === expense.hashed_id;

                            return (
                                <div
                                    key={expense.hashed_id}
                                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md"
                                >
                                    {/* Collapsed View */}
                                    {/* Mobile View (Card Layout) */}
                                    <div className="lg:hidden">
                                        <div className="w-full p-4">
                                            {/* Action Buttons - Top Right (Mobile Only) */}
                                            <div className="flex items-start justify-between mb-3">
                                                <div className={`p-2 rounded-lg ${statusMap[expense.status].color}`}>
                                                    <StatusIcon className="w-5 h-5" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/finance/expense/form/${expense.hashed_id}`}
                                                        className="flex items-center text-blue-600 hover:text-blue-800 group transition duration-300 dark:text-blue-200 dark:hover:text-white p-2 cursor-pointer"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <PencilIcon
                                                            className="
                                                                h-5 w-5
                                                                transition-all duration-300 ease-in-out
                                                                group-hover:rotate-[8deg]
                                                                group-hover:-translate-y-0.5
                                                                group-hover:scale-110
                                                                group-hover:drop-shadow-sm
                                                            "
                                                        />
                                                    </Link>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(expense.hashed_id);
                                                        }}
                                                        className="flex items-center text-red-600 hover:text-red-800 group transition duration-300 dark:text-red-400 dark:hover:text-red-300 p-2 cursor-pointer"
                                                    >
                                                        <TrashIcon
                                                            className="
                                                                h-5 w-5
                                                                transition-all duration-300 ease-in-out
                                                                group-hover:scale-110
                                                                group-hover:-translate-y-0.5
                                                                group-hover:drop-shadow-sm
                                                            "
                                                        />
                                                    </button>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => toggleExpand(expense.hashed_id)}
                                                className="w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg p-2 -mx-2"
                                            >
                                                <div className="space-y-3">
                                                    {/* Title and Status */}
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 inline mr-2">{expense.category_name}</h3>
                                                        <span className={`inline px-2 py-1 rounded text-xs font-medium ${statusMap[expense.status].color}`}>
                                                            {statusMap[expense.status].label}
                                                        </span>
                                                    </div>

                                                    {/* Payment Method */}
                                                    <Link
                                                        href={`/finance/account-vault/view/${expense.business_account_hashed_id}`}
                                                        className="block text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors cursor-pointer"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {expense.payment_method_name}
                                                    </Link>

                                                    {/* Amount and Date */}
                                                    <div>
                                                        <p className="font-bold text-gray-900 dark:text-white text-lg mb-1">{formatCurrency(expense.amount)}</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(expense.date)}</p>
                                                    </div>

                                                    {/* Expand Icon */}
                                                    <div className="flex justify-center pt-2">
                                                        <ChevronDownIcon
                                                            className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                                        />
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Desktop View (Original Layout) */}
                                    <div className="hidden lg:block w-full p-4">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => toggleExpand(expense.hashed_id)}
                                                className="flex-1 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg p-2 -m-2"
                                            >
                                                <div className="flex-1 flex items-center gap-4">
                                                    <div className={`p-2 rounded-lg ${statusMap[expense.status].color}`}>
                                                        <StatusIcon className="w-5 h-5" />
                                                    </div>

                                                    <div className="flex-1 text-left">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-semibold text-gray-900 dark:text-white">{expense.category_name}</h3>
                                                            <span className={`px-2 py-1 rounded text-xs font-medium ${statusMap[expense.status].color}`}>
                                                                {statusMap[expense.status].label}
                                                            </span>
                                                        </div>
                                                        <Link
                                                            href={`/finance/account-vault/view/${expense.business_account_hashed_id}`}
                                                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors cursor-pointer"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {expense.payment_method_name}
                                                        </Link>
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-900 dark:text-white text-lg">{formatCurrency(expense.amount)}</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(expense.date)}</p>
                                                    </div>
                                                </div>

                                                <ChevronDownIcon
                                                    className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                                />
                                            </button>

                                            {/* Action Buttons (Desktop Only) */}
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/finance/expense/form/${expense.hashed_id}`}
                                                    className="flex items-center text-blue-600 hover:text-blue-800 group transition duration-300 dark:text-blue-200 dark:hover:text-white p-2 cursor-pointer"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <PencilIcon
                                                        className="
                                                            h-5 w-5
                                                            transition-all duration-300 ease-in-out
                                                            group-hover:rotate-[8deg]
                                                            group-hover:-translate-y-0.5
                                                            group-hover:scale-110
                                                            group-hover:drop-shadow-sm
                                                        "
                                                    />
                                                </Link>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(expense.hashed_id);
                                                    }}
                                                    className="flex items-center text-red-600 hover:text-red-800 group transition duration-300 dark:text-red-400 dark:hover:text-red-300 p-2 cursor-pointer"
                                                >
                                                    <TrashIcon
                                                        className="
                                                            h-5 w-5
                                                            transition-all duration-300 ease-in-out
                                                            group-hover:scale-110
                                                            group-hover:-translate-y-0.5
                                                            group-hover:drop-shadow-sm
                                                        "
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded View */}
                                    {isExpanded && (
                                        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4 bg-gray-50 dark:bg-gray-800">
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        {tGlobal('createdBy')}
                                                    </label>
                                                    <p className="text-gray-900 dark:text-white">{expense.created_by}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        {tGlobal('updatedBy')}
                                                    </label>
                                                    <p className="text-gray-900 dark:text-white">{expense.last_updated_by}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        {tGlobal('createdAt')}
                                                    </label>
                                                    <p className="text-gray-900 dark:text-white">{formatDateTime(expense.created_at, false)}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        {tGlobal('updatedAt')}
                                                    </label>
                                                    <p className="text-gray-900 dark:text-white">{formatDateTime(expense.last_updated_at, false)}</p>
                                                </div>
                                            </div>

                                            {expense.notes && (
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        {tExpense('notes')}
                                                    </label>
                                                    <div className="bg-white dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600">
                                                        {/* <TableNote note={expense.notes} /> */}
                                                        <p className="break-words whitespace-normal text-gray-900 dark:text-gray-100">{expense.notes}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Mobile View - Image Label on Top, Image Below */}
                                            <div className="lg:hidden">
                                                {expense.image ? (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <PhotoIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                {tExpense('image') || 'Image'}
                                                            </label>
                                                        </div>
                                                        <div className="cursor-pointer hover:opacity-80 transition-opacity overflow-hidden rounded-lg">
                                                            <Gallery onClick={() => setImage([{ img: expense.image }])} className='w-full h-48 object-contain' images={[{ img: expense.image }]} />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <PhotoIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                {tExpense('image') || 'Image'}
                                                            </label>
                                                        </div>
                                                        <div className="p-3 bg-white dark:bg-gray-700 rounded border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400 text-center">
                                                            <span>{tExpense('noImage')}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Desktop View - Original Layout */}
                                            <div className="hidden lg:block">
                                                {expense.image ? (
                                                    <div className="flex items-center gap-2 p-3 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">
                                                        <PhotoIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                        <span>{expense.image}</span>
                                                        <div className="cursor-pointer hover:opacity-80 transition-opacity">
                                                            <Gallery onClick={() => setImage([{ img: expense.image }])} className='w-3xs h-3xs max-w-3xs max-h-3xs' images={[{ img: expense.image }]} />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 p-3 bg-white dark:bg-gray-700 rounded border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400">
                                                        <PhotoIcon className="w-4 h-4" />
                                                        <span>{tExpense('noImage')}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                <PaginationControls
                    resCount={res.data?.count}
                    hasNext={res.data?.next}
                    hasPrev={res.data?.previous}
                />

                {/* Summary */}
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{tExpense('summary')}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.keys(statusMap).map(status => {
                            const data = res.data?.results
                            const count = data?.filter(e => e.status === status).length;
                            const total = data?.filter(e => e.status === status)
                                ?.reduce((sum, e) => sum + e.amount, 0);

                            return (
                                <div key={status} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                        {statusMap[status].label}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(total)}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <ImageView images={image} onClose={onImageViewClose} startIndex={0} />
        </div>
    );
}





