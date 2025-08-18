'use server'

import { apiRequest } from "@/utils/api";


export async function getRepositories(queryStringParams) {
    'use server'
    const res = await apiRequest(`/api/repositories/${queryStringParams ? queryStringParams : ''}`, {
        method: "GET",
        cashe: "no-store",
    })

    return res
}

export async function getRepository(id) {
    'use server'
    const res = await apiRequest(`/api/repositories/${id}/`, {
        method: "Get",
    })

    return res
}

export async function createUpdateRepository(prevState, formData) {
    'use server'
    const isUpdate = formData.get('id') ? true : false
    // Convert FormData to JSON object
    const formDataObj = Object.fromEntries(formData.entries());
    const res = await apiRequest(`/api/repositories/${isUpdate ? formData.get('id') + '/' : ''}`, {
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

export async function deleteRepository(id) {
    'use server'
    const res = await apiRequest(`/api/repositories/${id}/`, {
        method: "DELETE",
    })

    return res
}
