'use server';

import { apiRequest } from "@/utils/api";


export async function submitItemForm(formData) {
    const response = await apiRequest('/api/items/', {
        method: 'POST',
        body: formData,
    });

    if (!response.id) {
        if (response.status === 400) {
            console.log(await response.json())
            return{
                name: 'fdsfd'
            }
        }
        // throw new Error('Failed to submit form');
        return 
    }

    console.log(11111, response)
}

export async function getPP() {
    const response = await apiRequest('/api/pp/', {method: 'GET'});
    if (!response.ok) {
        // throw new Error('Failed to fetch item types');
    }
    return response;
}