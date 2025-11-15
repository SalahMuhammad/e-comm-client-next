'use server'

import { apiRequest } from "@/utils/api"



export async function getVultsTotalBalance() {
    'use server'
    return await apiRequest('api/finance/account-vault/balance/?compute_all=true')
}
