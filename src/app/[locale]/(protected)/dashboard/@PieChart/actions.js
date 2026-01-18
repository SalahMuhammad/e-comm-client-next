'use server';
import { apiRequest } from "@/utils/api";

export async function getCashAndDeferredPercentages() {
    'use server'
    const res = await apiRequest(`/api/sales/analysis/cash-deferred-percentages/`, {
        method: "Get",
    })

    return res
}
