export const BASE_ROLES = {
    guest: [
        "view.comments",
    ],
    admin: [
        "delete.comments",
        "finance.all"
    ],
};

// Define role hierarchy (inheritance)
export const ROLE_HIERARCHY = {
    guest: [],
    user: ["guest"],     // user gets guest perms
    admin: ["user"],     // admin gets user + guest perms
};