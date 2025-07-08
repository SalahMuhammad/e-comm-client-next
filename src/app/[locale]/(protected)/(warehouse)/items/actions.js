'use server';

import { apiRequest } from "@/utils/api";


export async function submitItemForm(formData) {
    
    const form = Object.fromEntries(formData.entries());
    console.log('Form data submitted:', form);
    // console.log(formData.getAll('images'))
    const response = await apiRequest('/api/items/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
    });
console.log(response)
    // if (!response.ok) {
    //     throw new Error('Failed to submit form');
    // }

    // return response.json();
}