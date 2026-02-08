import { getPermissions, getGroups, getGroup } from "../../actions";
import GroupFormClient from "../GroupFormClient";
import ErrorLoading from "@/components/ErrorLoading";
import NotFound from "@/components/NotFound";

async function Page({ params }) {
    const { id } = await params;
    const groupId = id?.[0]; // [[...id]] returns an array, take the first element if exists

    // Parallel data fetching
    const [permissionsRes, groupsRes] = await Promise.all([
        getPermissions(),
        getGroups()
    ]);

    let group = null;
    let error = null;

    if (groupId) {
        // If ID is present, we try to find the group directly if getGroup supports it,
        // or filter from the list if getGroup isn't available/efficient.
        // Assuming getGroup(id) exists based on actions.js check earlier.
        const groupRes = await getGroup(groupId);
        if (groupRes.ok) {
            group = groupRes.data;
        } else {
            // If group not found or error
            if (groupRes.status === 404) {
                return <NotFound name="Group" />;
            }
            error = "Error loading group";
        }
    }

    if (!permissionsRes.ok || !groupsRes.ok) {
        return <ErrorLoading name="permission-management" message="Error loading required data" />;
    }

    const permissions = permissionsRes.data || [];
    const groups = groupsRes.data || [];

    if (error) {
        return <ErrorLoading name="permission-management" message={error} />;
    }

    return (
        <GroupFormClient
            permissions={permissions}
            groups={groups}
            group={group}
            isModal={false}
        />
    );
}

export default Page;
