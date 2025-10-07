'use server';
import { apiRequest } from "@/utils/api";
import { revalidatePath } from "next/cache";

export async function getDebtSettlements(queryStringParams) {
    return await apiRequest(`/api/finance/debt-settlement/${queryStringParams}`, {
        method: 'GET',
        cache: 'no-store'
    });
}

export async function getDebtSettlement(id) {
    return await apiRequest(`/api/finance/debt-settlement/${id}/`, {
        method: 'GET'
    });
}

export async function createUpdateDebtSettlementTransaction(prevState, formData) {
    const hashed_id = formData.get('hashed_id');
    const isUpdate = Boolean(hashed_id);
    const formDataObj = Object.fromEntries(formData.entries());

    const res = await apiRequest(`/api/finance/debt-settlement/${isUpdate ? `${hashed_id}/` : ''}`, {
        method: isUpdate ? 'PATCH' : 'POST',
        body: formData
    });

    return {
        ...res,
        formData: ! res.ok && formDataObj
    }
}

export async function deleteDebtSettlement(id, isDeleteFromView) {
    const res = await apiRequest(`/api/finance/debt-settlement/${id}/`, {
        method: 'DELETE'
    });

    if (res.ok && ! isDeleteFromView) revalidatePath('/finance/debt-settlement/list');

    return res
}

export async function changeDebtSettlementStatus(id, status) {
    return await apiRequest(`/api/finance/debt-settlement/${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: status })
    });
}
