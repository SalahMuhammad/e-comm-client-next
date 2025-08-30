"use server";
import { apiRequest } from "@/utils/api";

export async function getItems(queryStringParams) {
    "use server";
    const res = await apiRequest(`/api/items/${queryStringParams ? queryStringParams : ''}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cashe: "no-store", // Disable caching for this request
    })

    return res
}

export async function deleteItem(id) {
    "use server";

    const res = await apiRequest(`/api/items/${id}/`, {
        method: "DELETE",
    })


    return res
}
