'use server'

import { apiRequest } from "@/utils/api"



const getFinancialMovements = async () => {
    'use server' 
    const res = await apiRequest(
        'api/finance/account-vault/account-movements/?include_pending=true'
    )

    return res
}

export default getFinancialMovements
