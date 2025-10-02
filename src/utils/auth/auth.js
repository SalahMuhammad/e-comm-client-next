import { getUserPermissions, getServerRole } from "./role";
import { BASE_ROLES, ROLE_HIERARCHY } from "./permissions";

function buildRolePermissions(baseRoles, hierarchy) {
    const resolved = {};

    function resolveRole(role) {
        if (resolved[role]) return resolved[role];

        const inheritedRoles = hierarchy[role] || [];
        const perms = new Set(baseRoles[role] || []);

        for (const inherited of inheritedRoles) {
            for (const perm of resolveRole(inherited)) {
                perms.add(perm);
            }
        }

        resolved[role] = [...perms];
        return resolved[role];
    }

    for (const role of Object.keys(baseRoles)) {
        resolveRole(role);
    }

    return resolved;
}
export const ROLES = buildRolePermissions(BASE_ROLES, ROLE_HIERARCHY);

function normalizePermissions(perms) {
    if (typeof perms === "string") {
        return perms.split(/\s+/).filter(Boolean); // splits by spaces
    }
    if (Array.isArray(perms)) return perms;
    return [];
}

// Server Side
export async function getPermission(permissions, useServer = true, roles) {
    const perms = normalizePermissions(permissions);

    if (useServer) {
        const USER_PERMISSIONS = await getUserPermissions()
        return perms.some(perm => USER_PERMISSIONS?.includes(perm));
    }
    if (!roles) {
        roles = await getServerRole();
    }

    return perms.some(perm => roles.some(role => ROLES[role]?.includes(perm)));
}

// Client Side
export function usePermission(permissions, roles = [], providedPermissions = null, useServer = true) {
    const perms = normalizePermissions(permissions);
    if (useServer) {
        if (providedPermissions instanceof Set) {
            return perms.some(perm => providedPermissions.has(perm));
        }
        if (Array.isArray(providedPermissions)) {
            return perms.some(perm => providedPermissions.includes(perm));
        }
    }

    return perms.some(perm => roles.some(role => ROLES[role]?.includes(perm)));
}