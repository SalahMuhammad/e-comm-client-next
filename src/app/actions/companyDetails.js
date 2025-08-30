'use server'

import { apiRequest } from "@/utils/api"

export async function getCompanyDetails() {
    'use server'
    const res = await apiRequest(`company-details/`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    })

    return res
}
