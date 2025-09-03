'use server'

import { apiRequest } from "@/utils/api";
import { revalidatePath } from "next/cache";

export async function getRefundedItems(queryStringParams) {
    'use server'
    const res = await apiRequest(`/api/refillable-sys/refunded-items/${queryStringParams}`, {
        method: 'GET'
    });
    
    return res
}

export async function createRefundTransaction(_, formData) {
    'use server'
    const dataObject = Object.fromEntries(formData.entries());
    const res = await apiRequest(`/api/refillable-sys/refunded-items/`, {
        method: 'POST',
        body: JSON.stringify(dataObject),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    return {
        ...res,
        formData: ! res.ok && dataObject
    }
}


export async function deleteRefundedItems(id) {
    'use server'
    const res = await apiRequest(`/api/refillable-sys/refunded-items/${id}/`, {
        method: 'DELETE'
    });
    
    if (res.ok) revalidatePath('/refillable-items/refund/list')

    return res
}

export async function getRefilledItems(queryStringParams) {
    'use server'
    const res = await apiRequest(`/api/refillable-sys/refilled-items/${queryStringParams}`, {
        method: 'GET'
    });
    
    return res
}

export async function createRefilledItemsTransaction(_, formData) {
    'use server'
    const dataObject = Object.fromEntries(formData.entries());
    const res = await apiRequest(`/api/refillable-sys/refilled-items/`, {
        method: 'POST',
        body: JSON.stringify(dataObject),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    return {
        ...res,
        formData: ! res.ok && dataObject
    }
}

export async function deleteRefilledTransaction(id) {
    'use server'
    const res = await apiRequest(`/api/refillable-sys/refilled-items/${id}/`, {
        method: 'DELETE'
    });

    if (res.ok) revalidatePath('/refillable-items/refilled/list');
    
    return res
}

