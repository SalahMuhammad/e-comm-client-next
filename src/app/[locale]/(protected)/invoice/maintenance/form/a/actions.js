'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

/**
 * saveMaintenance — server action for the maintenance form.
 *
 * Handles both create (POST) and update (PATCH).
 * The client injects `parts_json` and optionally `maintenance_id`
 * into the FormData before calling this.
 *
 * Returns { errors, values } on validation failure (Django 400),
 * or redirects to the list page on success.
 */
export async function saveMaintenance(prevState, formData) {
    const maintenanceId = formData.get('maintenance_id')
    const isEdit = Boolean(maintenanceId)

    const apiBase = process.env.DJANGO_API_BASE_URL  // e.g. http://localhost:8000/api

    // ── Build the JSON body ──────────────────────────────────────────────────
    // Forward every field that DynamicForm2 produced, plus parts_json.
    // `parts_json` is already a JSON string; send it as the `parts` key
    // so Django receives: { client: 1, item: 3, …, parts: [{…}, …] }
    const body = {}
    for (const [key, value] of formData.entries()) {
        if (key === 'maintenance_id') continue          // internal routing key
        if (key === 'parts_json') {
            body.parts = JSON.parse(value)              // deserialise for Django
        } else {
            // Coerce empty strings to null for optional fields so Django
            // doesn't receive '' for a nullable DateField.
            body[key] = value === '' ? null : value
        }
    }

    const cookieStore = await cookies()
    const csrfToken   = cookieStore.get('csrftoken')?.value ?? ''

    const url = isEdit
        ? `${apiBase}/maintenance/form/${maintenanceId}/`
        : `${apiBase}/maintenance/form/`

    const method = isEdit ? 'PATCH' : 'POST'

    let res
    try {
        res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken':  csrfToken,
            },
            credentials: 'include',
            body: JSON.stringify(body),
        })
    } catch (err) {
        return {
            ...prevState,
            errors: { non_field_errors: ['Network error — please try again.'] },
        }
    }
console.log(res)
    return
    if (res.ok) {
        revalidatePath('/maintenance')
        redirect('/maintenance')
    }

    // ── Validation / server errors ───────────────────────────────────────────
    // Django returns field errors as { field: ['message', …], … }
    // Parts errors come back as { parts: [{ spare_part: ['…'], quantity: ['…'] }] }
    // We pass them through as-is so SparePartsEditor and DynamicForm2 can
    // display them per-field.
    let errors = {}
    try {
        const data = await res.json()
        // Flatten single-item arrays for DynamicForm2 compatibility
        for (const [key, val] of Object.entries(data)) {
            if (key === 'parts') {
                // Keep as array-of-objects — SparePartsEditor handles it
                errors.parts = val
            } else {
                errors[key] = Array.isArray(val) ? val.join(' ') : val
            }
        }
    } catch {
        errors = { non_field_errors: [`Server error ${res.status}`] }
    }

    // Preserve the submitted field values so the form doesn't reset
    const values = {}
    for (const [key, value] of formData.entries()) {
        if (key !== 'maintenance_id' && key !== 'parts_json') {
            values[key] = value
        }
    }

    return { errors, values }
}


/**
 * getTransactions — fetch the OPTIONS metadata (field definitions).
 * Unchanged from your original; kept here for reference.
 */
export async function getTransactions(page = 0, pageSize = 0, method = 'GET') {
    const apiBase = process.env.DJANGO_API_BASE_URL
    const res = await fetch(`${apiBase}/maintenance/`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        cache: 'force-cache',  // OPTIONS shape rarely changes
    })
    return res.json()
}


/**
 * getMaintenance — fetch a single record for edit mode.
 * Returns the full Maintenance object including nested parts.
 */
export async function getMaintenance(id) {
    const apiBase = process.env.DJANGO_API_BASE_URL
    const res = await fetch(`${apiBase}/maintenance/${id}/`, {
        cache: 'no-store',   // always fresh for edit pages
    })
    if (!res.ok) return null
    return res.json()
}
