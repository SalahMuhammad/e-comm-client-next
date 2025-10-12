'use server'

import { apiRequest } from "@/utils/api";


export async function getPaymetnsInPeriod(from, to) {
    'use server'
    const res = await apiRequest(`api/payment/payments/?full_report=true&from=${from}&to=${to}`, {
        method: "GET",
        cache: "no-store",
    })

    return res
}

export async function getOwnersCreditList() {
    'use server'
    const res = await apiRequest(`api/buyer-supplier-party/list-of-clients-that-has-credit-balance/`, {
        method: "GET",
        cache: "no-store",
    })

    return res
}
