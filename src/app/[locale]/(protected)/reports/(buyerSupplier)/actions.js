'use server'

import { apiRequest } from "@/utils/api";


export async function getOwnerAccountStatement(ownerid) {
    'use server'
    const res = await apiRequest(`api/buyer-supplier-party/customer-account-statement/${ownerid}/`, {
        method: "GET",
        cache: "no-store",
    })

    return res
}
