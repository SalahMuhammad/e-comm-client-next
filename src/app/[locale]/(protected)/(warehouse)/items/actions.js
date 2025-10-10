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

export async function createUpdateItem(_, formData) {
    'use server';
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

    // Filter out empty barcodes and clean up the array
    const cleanBarcodes = barcodes
        .filter(b => b && b.barcode)
        .map(({ id, barcode }) => {
            const obj = { barcode };
            if (id) obj.id = id;
            return obj;
        });


    formData.set('barcodes', JSON.stringify(cleanBarcodes));
    const formValues = Object.fromEntries(formData.entries());
    formValues.barcodes = cleanBarcodes
    
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