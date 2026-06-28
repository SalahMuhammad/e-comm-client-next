'use server';

import { apiRequest } from "@/utils/api";


export async function getTransactions(queryStringParams, id, method="GET") {
    "use server";
    const itemDetail = id ? `${id}/` : '';
    const res = await apiRequest(`/api/maintenance/${itemDetail}${queryStringParams ? queryStringParams : ''}`, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        cashe: "no-store", // Disable caching for this request
    })

    return res
}

/**
 * Server action: create or update a maintenance record.
 *
 * POST  /api/maintenance/      — create
 * PUT   /api/maintenance/{id}/ — update (when formData contains `id`)
 */
export async function createUpdateMaintenance(prevState, formData) {
    const id        = formData.get('id');
    const hashed_id = formData.get('hashed_id');
    const isEdit    = !!id;

    // ── Build parts array ──────────────────────────────────────────────────────
    const parts = [];
    let i = 0;
    while (formData.has(`parts[${i}][spare_part]`)) {
        const spare_part = formData.get(`parts[${i}][spare_part]`);
        const quantity   = formData.get(`parts[${i}][quantity]`);
        if (spare_part) {
            parts.push({
                spare_part: Number(spare_part),
                quantity:   Number(quantity) || 1,
            });
        }
        i++;
    }

    // ── Build payload ──────────────────────────────────────────────────────────
    let payload = {};

    if (isEdit) {
        // PUT — only send updatable fields
        const date_out = formData.get('date_out');
        const notes    = formData.get('notes');
        payload = {
            ...(date_out ? { date_out } : {}),
            ...(notes    ? { notes }    : {}),
            parts,
        };
    } else {
        // POST — full creation payload
        const client        = formData.get('client');
        const item          = formData.get('item');
        const serial_number = formData.get('serial_number');
        const malfunctions  = formData.get('malfunctions');
        const notes         = formData.get('notes');

        payload = {
            client:        client  ? Number(client) : null,
            item:          item    ? Number(item)   : null,
            serial_number: serial_number || '',
            malfunctions:  malfunctions  || '',
            notes:         notes         || '',
            parts,
        };
    }

    // ── Request ────────────────────────────────────────────────────────────────
    const url    = isEdit
        ? `/api/maintenance/${id}/`
        : `/api/maintenance/`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                ok:       false,
                data,
                formData: Object.fromEntries(formData.entries()),
            };
        }

        return { ok: true, data };

    } catch (error) {
        return {
            ok:    false,
            data:  { detail: 'Network error. Please try again.' },
        };
    }
}
