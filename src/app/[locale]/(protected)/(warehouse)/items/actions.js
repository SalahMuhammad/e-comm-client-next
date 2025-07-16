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

    switch (response.status) {
        case 201:
            // Successfully created
            break;
        case 400:
            const errorObject = await response.json();
            // Handle validation errors
            break;
    
        default:
            // an unexpected error occurred
            // 'Error submitting form:', 
            return 
            break;
    }
}

export async function getPP() {
    const response = await apiRequest('/api/pp/', {method: 'GET'});
    if (!response.ok) {
        // throw new Error('Failed to fetch item types');
    }
    return await response.json();
}