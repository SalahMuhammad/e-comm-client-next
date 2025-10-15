'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { EyeIcon, PencilIcon } from '@heroicons/react/24/outline';
import DeleteButton from './DeleteButton';
import ToolTip from "@/components/ToolTip";
import RepositoryPermitButton from "./RepositoryPermitButton";
import numberFormatter from "@/utils/NumberFormatter";
import { useTranslations } from "next-intl";

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
                {items.map((inv) => {
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
                                <Link className="text-blue-600 dark:text-blue-200 hover:underline dark:hover:text-white hover:text-gray-700 transition-all duration-200" href={`/customer-supplier/view/${inv.owner}`}>
                                    {inv.owner_name}
                                </Link>
                            </th>
                            <td className="px-6 py-4 max-w-xs overflow-x-auto">
                                {inv.issue_date}
                            </td>
                            <td className="px-6 py-4 max-w-xs overflow-x-auto">{inv.due_date}</td>
                            <td className="px-6 py-4 max-w-xs overflow-x-auto">{numberFormatter(inv.total_amount)}</td>
                            {!isRefund && (
                                <td className="px-6 py-4 max-w-xs overflow-x-auto">
                                    <RepositoryPermitButton id={inv.id} type={type} permitValue={inv.repository_permit} width="170px"/>
                                </td>
                            )}
                            <td className="px-6 py-4 max-w-xs overflow-x-auto">
                                <pre className="whitespace-pre-wrap">{inv.notes}</pre>
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
                                        <DeleteButton type={type} hashed_id={inv.hashed_id} onDelete={() => handleDelete(inv.id)} />
                                        <Link 
                                            href={`/invoice/${type}/form/${inv.hashed_id}`}
                                            className="ml-2 flex items-center text-blue-600 hover:text-blue-500 group transition-colors dark:text-blue-200 dark:hover:text-white"
                                        >
                                            <PencilIcon className="h-4 w-4 mr-1 transition-all duration-300 ease-in-out group-hover:rotate-[8deg] group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:drop-shadow-sm" />
                                            <span className="transition-opacity duration-300 group-hover:opacity-90 text-sm">
                                                {t("table.edit")}
                                            </span>
                                        </Link>
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
