import { apiRequest } from "@/utils/api";


export async function getItems(queryStringParams) {
    const res = await apiRequest(`/api/items/${queryStringParams ? queryStringParams : ''}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cashe: "no-store", // Disable caching for this request
    })

    return await res.json()
}
