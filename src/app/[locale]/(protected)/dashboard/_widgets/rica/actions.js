'use server';

import { apiRequest } from "@/utils/api";

export async function getRICAData(params = '') {
    if (params)
        return await apiRequest("api/refillable-sys/analysis/item-unit-cost/" + params);
}

export async function getRICAItemTransformerList() {
    return await apiRequest("api/refillable-sys/item-transformer/");
}

export async function getRICAOreItems() {
    return await apiRequest("api/refillable-sys/ore-item/");
}
