'use server'  // ← Change from 'use client'

import { apiRequest } from "@/utils/api";

export async function getData(params='') {
    if (params)
        return await apiRequest("api/refillable-sys/refillable-cost-analysis/" + params )
}

export async function getItemTransformerList() {
    return await apiRequest("api/refillable-sys/item-transformer/")
}

export async function getOreItems() {
    return await apiRequest("api/refillable-sys/ore-item/")
}
