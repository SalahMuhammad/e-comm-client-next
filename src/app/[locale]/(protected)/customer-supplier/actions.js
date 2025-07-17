'use server'

import { apiRequest } from "@/utils/api";


export async function getCSs(queryStringParams) {
    'use server'
    const res = await apiRequest(`/api/buyer-supplier-party/${queryStringParams ? queryStringParams : ''}`, {
        method: "GET",
        cashe: "no-store",
    })

    return await res.json()
}

export async function getCS(id) {
    'use server'
    const res = await apiRequest(`/api/buyer-supplier-party/${id}/`, {
        method: "Get",
    })

    switch (res.status) {
        case 200:
            return await res.json()
        case 404:
            console.log('not found')
            // not found
            return null
        default:
            // an unexpected error occurred
            console.log('An unexpected error occurred:', res.statusText);
            return null
    }
}

export async function createUpdateCS(formData) {
    'use server' 
    const isUpdate = formData.get('id') ? true : false   
    // Convert FormData to JSON object
    const formDataObj = {};
    for (const [key, value] of formData.entries()) {
        formDataObj[key] = value;
    }
    const res = await apiRequest(`/api/buyer-supplier-party/${isUpdate ? formData.get('id') + '/' : ''}`, {
        method: `${isUpdate ? 'PUT' : 'POST'}`,
        body: JSON.stringify(formDataObj),
        headers: {
            'Content-Type': 'application/json',
        },
    })

    switch (res.status) {
        case 200:
        case 201:

            console.log('success 200')
            // success message in case of update and redirect in create just success message
            // success
            break;
        case 400:
            console.log('bad request')
            // failed validation
            return await res.json()
            break
        default:
            // an unexpected error occurred
            console.log('An unexpected error occurred:', res.statusText);
            break;
    }
}

export async function deleteCS(id) {
    'use server'
    const res = await apiRequest(`/api/buyer-supplier-party/${id}/`, {
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
