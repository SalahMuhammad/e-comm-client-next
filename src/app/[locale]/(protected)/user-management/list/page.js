import GenericDataTable from '@/components/GenericDataTable';
import { getUsers, getCurrentUserProfile } from "../actions";
import { getTranslations } from "next-intl/server";
import UserTable from "./UserTable"
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { PermissionGateServer } from '@/components/PermissionGateServer';
import { PERMISSIONS } from '@/config/permissions.config';

export default async function Page({ searchParams }) {
    const t = await getTranslations();

    // Wrap the fetcher to also grab the current user profile
    const enhancedFetcher = async (queryString) => {
        const [usersRes, profileRes] = await Promise.all([
            getUsers(queryString),
            getCurrentUserProfile()
        ]);

        // Return standard structure that GenericDataTable expects,
        // but inject our extra profile data into the main response so renderList can use it.
        return {
            ...usersRes,
            profileData: profileRes?.ok ? profileRes.data : null
        };
    };

    return (
        <GenericDataTable
            searchParams={searchParams}
            fetchFn={enhancedFetcher}
            queryParams={[
                { key: 'limit', default: 12 },
                { key: 'offset', default: 0 },
                { key: 'name', default: '', searchLabel: t('user-management.filters.name') },
                { key: 'username', default: '', searchLabel: t('user-management.filters.username') },
                {
                    key: 'is_active',
                    default: '',
                    searchLabel: t('user-management.filters.isActive.label'),
                    inputType: 'select',
                    selectOptions: [
                        { value: 'true', label: t('user-management.filters.isActive.active') },
                        { value: 'false', label: t('user-management.filters.isActive.inactive') }
                    ]
                },
                {
                    key: 'is_superuser',
                    default: '',
                    searchLabel: t('user-management.filters.isSuperuser.label'),
                    inputType: 'select',
                    selectOptions: [
                        { value: 'true', label: t('user-management.filters.isSuperuser.yes') },
                        { value: 'false', label: t('user-management.filters.isSuperuser.no') }
                    ]
                },
                {
                    key: 'is_staff',
                    default: '',
                    searchLabel: t('user-management.filters.isStaff.label'),
                    inputType: 'select',
                    selectOptions: [
                        { value: 'true', label: t('user-management.filters.isStaff.yes') },
                        { value: 'false', label: t('user-management.filters.isStaff.no') }
                    ]
                }
            ]}
            headerSlot={
                <PermissionGateServer permission={PERMISSIONS.USERS.ADD}>
                    <Link
                        href="/user-management/form"
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors mb-4 dark:bg-gray-600 dark:hover:bg-gray-700 w-fit">
                        <PlusIcon className="h-5 w-5" />
                        {t('user-management.table.create')}
                    </Link>
                </PermissionGateServer>
            }
            emptyStateKey="global.errors"
            renderList={({ data, rows }) => {
                // Re-implement the custom sorting logict to keep current user at the top
                const currentUserProfile = data?.profileData; // Injected by our enhancedFetcher
                let users = [...rows];
                let currentUser = currentUserProfile;

                const currentUserInList = users.find(u => u.id === currentUserProfile?.id);

                if (currentUserInList) {
                    currentUser = currentUserInList;
                    users = users.filter(u => u.id !== currentUserProfile.id);
                } else if (currentUserProfile) {
                    users = users.filter(u => u.id !== currentUserProfile.id);
                }

                if (currentUser) {
                    users = [currentUser, ...users];
                }

                return (
                    <div className="relative overflow-x-auto shadow-md rounded-md">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">{t('user-management.table.head.username')}</th>
                                    <th scope="col" className="px-6 py-3">{t('user-management.table.head.status')}</th>
                                    <th scope="col" className="px-6 py-3">{t('user-management.table.head.groups')}</th>
                                    <th scope="col" className="px-6 py-3">{t('user-management.table.head.permissions')}</th>
                                    <th scope="col" className="px-6 py-3">{t('user-management.table.head.dateJoined')}</th>
                                    <th scope="col" className="px-6 py-3">{t('user-management.table.head.actions')}</th>
                                </tr>
                            </thead>
                            <UserTable users={users} currentUserId={currentUserProfile?.id} />
                        </table>
                    </div>
                );
            }}
        />
    );
}
