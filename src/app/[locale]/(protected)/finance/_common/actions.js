'use server'

import { apiRequest } from "@/utils/api";
import { revalidatePath } from "next/cache";


export async function getList(type, queryStringParams) {
    'use server'
    const res = await apiRequest(`/api/finance/${type}/${queryStringParams ? queryStringParams : ''}`, {
        method: "GET",
        cashe: "no-store",
    })

    return res
}

export async function getPayment(id, type) {
    'use server'
    if (type === 'payments') {
        type = 'payment'
    }

    const res = await apiRequest(`/api/finance/${type}/${id}/`, {
        method: "GET",
    })

    return res
}

export async function createUpdateTransaction(prevState, formData) {
    'use server'
    let type = formData.get('type')
    if (type === 'payments') {
        type = 'payment'
    }

    const hashedID = formData.get('hashed_id')
    const isUpdate = hashedID ? true : false

    // Check if there are any file uploads (and they're not empty)
    const paymentProof = formData.get('payment_proof')
    const image = formData.get('image')
    const proof = formData.get('proof')

    // Remove empty file fields from FormData
    if (paymentProof && paymentProof.size === 0) formData.delete('payment_proof')
    if (image && image.size === 0) formData.delete('image')
    if (proof && proof.size === 0) formData.delete('proof')

    const hasFiles = (paymentProof && paymentProof.size > 0) || (image && image.size > 0) || (proof && proof.size > 0)

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

    const res = await apiRequest(`/api/finance/${type}/${isUpdate ? hashedID + '/' : ''}`, {
        method: `${isUpdate ? 'PATCH' : 'POST'}`,
        body: body,
        headers: headers,
    })

    return {
        ...res,
        formData: !res.ok && Object.fromEntries(formData.entries()),
    }
}

export async function deletePayment(type, id, isDeleteFromView) {
    'use server'
    const res = await apiRequest(`/api/finance/${type}/${id}/`, {
        method: "DELETE",
    })

    if (res.ok && !isDeleteFromView) revalidatePath('/finance/payments/list');

    return res
}

export async function updateStatus(id, type, paid) {
    'use server'
    const res = await apiRequest(`api/payment/${type}/${id}/`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paid: !paid })
    })

    return res
}

export async function getCompanyDetails() {
    'use server'
    const res = await apiRequest(`company-details/`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    })

    return res
}
