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

    switch (res.status) {
        case 204:
            // success
            return { success: true }
        case 400:
            // bad request
            console.log('bad requesrt')
            return { error: (await res.json()).detail }
        default:
            // an unexpected error occurred
            console.log('An unexpected error occurred:', res.statusText);
            return { error: 'An unexpected error occurred' }
    }
}
