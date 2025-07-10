'use server';

import { apiRequest } from "@/utils/api";


export async function submitItemForm(formData) {
    const images = formData.getAll('images_upload');
    if (images[0].size === 0) {
        formData.delete('images_upload');
    }

    const response = await apiRequest('/api/items/', {
        method: 'POST',
        body: formData,
    });

    if (!response.id) {
        if (response.status === 400) {
            const errorData = await response.json();
            return errorData
        }
        console.log(
            'Error submitting form:', 
            response.statusText, 
            'response', 
            response
        );
    }

    // toast message/
    console.log(11111, 'success')
}

export async function getPP() {
    const response = await apiRequest('/api/pp/', {method: 'GET'});
    if (!response.ok) {
        // throw new Error('Failed to fetch item types');
    }
    return await response.json();
}