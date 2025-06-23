import { apiRequest } from "@/utils/api";


export async function getItems(paginationParam) {
    const res = await apiRequest(`/api/items/${paginationParam ? paginationParam : ''}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cashe: "no-store", // Disable caching for this request
    })

    return res
}
