import { apiRequest } from "@/utils/api";


export async function getItemFluctuationDuringlast60Dayes(id) {
    const response = await apiRequest(
        `/api/analysis/warehouse/item-fluctuation/${id}/`, 
        { 
            method: 'GET' 
        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch item types');
    }

    return response;
}
