'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import Link from 'next/link';
import numberFormatter from "@/utils/NumberFormatter";
import DeleteButton from './DeleteButton';

export default function Table({ type, items, setItems }) {
    const t = useTranslations();

    // Determine base paths based on type
    const basePath = type === 'account' ? '/finance/account-vault' : '/finance/account-vault/type';

    return (
        <tbody>
            {items?.map((item) => (
                <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                    {type === 'account' ? (
                        // Business Account Row
                        <>
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {item.account_name}
                            </th>
                            <td className="px-6 py-4">
                                {item.account_type_name}
                            </td>
                            <td className="px-6 py-4">
                                {item.account_number || '-'}
                            </td>
                            <td className="px-6 py-4">
                                {item.phone_number || '-'}
                            </td>
                            <td className="px-6 py-4">
                                {item.bank_name || '-'}
                            </td>
                            <td className="px-6 py-4">
                                {numberFormatter(item.current_balance)}
                            </td>
                            <td className="px-6 py-4 flex items-center justify-center">
                                <StatusBadge isActive={item.is_active} t={t} />
                            </td>
                        </>
                    ) : (
                        // Account Type Row
                        <>
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {item.name}
                            </th>
                            <td className="px-6 py-4">
                                {new Date(item.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                                {new Date(item.updated_at).toLocaleDateString()}
                            </td>
                        </>
                    )}

                    <td className="px-6 py-4 align-middle">
                        <div className="flex items-center">
                            <Link
                                className="ml-2 flex items-center text-blue-700 hover:text-blue-800 group transition duration-300 dark:text-blue-200 dark:hover:text-white"
                                href={`${basePath}/view/${item.hashed_id}`}
                            >
                                <EyeIcon
                                    className="h-5 w-5 mr-1 transition-transform duration-300 ease-in-out transform origin-center group-hover:scale-125 group-hover:-translate-y-1 group-hover:drop-shadow-sm"
                                />
                                <span className="transition-opacity duration-300 group-hover:opacity-90 text-sm">
                                    {t("finance.table.view")}
                                </span>
                            </Link>

                            <Link
                                href={`${basePath}/form/${item.hashed_id}`}
                                className="ml-2 flex items-center text-blue-600 hover:text-blue-800 group transition duration-300 dark:text-blue-200 dark:hover:text-white"
                            >
                                <PencilIcon
                                    className="
                                        h-4 w-4 mr-1
                                        transition-all duration-300 ease-in-out
                                        group-hover:rotate-[8deg]
                                        group-hover:-translate-y-0.5
                                        group-hover:scale-110
                                        group-hover:drop-shadow-sm
                                    "
                                />
                                <span className="transition-opacity duration-300 group-hover:opacity-90 text-sm">
                                    {t("finance.table.edit")}
                                </span>
                            </Link>

                            <DeleteButton type={type} id={item.hashed_id} isViewPage={false} />
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
}

function StatusBadge({ isActive, t }) {
    const config = isActive ? {
        label: t('accountVault.status.active'),
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        dotColor: 'bg-green-500'
    } : {
        label: t('accountVault.status.inactive'),
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        dotColor: 'bg-gray-500'
    };

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${config.bgColor} ${config.textColor}`}
        >
            <span className={`w-2 h-2 rounded-full ${config.dotColor} mr-2`}></span>
            {config.label}
        </span>
    );
}
