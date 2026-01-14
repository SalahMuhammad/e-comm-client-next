'use server';
import { apiRequest } from "@/utils/api";
import { revalidatePath } from "next/cache";

// ============================================
// EXPENSE CATEGORIES
// ============================================

export async function getCategoryList(queryStringParams) {
    return await apiRequest(`/api/finance/expenses/category/list/${queryStringParams ? queryStringParams : ''}`, {
        method: 'GET',
        cache: 'no-store'
    });
}

export async function getCategory(id) {
    return await apiRequest(`/api/finance/expenses/category/${id}/`, {
        method: 'GET'
    });
}

export async function createUpdateCategory(prevState, formData) {
    const id = formData.get('id');
    const isUpdate = Boolean(id);

    // Convert FormData to JSON
    const formDataObj = Object.fromEntries(formData.entries());
    const body = JSON.stringify(formDataObj);

    const res = await apiRequest(`/api/finance/expenses/category/${isUpdate ? `${id}/` : ''}`, {
        method: isUpdate ? 'PATCH' : 'POST',
        body: body,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return {
        ...res,
        formData: !res.ok && Object.fromEntries(formData.entries()),
    }
}

export async function deleteCategory(id, isDeleteFromView) {
    const res = await apiRequest(`/api/finance/expenses/category/${id}/`, {
        method: 'DELETE'
    });

    if (res.ok && !isDeleteFromView) revalidatePath('/finance/expense/category/list');

    return res
}
