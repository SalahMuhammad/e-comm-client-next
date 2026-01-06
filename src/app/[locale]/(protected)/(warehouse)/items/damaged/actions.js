"use server";
import { apiRequest } from "@/utils/api";

export async function getDamagedItems(queryStringParams) {
    "use server";
    const res = await apiRequest(`/api/items/damaged-items/${queryStringParams ? queryStringParams : ''}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cashe: "no-store",
    })
    return res
}

export async function deleteDamagedItem(id) {
    "use server";
    const res = await apiRequest(`/api/items/damaged-items/${id}/`, {
        method: "DELETE",
    })

    return res
}

export async function getDamagedItem(id) {
    'use server'
    const res = await apiRequest(`/api/items/damaged-items/${id}/`, {
        method: "Get",
    })

    return res
}

export async function createUpdateDamagedItem(_, formData) {
    'use server';
    const isUpdate = formData.get('id') ? true : false

    const formValues = Object.fromEntries(formData.entries());



    const response = await apiRequest(`/api/items/damaged-items/${isUpdate ? formData.get('id') + '/' : ''}`, {
        method: `${isUpdate ? 'PUT' : 'POST'}`,
        body: formData,
    });

    return {
        ...response,
        ...response?.ok ? {} : formValues
    }
}
