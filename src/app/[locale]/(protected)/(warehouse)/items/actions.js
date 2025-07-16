'use server';

import { apiRequest } from "@/utils/api";


export async function submitItemForm(prevState, formData) {
    const images = formData.getAll('images_upload');
    if (images[0].size === 0) {
        formData.delete('images_upload');
    }
    const response = await apiRequest('/api/items/', {
        method: 'POST',
        body: formData,
    });
    
    const formValues = Object.fromEntries(formData.entries());
    if (response?.cMessage) {
        return {
            success: false,
            errors: { general: response.status },
            ...formValues,
        }
    }
    if (!response?.ok) {
        if (response.status === 400) {
            const errorData = await response.json();
            return {
                success: false,
                errors: errorData || { general: '400' },
                ...formValues,
            }
        }
    }

    return {
        success: true,
    }
}

export async function getPP() {
    const response = await apiRequest('/api/pp/', { method: 'GET' });
    if (!response.ok) {
        throw new Error('Failed to fetch item types');
    }
    return await response.json();
}