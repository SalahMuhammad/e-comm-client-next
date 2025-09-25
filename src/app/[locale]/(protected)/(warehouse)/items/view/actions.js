import { apiRequest } from "@/utils/api";


export async function getItemFluctuationDuringlast60Dayes(id) {
    const response = await apiRequest(
        `/api/items/${id}/fluctuation/`, 
        { 
            method: 'GET' 
        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch item fluctuation');
    }

    return response;
}
