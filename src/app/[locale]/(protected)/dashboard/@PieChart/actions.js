'use server';
import { apiRequest } from "@/utils/api";

export async function getSales() {
    'use server'
    const res = await apiRequest(`/api/sales/s/total/`, {
        method: "Get",
    })

    return res
}

export async function getPayments() {
    'use server'
    const res = await apiRequest(`api/payment/payments/p/total/`, {
        method: "Get",
    })

    return res
}