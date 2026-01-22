'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { EyeIcon, PencilIcon } from '@heroicons/react/24/outline';
import DeleteButton from './DeleteButton';
import ToolTip from "@/components/ToolTip";
import RepositoryPermitButton from "./RepositoryPermitButton";
import numberFormatter from "@/utils/NumberFormatter";
import { useTranslations } from "next-intl";
import TableNote from '@/components/TableNote';

export default function InvoiceListTable({ initialData, type }) {
    const t = useTranslations("invoice");
    const [items, setItems] = useState(initialData);
    const [deletingId, setDeletingId] = useState(null);
    const isRefund = type.split('/')[1] || false;

    useEffect(() => {
        setItems(initialData);
    }, [initialData]);

    const handleDelete = (id) => {
        setDeletingId(id);
        setTimeout(() => {
            setItems(prev => prev.filter(inv => inv.id !== id));
            setDeletingId(null);
        }, 300);
    };

    return (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 transition-colors duration-200">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
                <tr>
                    <th scope="col" className="px-6 py-3">{t('table.head.owner')}</th>
                    <th scope="col" className="px-6 py-3">{t('table.head.issueDate')}</th>
                    <th scope="col" className="px-6 py-3">{t('table.head.dueDate')}</th>
                    <th scope="col" className="px-6 py-3">{t('table.head.totalAmount')}</th>
                    <th scope="col" className="px-6 py-3">{t('table.head.totalAmount')}</th>
                    <th scope="col" className="px-6 py-3">{t('table.head.status')}</th>
                    {!isRefund && (
                        <th scope="col" className="px-6 py-3">{t('table.head.repositoryPremit')}</th>
                    )}
                    <th scope="col" className="px-6 py-3">{t('table.head.notes')}</th>
                    {isRefund && (
                        <th scope="col" className="px-6 py-3">{t('table.head.originalInvoice')}</th>
                    )}
                    <th scope="col" className="px-6 py-3">{t('table.head.actions')}</th>
                </tr>
            </thead>
            <tbody>
                {items?.map((inv) => {
                    const isDeleting = deletingId === inv.id;
                    return (
                        <tr
                            key={inv.id}
                            className={`
                                transition-all duration-300 ease-in-out
                                ${isDeleting ? 'opacity-0 -translate-x-5 pointer-events-none' : ''}
                                bg-white border-b dark:bg-gray-800 dark:border-gray-700 
                                hover:bg-gray-50 dark:hover:bg-gray-700
                            `}
                        >
                            <th scope="row" className="px-6 py-4 w-[12rem] max-w-[12rem] font-medium text-gray-900 whitespace-normal">
                                {inv.owner ? (
                                    <Link className="text-blue-600 dark:text-blue-200 hover:underline dark:hover:text-white hover:text-gray-700 transition-all duration-200" href={`/customer-supplier/view/${inv.owner}`}>
                                        {inv.owner_name}
                                    </Link>
                                ) : (
                                    <span className="text-gray-500 dark:text-gray-400">_</span>
                                )}
                            </th>
                            <td className="px-6 py-4 max-w-xs overflow-x-auto whitespace-nowrap">
                                {inv.issue_date}
                            </td>
                            <td className="px-6 py-4 max-w-xs overflow-x-auto whitespace-nowrap">{inv.due_date}</td>
                            <td className="px-6 py-4 max-w-xs overflow-x-auto">{numberFormatter(inv.total_amount)}</td>
                            <td className="px-6 py-4 max-w-xs overflow-x-auto">{numberFormatter(inv.remaining_balance)}</td>
                            <td className="px-6 py-4 max-w-xs overflow-x-auto">
                                <StatusBadge status={inv.status} t={t} />
                            </td>
                            {!isRefund && (
                                <td className="px-6 py-4 max-w-xs overflow-x-auto">
                                    <RepositoryPermitButton id={inv.id} type={type} permitValue={inv.repository_permit} width="170px" />
                                </td>
                            )}

                            <td className="px-6 py-4 max-w-xs">
                                <TableNote note={inv.notes} />
                            </td>
                            {isRefund && (
                                <td className="px-6 py-4 max-w-xs overflow-x-auto">
                                    <Link href={`/invoice/${type.split('/')[0]}/view/${inv.original_invoice_hashed_id}`} className="text-blue-600 dark:text-blue-200 hover:underline dark:hover:text-white hover:text-gray-700 transition-all duration-200">
                                        #{inv.original_invoice_hashed_id}
                                    </Link>
                                </td>
                            )}
                            <td className="flex items-center px-6 py-4 dark:text-gray-300">
                                <Link className="ml-2 flex items-center text-blue-700 hover:text-blue-800 group transition duration-300 dark:text-blue-200 dark:hover:text-white" href={`/invoice/${type}/view/${inv.hashed_id}`}>
                                    <EyeIcon
                                        className="h-5 w-5 mr-1 transition-transform duration-300 ease-in-out transform origin-center group-hover:scale-125 group-hover:-translate-y-1 group-hover:drop-shadow-sm"
                                    />
                                    <span className="transition-opacity duration-300 group-hover:opacity-90 text-sm">
                                        {t("table.view")}
                                    </span>
                                </Link>
                                {!isRefund && (
                                    <>
                                        <Link
                                            href={`/invoice/${type}/form/${inv.hashed_id}`}
                                            className="ml-2 flex items-center text-blue-600 hover:text-blue-500 group transition-colors dark:text-blue-200 dark:hover:text-white"
                                        >
                                            <PencilIcon className="h-4 w-4 mr-1 transition-all duration-300 ease-in-out group-hover:rotate-[8deg] group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:drop-shadow-sm" />
                                            <span className="transition-opacity duration-300 group-hover:opacity-90 text-sm">
                                                {t("table.edit")}
                                            </span>
                                        </Link>
                                        <Link
                                            href={`/invoice/${type}/refund/form/${inv.hashed_id}`}
                                            className="ml-2 flex items-center text-purple-600 hover:text-purple-500 group transition-colors dark:text-purple-400 dark:hover:text-white"
                                        >
                                            <svg className="h-4 w-4 mr-1 transition-all duration-300 ease-in-out group-hover:rotate-[8deg] group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:drop-shadow-sm" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
                                            </svg>
                                            <span className="transition-opacity duration-300 group-hover:opacity-90 text-sm">
                                                {t("table.refund")}
                                            </span>
                                        </Link>
                                        <DeleteButton type={type} hashed_id={inv.hashed_id} onDelete={() => handleDelete(inv.id)} />
                                    </>
                                )}
                                <ToolTip obj={inv} className="ml-3" />
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}


const StatusBadge = ({ status, t }) => {
    const getStatusConfig = (status) => {
        const configs = {
            3: { label: t('form.statusOptions.3'), classes: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
            4: { label: t('form.statusOptions.4'), classes: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
            5: { label: t('form.statusOptions.5'), classes: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
            6: { label: t('form.statusOptions.6'), classes: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" },
            default: { label: t('form.statusOptions.default'), classes: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300" }
        };

        return configs[status] || configs.default;
    };

    const { label, classes } = getStatusConfig(status);

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${classes}`}>
            {label}
        </span>
    );
};
