'use server';
import { apiRequest } from "@/utils/api";
import { revalidatePath } from "next/cache";

export async function getExpenses(queryStringParams) {
    return await apiRequest(`/api/finance/expenses/${queryStringParams}`, {
        method: 'GET',
        cache: 'no-store'
    });
}

export async function getExpense(hashed_id) {
    return await apiRequest(`/api/finance/expenses/${hashed_id}/`, {
        method: 'GET'
    });
}

export async function createUpdateExpense(prevState, formData) {
    const hashed_id = formData.get('hashed_id');
    const isUpdate = Boolean(hashed_id);

    // Check if there are any file uploads (and they're not empty)
    const image = formData.get('image')

    // Remove empty file field from FormData
    if (image && image.size === 0) formData.delete('image')

    const hasFiles = image && image.size > 0

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

    const res = await apiRequest(`/api/finance/expenses/${isUpdate ? `${hashed_id}/` : ''}`, {
        method: isUpdate ? 'PATCH' : 'POST',
        body: body,
        headers: headers,
    });

    return {
        ...res,
        formData: !res.ok && Object.fromEntries(formData.entries())
    }
}

export async function deleteExpense(hashed_id, isDeleteFromView) {
    const res = await apiRequest(`/api/finance/expenses/${hashed_id}/`, {
        method: 'DELETE'
    });

    if (res.ok && !isDeleteFromView) revalidatePath('/finance/expenses/list');

    return res
}
