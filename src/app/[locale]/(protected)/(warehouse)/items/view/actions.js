import { apiRequest } from "@/utils/api";


export async function getItemFluctuationDuringlast60Dayes(id) {
    const response = await apiRequest(
        `/api/items/${id}/fluctuation/`,
        {
            method: 'GET'
        }
    );

    if (!response.ok) {
        console.error('getItemFluctuation error payload:', await response.text?.() || response);
        return { data: { last_30_dayes: 0, from_60_to_30_dayes: 0 } };
    }

    return response;
}
