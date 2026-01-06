'use client';

import { useEffect, useState } from 'react';
import { getExpenses } from '../actions';
import PaginationControls from '@/components/PaginationControls';
import TableNote from '@/components/TableNote';
import FilterButtons from './StatusFilters';
import { formatDateTime, formatDate } from '@/utils/dateFormatter';
import { formatCurrency } from '@/utils/CurrencyFormatter';
import Gallery from '../../../(warehouse)/items/list/Gallery';
import ImageView from '@/components/ImageView';
import { useSearchParams } from 'next/navigation';
import SearchInput from '@/components/QueryParamSetterInput';


import { useTranslations } from 'next-intl';

export default function ExpenseList() {
    const t = useTranslations('inputs.search');
    const [expandedId, setExpandedId] = useState(null);
    const [res, setRes] = useState([])
    const [image, setImage] = useState([])
    const searchParams = useSearchParams();
    const offsetParam = searchParams.get('offset')
    const limitParam = searchParams.get('limit')
    const statusParam = searchParams.get('status')
    const categoryParam = searchParams.get('category')


    useEffect(() => {
        const fetchExpenses = async () => {
            const res = await getExpenses(`?offset=${offsetParam || 0}&limit=${limitParam || 12}&status=${statusParam || ''}&category=${categoryParam || ''}`)
            setRes(res)
        }
        fetchExpenses()
    }, [offsetParam, limitParam, statusParam, categoryParam])

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    function onImageViewClose() {
        setImage([])
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Expenses</h1>
                    <p className="text-gray-600">Manage and track your business expenses</p>
                </div>

                <SearchInput paramOptions={[
                    { label: t('category'), value: 'category' },
                    { label: t('limit'), value: 'limit' },
                    { label: t('offset'), value: 'offset' }
                ]} />

                {/* Filter Buttons */}
                <FilterButtons statusMap={statusMap} />

                {/* Expenses List */}
                <div className="space-y-3">
                    {res.data?.results?.length === 0 ? (
                        <div className="bg-white rounded-lg p-8 text-center">
                            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600">No expenses found</p>
                        </div>
                    ) : (
                        res.data?.results?.map(expense => {
                            const StatusIcon = statusMap[expense.status].icon;
                            const isExpanded = expandedId === expense.hashed_id;

                            return (
                                <div
                                    key={expense.hashed_id}
                                    className="bg-white rounded-lg border border-gray-200 transition-all hover:shadow-md"
                                >
                                    {/* Collapsed View */}
                                    <button
                                        onClick={() => toggleExpand(expense.hashed_id)}
                                        className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex-1 flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${statusMap[expense.status].color}`}>
                                                <StatusIcon className="w-5 h-5" />
                                            </div>

                                            <div className="flex-1 text-left">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-gray-900">{expense.category_name}</h3>
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusMap[expense.status].color}`}>
                                                        {statusMap[expense.status].label}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">{expense.payment_method_name}</p>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-bold text-gray-900 text-lg">{formatCurrency(expense.amount)}</p>
                                                <p className="text-sm text-gray-600">{formatDate(expense.date)}</p>
                                            </div>
                                        </div>

                                        <ChevronDown
                                            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </button>

                                    {/* Expanded View */}
                                    {isExpanded && (
                                        <div className="border-t border-gray-200 px-4 py-4 bg-gray-50">
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Created By
                                                    </label>
                                                    <p className="text-gray-900">{expense.created_by}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Last Updated By
                                                    </label>
                                                    <p className="text-gray-900">{expense.last_updated_by}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Created At
                                                    </label>
                                                    <p className="text-gray-900">{formatDateTime(expense.created_at, false)}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Last Updated
                                                    </label>
                                                    <p className="text-gray-900">{formatDateTime(expense.last_updated_at, false)}</p>
                                                </div>
                                            </div>

                                            {expense.notes && (
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Notes
                                                    </label>
                                                    <div className="bg-white p-2 rounded border border-gray-200">
                                                        <TableNote note={expense.notes} />
                                                    </div>
                                                </div>
                                            )}

                                            {expense.image ? (
                                                <div className="flex items-center gap-2 p-3 bg-white rounded border border-gray-300 text-sm text-gray-700">
                                                    <ImageIcon className="w-4 h-4 text-blue-600" />


                                                    <span>{expense.image}</span>
                                                    <Gallery onClick={() => setImage([{ img: expense.image }])} className='w-3xs h-3xs max-w-3xs max-h-3xs' images={[{ img: expense.image }]} />
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 p-3 bg-white rounded border border-dashed border-gray-300 text-sm text-gray-500">
                                                    <ImageIcon className="w-4 h-4" />
                                                    <span>No image attached</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Summary */}
                <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.keys(statusMap).map(status => {
                            const data = res.data?.results
                            const count = data?.filter(e => e.status === status).length;
                            const total = data?.filter(e => e.status === status)
                                ?.reduce((sum, e) => sum + e.amount, 0);

                            return (
                                <div key={status} className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-600 mb-2">
                                        {statusMap[status].label}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                                    <p className="text-sm text-gray-600">{formatCurrency(total)}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <ImageView images={image} onClose={onImageViewClose} startIndex={0} />

            <PaginationControls
                resCount={res.data?.count}
                hasNext={res.data?.next}
                hasPrev={res.data?.previous}
            />
        </div>
    );
}


const ChevronDown = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
);

const ImageIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const AlertCircle = () => (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CheckCircle = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const Clock = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const XCircle = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const statusMap = {
    '1': { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    '2': { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    '3': { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
    '4': { label: 'Reimbursed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
};
