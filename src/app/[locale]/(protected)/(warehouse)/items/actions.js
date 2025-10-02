'use server';

import { apiRequest } from "@/utils/api";
import { getTranslations } from "next-intl/server";

export async function getItem(id) {
    'use server'
    const t = getTranslations("global")

    const res = await apiRequest(`/api/items/${id}/`, {
        method: "Get",
    })

    return res
}

export async function createUpdateItem(prevState, formData) {
    'use server';
    const formValues = Object.fromEntries(formData.entries());
    const isUpdate = formData.get('id') ? true : false

    const response = await apiRequest(`/api/items/${isUpdate ? formData.get('id') + '/' : ''}`, {
        method: `${isUpdate ? 'PUT' : 'POST'}`,
        body: formData,
    });
    
    return {
        ...response,
        ...response?.ok ? {} : formValues
    }
}

export async function getPP() {
    const response = await apiRequest('/api/pp/', { method: 'GET' });
    if (!response.ok) {
        throw new Error('Failed to fetch item types');
    }
    return await response.data;
}