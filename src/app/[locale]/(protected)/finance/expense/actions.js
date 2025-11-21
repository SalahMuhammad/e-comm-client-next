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
    const formDataObj = Object.fromEntries(formData.entries());

    const res = await apiRequest(`/api/finance/expenses/${isUpdate ? `${hashed_id}/` : ''}`, {
        method: isUpdate ? 'PATCH' : 'POST',
        body: formData
    });

    return {
        ...res,
        formData: ! res.ok && formDataObj
    }
}

export async function deleteExpense(hashed_id, isDeleteFromView) {
    const res = await apiRequest(`/api/finance/expenses/${hashed_id}/`, {
        method: 'DELETE'
    });

    if (res.ok && ! isDeleteFromView) revalidatePath('/finance/expenses/list');

    return res
}

export async function changeDebtSettlementStatus(id, status) {
    return await apiRequest(`/api/finance/expenses/${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: status })
    });
}
