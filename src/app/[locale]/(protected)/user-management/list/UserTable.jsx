'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DeleteButton from './DeleteButton';
import { PencilIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import LocalizedDate from '@/components/LocalizedDate';
import UserAvatar from '@/components/UserAvatar';

export default function UserTable({ users, currentUserId }) {
    const t = useTranslations("user-management")
    const [items, setItems] = useState(users);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        setItems(users);
    }, [users]);

    const handleDelete = (id) => {
        // trigger fade-out
        setDeletingId(id);

        // wait for animation before removing
        setTimeout(() => {
            setItems(prev => prev.filter(user => user.id !== id));
            setDeletingId(null);
        }, 300); // match the transition duration
    };

    return (
        <tbody>
            {items.map((user) => {
                const isDeleting = deletingId === user.id;
                return (
                    <tr
                        key={user.id}
                        className={`
              transition-all duration-300 ease-in-out 
              ${isDeleting ? 'opacity-0 -translate-x-5 pointer-events-none' : ''}
              bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600
            `}
                    >
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            <div className="flex items-center gap-3">
                                {/* User Avatar */}
                                <div className="flex-shrink-0 h-10 w-10">
                                    <UserAvatar
                                        username={user.username}
                                        imageUrl={user.avatar}
                                        className="h-10 w-10 rounded-full text-sm"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        {user.first_name || user.last_name
                                            ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                                            : user.username
                                        }
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            @{user.username}
                                        </span>
                                        {user.is_superuser && (
                                            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded">
                                                {t('table.superuser')}
                                            </span>
                                        )}
                                        {user.is_staff && (
                                            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                                                {t('form.isStaff')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </th>
                        <td className="px-6 py-4">
                            {user.is_active ? (
                                <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                                    <CheckCircleIcon className="h-4 w-4" />
                                    {t('table.active')}
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400">
                                    <XCircleIcon className="h-4 w-4" />
                                    {t('table.inactive')}
                                </span>
                            )}
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                                {user.groups && user.groups.length > 0 ? (
                                    user.groups.map((group, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded"
                                        >
                                            {typeof group === 'string' ? group : group.name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded">
                                {user.permission_count ?? 0} {t('table.permissionsCount')}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            {user.date_joined ? (
                                <LocalizedDate date={user.date_joined} />
                            ) : (
                                '-'
                            )}
                        </td>
                        <td className="flex items-center px-6 py-4 justify-end">
                            {user.id !== currentUserId ? (
                                <>
                                    <Link
                                        href={`/user-management/form/${user.id}`}
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
                                            {t("table.edit")}
                                        </span>
                                    </Link>

                                    <DeleteButton id={user.id} onDelete={() => handleDelete(user.id)} />
                                </>
                            ) : (
                                <span className="text-xs text-gray-400 italic px-2">
                                    {/* Current User */}
                                    -
                                </span>
                            )}
                        </td>
                    </tr>
                );
            })}
        </tbody>
    );
}
