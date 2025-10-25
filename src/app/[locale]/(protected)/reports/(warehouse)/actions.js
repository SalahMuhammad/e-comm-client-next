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

export async function getSalesAndRefundTotals(start_date, end_date) {
    'use server'
    const res = await apiRequest(`api/sales/t/sales-refund-totals/?fromdate=2025-01-23&todate=2025-06-20/?fromdate=${start_date}&todate=${end_date}`, {
        method: "GET",
        cache: "no-store",
    })

    return res
}
