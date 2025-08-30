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
