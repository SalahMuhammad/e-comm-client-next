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

    try {
        // Fetch groups and permissions for the selector
        const [groupsRes, permissionsRes] = await Promise.all([
            getGroups(),
            getPermissions()
        ]);

        if (groupsRes?.ok) {
            groups = groupsRes.data || [];
        }

        if (permissionsRes?.ok) {
            permissions = permissionsRes.data || [];
        }

        // If editing, fetch user data
        if (id) {
            const res = await getUser(id);
            if (!res?.ok) {
                return <ErrorLoading name="user-management" message={res?.data?.detail || "Error loading user"} />;
            }
            user = res.data;
        }
    } catch (error) {
        console.error("Error fetching user management data:", error);
    }

    return (
        <UserForm
            user={user}
            groups={groups}
            permissions={permissions}
        />
    );
}

export default Page;
