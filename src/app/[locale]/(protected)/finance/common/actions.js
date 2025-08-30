'use server'

import { apiRequest } from "@/utils/api";
import { revalidatePath } from "next/cache";


export async function getList(type, queryStringParams) {
    'use server'
    const res = await apiRequest(`/api/payment/${type}/${queryStringParams ? queryStringParams : ''}`, {
        method: "GET",
        cashe: "no-store",
    })

    return res
}

export async function getPayment(id, type) {
    'use server'
    const res = await apiRequest(`/api/payment/${type}/${id}/`, {
        method: "Get",
    })

    return res
}

export async function createUpdateTransaction(formData, type) {
    'use server'
    const isUpdate = formData.get('id') ? true : false
    const formDataObj = Object.fromEntries(formData.entries());
    const res = await apiRequest(`/api/payment/${type}/${isUpdate ? formData.get('id') + '/' : ''}`, {
        method: `${isUpdate ? 'PATCH' : 'POST'}`,
        body: JSON.stringify(formDataObj),
        headers: {
            'Content-Type': 'application/json',
        },
    })

    return {
        ...res,
        formData: ! res.ok && formDataObj,
    }
}

export async function deletePayment(type, id, isDeleteFromView) {
    'use server'
    const res = await apiRequest(`/api/payment/${type}/${id}/`, {
        method: "DELETE",
    })

    if (res.ok && ! isDeleteFromView) revalidatePath('/finance/payments/list');

    return res
}

export async function updateStatus(id, type, paid) {
    'use server'
    const res = await apiRequest(`api/payment/${type}/${id}/`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paid: ! paid })
    })

    return res
}

export async function getCompanyDetails() {
    'use server'
    const res = await apiRequest(`company-details/`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    })

    return res
}
