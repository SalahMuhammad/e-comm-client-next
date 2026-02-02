'use server'

import { apiRequest } from "@/utils/api";

export async function createDbBackup(dataOrDataOnly = false, withMedia = false) {
    let query = '';
    let body = null;
    let headers = {};

    if (dataOrDataOnly instanceof FormData) {
        // New usage: createDbBackup(formData)
        body = dataOrDataOnly;
        // Query params might be in formData or appended to URL if needed, 
        // but backend views usually check query params or body depending on implementation.
        // My updated view checks request.data/query_params.
        // If passing FormData, we rely on backend parsing it.
    } else {
        // Legacy usage: createDbBackup(dataOnly, withMedia)
        const params = new URLSearchParams();
        if (dataOrDataOnly) params.append('data-only', '1');
        if (withMedia) params.append('media', '1');
        query = params.toString() ? `?${params.toString()}` : '';
    }

    const res = await apiRequest(`/api/services/create-db-backup/${query}`, {
        method: "POST",
        body: body
    });

    if (!res.ok) {
        return { ok: false, status: res.status, data: res.data || { detail: 'Failed to create backup' } };
    }

    // Backend now returns JSON with file_data (base64)
    // res.data contains: { message, file_name, file_data, content_type, is_file }
    return { ok: true, status: res.status, data: res.data };
}

export async function getBackupConfig() {
    const res = await apiRequest(`/api/services/backup-config/`, {
        method: "GET",
        cache: "no-store",
    });

    if (!res.ok) {
        return { ok: false, status: res.status, data: res.data || { detail: 'Failed to fetch backup config' } };
    }

    return { ok: true, status: res.status, data: res.data };
}

export async function updateBackupConfig(maxBackups) {
    const res = await apiRequest(`/api/services/backup-config/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ max_backups: maxBackups }),
    });

    if (!res.ok) {
        return { ok: false, status: res.status, data: res.data || { detail: 'Failed to update backup config' } };
    }

    return { ok: true, status: res.status, data: res.data };
}

export async function getBackups() {
    const res = await apiRequest(`/api/services/restore-db-backup/`, {
        method: "GET",
        cache: "no-store",
    });

    if (!res.ok) {
        return { ok: false, status: res.status, data: res.data || { detail: 'Failed to fetch backups' } };
    }

    return { ok: true, status: res.status, data: res.data };
}

export async function restoreDbBackup(formData) {
    // apiRequest doesn't automatically handle FormData content-type correctly if we pass it directly 
    // usually we let browser set it, but apiRequest sets headers.
    // However, `api.js` does `{ ...headersss, ...options }`. 
    // If we pass body as FormData, fetch handles it.
    // BUT `api.js` implementation: `const headersss = { ...options.headers }` and `headers: { "auth": ..., ...headersss }`.
    // It doesn't force Content-Type unless we set it. 
    // So passing FormData in body should work fine with `apiRequest`.

    const res = await apiRequest(`/api/services/restore-db-backup/`, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        return { ok: false, status: res.status, data: res.data || { detail: 'Failed to restore backup' } };
    }

    return { ok: true, status: res.status, data: res.data };
}
