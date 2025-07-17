'use server'

import { apiRequest } from "@/utils/api";


export async function getRepositories(queryStringParams) {
    'use server'
    const res = await apiRequest(`/api/repositories/${queryStringParams ? queryStringParams : ''}`, {
        method: "GET",
        cashe: "no-store",
    })

    if (res.cMessage) {
        return {err: res.cMessage}
    }

    return await res.json()
}

export async function getRepository(id) {
    'use server'
    const res = await apiRequest(`/api/repositories/${id}/`, {
        method: "Get",
    })

    switch (res.status) {
        case 200:
            return await res.json()
        case 404:
            console.log('not found')
            // not found
            return {err: res.cMessage}
        default:
            // an unexpected error occurred
            console.log('An unexpected error occurred:', res.statusText);
            return {err: res.cMessage}
    }
}

export async function createUpdateRepository(prevState, formData) {
    'use server'
    const isUpdate = formData.get('id') ? true : false
    // Convert FormData to JSON object
    const formDataObj = {};
    for (const [key, value] of formData.entries()) {
        formDataObj[key] = value;
    }
    const res = await apiRequest(`/api/repositories/${isUpdate ? formData.get('id') + '/' : ''}`, {
        method: `${isUpdate ? 'PUT' : 'POST'}`,
        body: JSON.stringify(formDataObj),
        headers: {
            'Content-Type': 'application/json',
        },
    })

    const formValues = Object.fromEntries(formData.entries());

    switch (res.status) {
        case 200:
        case 201:
            return {
                success: true,
            }
            break;
        case 400:
            return {
                success: false,
                errors: await res.json(),
                ...formValues,
            }
            break
        default:
            return {
                success: false,
                errors: res?.cMessage || { general: res.status },
                ...formValues,
            }
    }
}

export async function deleteRepository(id) {
    'use server'
    const res = await apiRequest(`/api/repositories/${id}/`, {
        method: "DELETE",
    })

    switch (res.status) {
        case 204:
            console.log('success')
            // success
            return { success: true }
        case 400:
            // bad request
            console.log('bad requesrt')
            return { error: (await res.json()).detail }
        default:
            // an unexpected error occurred
            console.log('An unexpected error occurred:', res.statusText);
            return { error: 'An unexpected error occurred' }
    }
}
