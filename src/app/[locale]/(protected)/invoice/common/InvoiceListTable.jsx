'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PencilIcon } from '@heroicons/react/24/outline';
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
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                <Link className="text-blue-600 hover:underline" href={`/customer-supplier/view/${inv.owner}`}>
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
                                    #<Link href={`/invoice/${type.split('/')[0]}/view/${inv.original_invoice}`} className="text-blue-600 hover:underline">
                                        {inv.original_invoice}
                                    </Link>
                                </td>
                            )}
                            <td className="flex items-center px-6 py-4 dark:text-gray-300">
                                <Link href={`/invoice/${type}/view/${inv.id}`} className="text-blue-600 hover:underline">
                                    view
                                </Link>
                                {!isRefund && (
                                    <>
                                        <DeleteButton type={type} id={inv.id} onDelete={() => handleDelete(inv.id)} />
                                        <Link 
                                            href={`/invoice/${type}/form/${inv.id}`}
                                            className="ml-2 flex items-center text-blue-600 hover:text-blue-500 group transition-colors dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            <PencilIcon className="h-4 w-4 mr-1 text-blue-500 transition-all duration-300 ease-in-out group-hover:rotate-[8deg] group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:drop-shadow-sm" />
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
