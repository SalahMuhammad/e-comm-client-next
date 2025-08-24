'use server';

import { apiRequest } from "@/utils/api";
import { getTranslations } from "next-intl/server";

export async function getItem(id) {
    'use server'
    const t = getTranslations("global")

    const res = await apiRequest(`/api/items/${id}/`, {
        method: "Get",
    })

    switch (res.status) {
        case 200:
            console.log(res)
            return await res.data
        case 404:
            return {err: t("errors.404")}
        default:
            // an unexpected error occurred
            console.log('An unexpected error occurred:', res.statusText);
            return {err: t("errors.etc")}
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
        if (isUpdate) {
            formData.set("images_upload", [])
        } else {
            formData.delete('images_upload');
        }
    }
  
    const response = await apiRequest(`/api/items/${isUpdate ? formData.get('id') + '/' : ''}`, {
        method: `${isUpdate ? 'PUT' : 'POST'}`,
        body: formData,
    });
    console.log(response)
    if (!response?.ok) {
        if (response.status === 400) {
            const errorData = await response.data;
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
    return await response.data;
}