import { getPermissions, getGroups } from "./actions";
import { getTranslations, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ErrorLoading from "@/components/ErrorLoading";
import PermissionManagementClient from "./PermissionManagementClient";

async function Page() {
    const t = await getTranslations("permission-management");
    const messages = await getMessages();

    // Filter messages to include only permission-management related keys + global
    const permissionKeys = ['permission-management', 'global'];
    const filteredMessages = Object.keys(messages)
        .filter(key => permissionKeys.includes(key) || key.startsWith('permission-management'))
        .reduce((obj, key) => {
            obj[key] = messages[key];
            return obj;
        }, {});

    const [permissionsRes, groupsRes] = await Promise.all([
        getPermissions(),
        getGroups()
    ]);

    // Check auth
    if (permissionsRes?.status === 403 && permissionsRes.data?.detail?.includes('jwt')) {
        redirect(`/auth/logout?nexturl=${(await headers()).get('x-original-url') || ''}`, 'replace');
    }

    if (!permissionsRes.ok || !groupsRes.ok) {
        return <ErrorLoading name="permission-management" message="Error loading data" />;
    }

    const permissions = permissionsRes.data || [];
    const groups = groupsRes.data || [];

    return (
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {t("title")}
            </h1>

            <NextIntlClientProvider messages={filteredMessages}>
                <PermissionManagementClient
                    permissions={permissions}
                    groups={groups}
                    initialGroups={groups}
                />
            </NextIntlClientProvider>
        </div>
    );
}

export default Page;
