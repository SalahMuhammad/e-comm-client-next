'use server'

import { apiRequest } from "@/utils/api";
import { revalidatePath } from "next/cache";

/**
 * Get list of all internal money transfers with optional query parameters
 */
export async function getTransfers(queryStringParams) {
    'use server'
    const res = await apiRequest(`/api/finance/internal-money-transfer/${queryStringParams ? queryStringParams : ''}`, {
        method: "GET",
        cache: "no-store",
    })

    return res
}

/**
 * Get transfer details by ID
 */
export async function getTransfer(id) {
    'use server'
    const res = await apiRequest(`/api/finance/internal-money-transfer/${id}/`, {
        method: "GET",
    })

    return res
}

/**
 * Create or update an internal money transfer
 * Determines create vs update based on presence of 'hashed_id' in formData
 */
export async function createUpdateTransfer(prevState, formData) {
    'use server'
    const hashedID = formData.get('hashed_id')
    const isUpdate = hashedID ? true : false

    // Check if there are any file uploads (and they're not empty)
    const proof = formData.get('proof')

    // Remove empty file field from FormData
    if (proof && proof.size === 0) formData.delete('proof')

    const hasFiles = proof && proof.size > 0

    let body, headers

    if (hasFiles) {
        // Use FormData for file uploads (multipart/form-data)
        body = formData
        headers = {} // Let browser set Content-Type with boundary
    } else {
        // Use JSON for regular data
        const formDataObj = Object.fromEntries(formData.entries());
        body = JSON.stringify(formDataObj)
        headers = {
            'Content-Type': 'application/json',
        }
    }

    const res = await apiRequest(`/api/finance/internal-money-transfer/${isUpdate ? hashedID + '/' : ''}`, {
        method: `${isUpdate ? 'PATCH' : 'POST'}`,
        body: body,
        headers: headers,
    })
    console.log(res)
    return {
        ...res,
        formData: !res.ok && Object.fromEntries(formData.entries()),
    }
}

/**
 * Delete a transfer by ID
 * Revalidates the transfer list path after successful deletion
 */
export async function deleteTransfer(id) {
    'use server'
    const res = await apiRequest(`/api/finance/internal-money-transfer/${id}/`, {
        method: "DELETE",
    })

    if (res.ok) {
        revalidatePath('/finance/internal-money-transfer/list');
    }

    return res
}
