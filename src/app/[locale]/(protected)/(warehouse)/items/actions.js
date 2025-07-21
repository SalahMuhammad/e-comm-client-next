'use server';

import { apiRequest } from "@/utils/api";

export async function getItem(id) {
    'use server'
    const res = await apiRequest(`/api/items/${id}/`, {
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

export async function createUpdateItem(prevState, formData) {
    'use server';
    
    const formValues = Object.fromEntries(formData.entries());

    formData.delete("type_input");
    formData.delete("images_upload_urls");    

    const isUpdate = formData.get('id') ? true : false

    const images = formData.getAll('images_upload');

    if (images[0]?.size === 0) {
        // formData.images_upload = {}
        formData.set("images_upload", [])
        // Fix:: When 0 delete the image
        // formData.delete('images_upload');
    }
  
    const response = await apiRequest(`/api/items/${isUpdate ? formData.get('id') + '/' : ''}`, {
        method: `${isUpdate ? 'PUT' : 'POST'}`,
        body: formData,
    });

    if (response?.cMessage) {
        return {
            success: false,
            errors: { general: {status: response.status, text: response.cMessage} },
            ...formValues,
        }
    }
    if (!response?.ok) {
        if (response.status === 400) {
            const errorData = await response.json();
            return {
                success: false,
                errors: errorData || { general: '400' },
                ...formValues,
            }
        }
    }

    return {
        success: true,
    }
}

export async function getPP() {
    const response = await apiRequest('/api/pp/', { method: 'GET' });
    if (!response.ok) {
        throw new Error('Failed to fetch item types');
    }
    return await response.json();
}