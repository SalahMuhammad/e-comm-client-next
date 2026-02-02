import { getUsers, getCurrentUserProfile } from "../actions";
import PaginationControls from '@/components/PaginationControls';
import { URLQueryParameterSetter } from '@/components/inputs/index';
import { getTranslations } from "next-intl/server";
import UserTable from "./UserTable"
import ErrorLoading from "@/components/ErrorLoading";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

async function Page({ searchParams }) {
    const params = await searchParams;
    const limit = params['limit'] ?? 12;
    const offset = params['offset'] ?? 0;
    const username = params['username'] ?? '';
    const isActive = params['is_active'] ?? '';
    const isSuperuser = params['is_superuser'] ?? '';
    const isStaff = params['is_staff'] ?? '';
    const t = await getTranslations();

    // Build query string with all filters
    const queryParts = [`limit=${limit}`, `offset=${offset}`];
    if (username) queryParts.push(`username=${username}`);
    if (isActive) queryParts.push(`is_active=${isActive}`);
    if (isSuperuser) queryParts.push(`is_superuser=${isSuperuser}`);
    if (isStaff) queryParts.push(`is_staff=${isStaff}`);

    const queryString = `?${queryParts.join('&')}`;

    // Fetch users and current profile in parallel
    const [res, profileRes] = await Promise.all([
        getUsers(queryString),
        getCurrentUserProfile()
    ]);

    (res?.status === 403 && res.data?.detail?.includes('jwt')) &&
        redirect(`/auth/logout?nexturl=${(await headers()).get('x-original-url') || ''}`, 'replace')

    const data = res.data;
    const currentUserProfile = profileRes?.ok ? profileRes.data : null;

    let users = Array.isArray(data) ? data : (data?.results || []);
    let currentUser = currentUserProfile;

    // Try to find the full current user object in the fetched list
    const currentUserInList = users.find(u => u.id === currentUserProfile?.id);

    if (currentUserInList) {
        // Use the full object from the list
        currentUser = currentUserInList;
        // Remove from list to avoid duplicates
        users = users.filter(u => u.id !== currentUserProfile.id);
    } else if (currentUserProfile) {
        // Fallback: Remove if present (though unlikely if find failed above, but safe to do)
        users = users.filter(u => u.id !== currentUserProfile.id);
    }

    if (currentUser) {
        // Prepend current user (preferably the full object) to the top
        users = [currentUser, ...users];
    }

    return (
        <>
            {data?.err ?
                <ErrorLoading name="user-management.table" message={data.err} />
                :
                <>
                    <URLQueryParameterSetter
                        paramOptions={[
                            {
                                label: t('user-management.filters.username'),
                                value: 'username'
                            },
                            {
                                label: t('user-management.filters.isActive.label'),
                                value: 'is_active',
                                inputType: 'select',
                                selectOptions: [
                                    { value: 'true', label: t('user-management.filters.isActive.active') },
                                    { value: 'false', label: t('user-management.filters.isActive.inactive') }
                                ]
                            },
                            {
                                label: t('user-management.filters.isSuperuser.label'),
                                value: 'is_superuser',
                                inputType: 'select',
                                selectOptions: [
                                    { value: 'true', label: t('user-management.filters.isSuperuser.yes') },
                                    { value: 'false', label: t('user-management.filters.isSuperuser.no') }
                                ]
                            },
                            {
                                label: t('user-management.filters.isStaff.label'),
                                value: 'is_staff',
                                inputType: 'select',
                                selectOptions: [
                                    { value: 'true', label: t('user-management.filters.isStaff.yes') },
                                    { value: 'false', label: t('user-management.filters.isStaff.no') }
                                ]
                            }
                        ]}
                    />


                    <Link
                        href="/user-management/form"
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors mb-4 dark:bg-gray-600 dark:hover:bg-gray-700">
                        <PlusIcon className="h-5 w-5" />
                        {t('user-management.table.create')}
                    </Link>

                    <div className="relative overflow-x-auto shadow-md rounded-md">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        {t('user-management.table.head.username')}
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        {t('user-management.table.head.status')}
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        {t('user-management.table.head.groups')}
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        {t('user-management.table.head.permissions')}
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        {t('user-management.table.head.dateJoined')}
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        {t('user-management.table.head.actions')}
                                    </th>
                                </tr>
                            </thead>

                            <UserTable
                                users={users}
                                currentUserId={currentUserProfile?.id}
                            />

                        </table>
                    </div>


                    {data?.count !== undefined && (
                        <PaginationControls
                            resCount={data.count}
                            hasNext={data.next}
                            hasPrev={data.previous}
                        />
                    )}
                </>
            }
        </>
    )
}

export default Page
