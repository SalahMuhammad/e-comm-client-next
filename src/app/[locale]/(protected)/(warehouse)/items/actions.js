'use server';

import { apiRequest } from "@/utils/api";
import { getTranslations } from "next-intl/server";

export async function getItem(id) {
    'use server'
    const t = getTranslations("global")

    const res = await apiRequest(`/api/items/${id}/`, {
        method: "Get",
    })

    return res
}

export async function createUpdateItem(prevState, formData) {
    'use server';
    const formValues = Object.fromEntries(formData.entries());
    const isUpdate = formData.get('id') ? true : false
    
    
        
    // Convert FormData to object
    const formEntries = Array.from(formData.entries());
    
    // Extract barcode entries and create barcodes array
    const barcodes = [];
    const barcodePattern = /^barcodes\[(\d+)\]\.(.+)$/;
    
    formEntries.forEach(([key, value]) => {
        const match = key.match(barcodePattern);
        if (match) {
            const [_, index, field] = match;
            console.log(index, field)
            if (!barcodes[index]) {
                barcodes[index] = {};
            }
            barcodes[index][field] = value;
        }
    });

    console.log('barcodes', barcodes)

    // Filter out empty barcodes and clean up the array
    const cleanBarcodes = barcodes
        .filter(b => b && b.barcode)
        .map(({ id, barcode }) => ({ 
            id: id || undefined, 
            barcode 
        }));
    
        console.log('cleanBarcodes', cleanBarcodes)

    // Create new FormData with cleaned data
    const newFormData = new FormData();
    
    // Add non-barcode fields
    for (const [key, value] of formEntries) {
        if (!key.startsWith('barcodes[')) {
            newFormData.append(key, value);
        }
    }
    
    // Add barcodes as JSON string
    newFormData.append('barcodes', JSON.stringify(cleanBarcodes));

newFormData.get('barcodes') = {
    barcodes: [
        { id: undefined, barcode: '5435' }, // create new
        { id: 121, barcode: '33333' }, // update 121
        { id: 121, barcode: '' }, // مش هيتيعت client side
        { id: 121 }, // delete
    ]
}


    return {
        'fds': 1
    }
    const response = await apiRequest(`/api/items/${isUpdate ? formData.get('id') + '/' : ''}`, {
        method: `${isUpdate ? 'PUT' : 'POST'}`,
        body: formData,
    });
    
    return {
        ...response,
        ...response?.ok ? {} : formValues
    }
}

export async function getPP() {
    const response = await apiRequest('/api/pp/', { method: 'GET' });
    if (!response.ok) {
        throw new Error('Failed to fetch item types');
    }
    return await response.data;
}