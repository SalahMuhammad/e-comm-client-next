'use server'

import { apiRequest } from "@/utils/api";
import { revalidatePath } from "next/cache";


export async function getInvs(type, queryStringParams) {
    'use server'
    const res = await apiRequest(`/api/${type}/${queryStringParams ? queryStringParams : ''}`, {
        method: "GET",
        cashe: "no-store",
    })

    return res
}

export async function getInv(type, id) {
    'use server'
    const res = await apiRequest(`/api/${type}/${id}/`, {
        method: "GET",
    })

    return res
}

export async function createUpdateInv(_, actualFormData) {
    'use server'
    const isUpdate = actualFormData.get('id') ? true : false
    const type = actualFormData.get('type');
    const typePrefix = type.includes('sales') ? 's_invoice_items' : 'p_invoice_items';

    const dataObject = Object.fromEntries(actualFormData.entries());

    // Transform items
    const transformedData = {};
    const items = [];
    const itemPattern = /^items\[(\d+)\]\[(.+)\]$/;

    // Copy non-item fields and collect items
    Object.keys(dataObject).forEach(key => {
        const match = key.match(itemPattern);
        if (match) {
            const index = parseInt(match[1]);
            const property = match[2];
            if (!items[index]) {
                items[index] = {};
            }
            items[index][property] = dataObject[key];
        } else {
            transformedData[key] = dataObject[key];
        }
    }); 
    // Add transformed items
    transformedData[typePrefix] = items.filter(item => item); // Remove empty slots

    const res = await apiRequest(`/api/${type}/${(isUpdate && ! actualFormData.get('original_invoice')) ? actualFormData.get('id') + '/' : ''}`, {
        method: `${(isUpdate && ! actualFormData.get('original_invoice')) ? 'PATCH' : 'POST'}`,
        body: JSON.stringify(transformedData),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const formData = ! res.ok && transformedData

    return {
        ...res,
        formData
    }
}

export async function deleteInv(type, id) {
    'use server'
    const res = await apiRequest(`/api/${type}/${id}/`, {
        method: "DELETE",
    })
    
    if (res.ok) revalidatePath('/invoice/sales/list');

    return res
}

export async function getDefaultRepository(name) {
    'use server'
    const res = await apiRequest(`/api/repositories/?s=${name}`, {
        method: "GET",
    })

    if (res.ok) {
        return res?.data.results[0] || null
    }
}

export async function getCreditBalance(owner, untilDate) {
    'use server'
    const res = await apiRequest(`api/buyer-supplier-party/owner/view/${owner}/?date=${untilDate}`, {
        method: "GET",
    })

    return res
}

export async function changeRepositoryPermit(id, type) {
    'use server'
    const res = await apiRequest(`api/${type === 'sales' ? 'sales' : 'purchases'}/${id}/change-repository-permit/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        }
    })

    return res
}
