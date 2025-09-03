'use server'

import { apiRequest } from "@/utils/api";

export async function getRefillableItemsClientHas(ownerId) {
    'use server'
    const res = await apiRequest(`api/refillable-sys/cans-client-has/${ownerId}/`, {
        method: "GET",
        cache: "no-store",
    })

    return res
}

export async function getOwnerAccountStatement(ownerid) {
    'use server'
    const res = await apiRequest(`api/buyer-supplier-party/customer-account-statement/${ownerid}/`, {
        method: "GET",
        cache: "no-store",
    })

    return res
}

export async function getPaymetnsInPeriod(from, to) {
    'use server'
    const res = await apiRequest(`api/payment/payments/?full_report=true&from=${from}&to=${to}`, {
        method: "GET",
        cache: "no-store",
    })

    return res
}

export async function getdOreItemsList() {
    'use server'
    const res = await apiRequest(`api/refillable-sys/ore-item/`, {
        method: "GET",
        cache: "no-store",
    })

    return res
}

export async function getdRefillableItems() {
    'use server'
    const res = await apiRequest(`api/refillable-sys/item-transformer/`, {
        method: "GET",
        cache: "no-store",
    })

    return res
}
