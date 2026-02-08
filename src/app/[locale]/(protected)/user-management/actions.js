'use server'

import { apiRequest } from "@/utils/api";

// Get all users
export async function getUsers(queryStringParams) {
    'use server'
    const res = await apiRequest(`/api/user-management/${queryStringParams ? queryStringParams : ''}`, {
        method: "GET",
        cache: "no-store",
    })

    return res
}

// Get single user by ID
export async function getUser(id) {
    'use server'
    const res = await apiRequest(`/api/user-management/${id}/`, {
        method: "GET",
    })

    return res
}

// Create or update user
export async function createUpdateUser(prevState, formData) {
    'use server'
    const isUpdate = formData.get('id') ? true : false

    // Create a new FormData instance for the API request
    const apiFormData = new FormData();

    // Add simple fields
    const fieldsToCopy = ['username', 'first_name', 'last_name', 'remove_avatar'];
    fieldsToCopy.forEach(field => {
        const value = formData.get(field);
        if (value !== null && value !== undefined) {
            apiFormData.append(field, value);
        }
    });

    // Handle boolean fields
    const booleanFields = ['is_active', 'is_staff', 'is_superuser'];
    booleanFields.forEach(field => {
        apiFormData.append(field, formData.get(field) === 'true');
    });

    // Handle password
    const password = formData.get('password');
    if (password) {
        apiFormData.append('password', password);
    }

    // Handle avatar
    const avatar = formData.get('avatar');
    if (avatar && avatar.size > 0) {
        apiFormData.append('avatar', avatar);
    }

    // Handle groups
    const groups = formData.getAll('groups')
        .filter(id => id && id !== 'null' && id !== '');
    if (groups.length > 0) {
        groups.forEach(id => apiFormData.append('groups', parseInt(id, 10)));
    } else if (isUpdate) {
        // If update and no groups selected, explicitly clear them
        apiFormData.append('clear_groups', 'true');
    }

    // Handle permissions
    const permissions = formData.getAll('user_permissions')
        .filter(id => id && id !== 'null' && id !== '');
    if (permissions.length > 0) {
        permissions.forEach(id => apiFormData.append('user_permissions', parseInt(id, 10)));
    } else if (isUpdate) {
        // If update and no permissions selected, explicitly clear them
        apiFormData.append('clear_permissions', 'true');
    }

    const res = await apiRequest(`/api/user-management/${isUpdate ? formData.get('id') + '/' : ''}`, {
        method: isUpdate ? 'PATCH' : 'POST',
        body: apiFormData,
        // Content-Type header should not be set manually for FormData
    })

    return {
        ...res,
        formData: !res.ok && Object.fromEntries(formData.entries()),
    }
}

// Delete user
export async function deleteUser(id) {
    'use server'
    const res = await apiRequest(`/api/user-management/${id}/`, {
        method: "DELETE",
    })

    return res
}
// Get current user profile
export async function getCurrentUserProfile() {
    'use server'
    const res = await apiRequest(`/api/users/user/`, {
        method: "GET",
    })

    return res
}
