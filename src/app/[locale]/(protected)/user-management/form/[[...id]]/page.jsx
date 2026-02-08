import { getUser } from "../../actions";
import { getGroups, getPermissions } from "../../../permission-management/actions";
import UserForm from "../UserForm";
import { getTranslations } from "next-intl/server";
import ErrorLoading from "@/components/ErrorLoading";

async function Page({ params }) {
    const resolvedParams = await params;
    const id = resolvedParams?.id?.[0];
    const t = await getTranslations("user-management");

    let user = null;
    let groups = [];
    let permissions = [];

    // Fetch groups and permissions for the selector
    const [groupsRes, permissionsRes] = await Promise.all([
        getGroups(),
        getPermissions()
    ]);

    if (groupsRes.ok) {
        groups = groupsRes.data || [];
    }

    if (permissionsRes.ok) {
        permissions = permissionsRes.data || [];
    }

    // If editing, fetch user data
    if (id) {
        const res = await getUser(id);
        if (!res.ok) {
            return <ErrorLoading name="user-management" message={res.data?.detail || "Error loading user"} />;
        }
        user = res.data;
    }

    return (
        <div className="max-w-4xl mx-auto w-full">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {id ? t("form.editTitle") : t("form.createTitle")}
            </h1>
            <UserForm
                user={user}
                groups={groups}
                permissions={permissions}
            />
        </div>
    );
}

export default Page;
