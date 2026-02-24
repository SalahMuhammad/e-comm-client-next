'use server'  // ← Change from 'use client'

import { apiRequest } from "@/utils/api";

export async function getData(params='') {
    if (params)
        return await apiRequest("api/refillable-sys/analysis/refillable-item-unit-cost/" + params )
}

export async function getItemTransformerList() {
    return await apiRequest("api/refillable-sys/item-transformer/")
}

export async function getOreItems() {
    return await apiRequest("api/refillable-sys/ore-item/")
}
