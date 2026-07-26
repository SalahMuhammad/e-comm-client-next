'use server'

import { apiRequest } from "./api";



export async function httpRequest(url, method="GET", cutomeOptions={}) {
    "use server";
    const res = await apiRequest(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        cashe: "no-store", // Disable caching for this request
        ...cutomeOptions
    })

    return res
}


/**
 * saveMaintenance — server action for the maintenance form.
 *
 * Handles both create (POST) and update (PATCH).
 * The client injects `parts_json` and optionally `maintenance_id`
 * into the FormData before calling this.
 *  id key: _id
 *
 * Returns { errors, values } on validation failure (Django 400),
 * or redirects to the list page on success.
 */
export async function save(prevState, formData, endpoint, subModels, httpMethod, httpProps) {
    'use server'
    const _idName = '_id'
    const id = formData.get(_idName)
    const isEdit = Boolean(id)
    const subModelsNames = new Set(subModels);

    // ── Build the JSON body ──────────────────────────────────────────────────
    // Forward every field that DynamicForm2 produced, plus parts_json.
    // `parts_json` is already a JSON string; send it as the `parts` key
    // so Django receives: { client: 1, item: 3, …, parts: [{…}, …] }
    // const body = {}
    // for (const [key, value] of formData.entries()) {
    //     if (key === 'id') continue          // internal routing key
    //     if (key.includes('_json')) {
    //         const filedKey = key.split('_json')[0]
    //         body[filedKey] = JSON.parse(value)              // deserialise for Django
    //         subModelsNames.add(filedKey)
    //     } else {
    //         // Coerce empty strings to null for optional fields so Django
    //         // doesn't receive '' for a nullable DateField.
    //         body[key] = value === '' ? null : value
    //     }
    // }

    // const cookieStore = await cookies()
    // const csrfToken   = cookieStore.get('csrftoken')?.value ?? ''

    const url = isEdit
        ? `${endpoint}/${id}/`
        : `${endpoint}/`

    let method = httpMethod
    if (! method)
        method = isEdit ? 'PATCH' : 'POST'

    // 1. Check if the FormData contains any binary files or file keys
    let hasFiles = false
    for (const [key, value] of formData.entries()) {
        if (value instanceof File || key.includes('_file_')) {
            hasFiles = true
            break
        }
    }

    let requestBody
    let headers = {}

    if (hasFiles) {
        // 2. If files are present, pass the FormData directly.
        // Do NOT set 'Content-Type' so fetch automatically sets 'multipart/form-data' with the boundary.
        if (formData.has('id')) formData.delete('id')
            requestBody = formData
    } else {
        // 3. Standard JSON path for non-file forms
        const body = {}
        for (const [key, value] of formData.entries()) {
            if (key === 'id') continue
            if (key.includes('_json')) {
                const filedKey = key.split('_json')[0]
                body[filedKey] = JSON.parse(value)
            } else {
                body[key] = value === '' ? null : value
            }
        }
        requestBody = JSON.stringify(body)
        headers['Content-Type'] = 'application/json'
    }

    let res
    try {
        res = await apiRequest(url, {
            method,
            headers,
            credentials: 'include',
            body: requestBody,
            ...httpProps
        })
    } catch (err) {
        return {
            ...prevState,
            errors: { non_field_errors: ['Network error — please try again.'] },
        }
    }

    if (res.ok) {
        // const recordId = res.data?._hashed_id ?? res.data?.id ?? '_noID';

        // const targetURL = clientSuccessRedirectUrl.endsWith('/') 
        // ? clientSuccessRedirectUrl
        // : clientSuccessRedirectUrl + "/" + recordId;

        return res
        // revalidatePath(targetURL)
        // redirect(targetURL)
    }

    // ── Validation / server errors ───────────────────────────────────────────
    // Django returns field errors as { field: ['message', …], … }
    // Parts errors come back as { parts: [{ spare_part: ['…'], quantity: ['…'] }] }
    // We pass them through as-is so SparePartsEditor and DynamicForm2 can
    // display them per-field.
    let errors = {}
    try {
        const data = res.data
        // Flatten single-item arrays for DynamicForm2 compatibility
        for (const [key, val] of Object.entries(data)) {
            if (subModelsNames.has(key)) {
                // Keep as array-of-objects — SparePartsEditor handles it
                errors[key] = val
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
        if (key !== _idName && ! subModelsNames.has(key.split('_json')[0])) {
            values[key] = value
        }
    }

    return { errors, values }
}

export async function httpDelete(url) {
    'use server'
    const res = await apiRequest(url, {
        "method": 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    })

    return res
}
