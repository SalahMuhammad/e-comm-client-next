'use server'

import { apiRequest } from "@/utils/api";

export async function getCSs(queryStringParams) {
    'use server'
    const res = await apiRequest(`/api/buyer-supplier-party/${queryStringParams ? queryStringParams : ''}`, {
        method: "GET",
        cashe: "no-store",
    })

    return res
}

export async function getCS(id) {
    'use server'
    const res = await apiRequest(`/api/buyer-supplier-party/${id}/`, {
        method: "Get",
    })

    return res
}

export async function createUpdateCS(prevState, formData) {
    'use server' 
    const isUpdate = formData.get('id') ? true : false   
    // Convert FormData to JSON object
    const formDataObj = Object.fromEntries(formData.entries());
    const res = await apiRequest(`/api/buyer-supplier-party/${isUpdate ? formData.get('id') + '/' : ''}`, {
        method: `${isUpdate ? 'PUT' : 'POST'}`,
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

export async function deleteCS(id) {
    'use server'
    const res = await apiRequest(`/api/buyer-supplier-party/${id}/`, {
        method: "DELETE",
    })

    return res
}
