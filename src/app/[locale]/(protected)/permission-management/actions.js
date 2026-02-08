'use server'

import { apiRequest } from "@/utils/api";

// Get all permissions
export async function getPermissions() {
    'use server'
    const res = await apiRequest(`/api/permissions/permissions/`, {
        method: "GET",
        cache: "no-store",
    })

    return res
}

// Get all groups
export async function getGroups() {
    'use server'
    const res = await apiRequest(`/api/permissions/groups/`, {
        method: "GET",
        cache: "no-store",
    })

    return res
}

// Get single group by ID
export async function getGroup(id) {
    'use server'
    const res = await apiRequest(`/api/permissions/groups/${id}/`, {
        method: "GET",
    })

    return res
}

// Create or update group
export async function createUpdateGroup(prevState, formData) {
    'use server'
    const isUpdate = formData.get('id') ? true : false

    // Build group data object
    const groupData = {
        name: formData.get('name'),
    }

    // Get permissions as array of integers
    const permissions = formData.getAll('permissions')
        .filter(id => id && id !== 'null' && id !== '')
        .map(id => parseInt(id, 10))

    groupData.permissions = permissions

    const res = await apiRequest(`/api/permissions/groups/${isUpdate ? formData.get('id') + '/' : ''}`, {
        method: isUpdate ? 'PATCH' : 'POST',
        body: JSON.stringify(groupData),
        headers: {
            'Content-Type': 'application/json',
        },
    })

    return {
        ...res,
        formData: !res.ok && Object.fromEntries(formData.entries()),
    }
}

// Delete group
export async function deleteGroup(id) {
    'use server'
    const res = await apiRequest(`/api/permissions/groups/${id}/`, {
        method: "DELETE",
    })

    return res
}
