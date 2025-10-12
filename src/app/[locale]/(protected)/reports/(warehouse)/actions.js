'use server'

import { apiRequest } from "@/utils/api"

export async function getItemMovement(item, start_date, end_date, repositoryId) {
    'use server'
    const res = await apiRequest(`api/reports/warehouse/item-movement-json/?item=${item}&start_date=${start_date}&end_date=${end_date}&repository_id=${repositoryId}`, {
        method: "GET",
        cache: "no-store",
    })

    return res
}