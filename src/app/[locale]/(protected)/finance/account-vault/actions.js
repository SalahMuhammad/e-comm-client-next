'use server'

import { apiRequest } from "@/utils/api";
import { revalidatePath } from "next/cache";


// ============================================
// BUSINESS ACCOUNTS
// ============================================

export async function getAccountList(queryStringParams) {
    'use server'
    const res = await apiRequest(`/api/finance/account-vault/${queryStringParams ? queryStringParams : ''}`, {
        method: "GET",
        cache: "no-store",
    })

    return res
}

export async function getAccount(id) {
    'use server'
    const res = await apiRequest(`/api/finance/account-vault/${id}/`, {
        method: "GET",
    })

    return res
}

export async function createUpdateAccount(prevState, formData) {
    'use server'
    const hashedID = formData.get('hashed_id')
    const isUpdate = hashedID ? true : false

    // Convert FormData to JSON
    const formDataObj = Object.fromEntries(formData.entries());
    const body = JSON.stringify(formDataObj)

    const res = await apiRequest(`/api/finance/account-vault/${isUpdate ? hashedID + '/' : ''}`, {
        method: `${isUpdate ? 'PATCH' : 'POST'}`,
        body: body,
        headers: {
            'Content-Type': 'application/json',
        },
    })

    return {
        ...res,
        formData: !res.ok && Object.fromEntries(formData.entries()),
    }
}

export async function deleteAccount(id, isDeleteFromView) {
    'use server'
    const res = await apiRequest(`/api/finance/account-vault/${id}/`, {
        method: "DELETE",
    })

    if (res.ok && !isDeleteFromView) revalidatePath('/finance/account-vault/list');

    return res
}


// ============================================
// ACCOUNT TYPES
// ============================================

export async function getAccountTypeList(queryStringParams) {
    'use server'
    const res = await apiRequest(`/api/finance/account-vault/type/${queryStringParams ? queryStringParams : ''}`, {
        method: "GET",
        cache: "no-store",
    })

    return res
}

export async function getAccountType(id) {
    'use server'
    const res = await apiRequest(`/api/finance/account-vault/type/${id}/`, {
        method: "GET",
    })

    return res
}

export async function createUpdateAccountType(prevState, formData) {
    'use server'
    const hashedID = formData.get('hashed_id')
    const isUpdate = hashedID ? true : false

    // Convert FormData to JSON
    const formDataObj = Object.fromEntries(formData.entries());
    const body = JSON.stringify(formDataObj)

    const res = await apiRequest(`/api/finance/account-vault/type/${isUpdate ? hashedID + '/' : ''}`, {
        method: `${isUpdate ? 'PATCH' : 'POST'}`,
        body: body,
        headers: {
            'Content-Type': 'application/json',
        },
    })

    return {
        ...res,
        formData: !res.ok && Object.fromEntries(formData.entries()),
    }
}

export async function deleteAccountType(id, isDeleteFromView) {
    'use server'
    const res = await apiRequest(`/api/finance/account-vault/type/${id}/`, {
        method: "DELETE",
    })

    if (res.ok && !isDeleteFromView) revalidatePath('/finance/account-vault/type/list');

    return res
}
