'use client'

// NOTE: This page uses 'use client' because SparePartsEditor is interactive.
// If you need the initial data fetch on the server, split into a server
// component that fetches, and a client component that receives the props.

import { useActionState, useRef, useCallback } from 'react'
import DynamicForm2 from '@/components/DjangoBasedDForm/DForm2'
import SparePartsEditor from './SparePartsEditor'
import { saveMaintenance } from './actions'

const DEFAULT_STATE = { errors: {}, values: {} }

/**
 * MaintenancePage
 *
 * Props (passed from a server component or layout):
 *   initialData  — the full Maintenance record for edit mode, or null for create.
 *                  Shape: { id, client, serial_number, item, …, parts: [{…}] }
 *   metadata     — the OPTIONS response (field definitions) from getTransactions
 */
export default function MaintenancePage({ initialData = null, metadata }) {
    // Keep a ref to the latest parts array so we can read it at submit time
    // without the parts state living inside DynamicForm2 (which owns the
    // FormData / useActionState cycle).
    const partsRef = useRef(initialData?.parts ?? [])

    const handlePartsChange = useCallback((parts) => {
        partsRef.current = parts
    }, [])

    // Wrap the real server action to inject parts_json into FormData before
    // it leaves the client. useActionState gives us the wrapped action.
    const actionWithParts = useCallback(
        async (prevState, formData) => {
            // Serialise the parts array. We include ALL rows (including
            // _action='existing') so the server always has the full picture,
            // but the serializer only writes rows with create/update/delete.
            const payload = partsRef.current
                .filter((p) => {
                    // Drop brand-new rows that were added then immediately
                    // deleted — they have no id and _action==='delete'.
                    if (!p.id && p._action === 'delete') return false
                    return true
                })
                .map(({ id, spare_part, quantity, _action }) => ({
                    id,
                    spare_part,
                    quantity,
                    _action,
                }))

            formData.set('parts_json', JSON.stringify(payload))

            // Pass the maintenance id for PATCH routing (edit mode).
            if (initialData?.id) {
                formData.set('maintenance_id', initialData.id)
            }

            return saveMaintenance(prevState, formData)
        },
        [initialData?.id]
    )

    const initialState = initialData
        ? {
            errors: {},
            values: {
                client: initialData.client,
                item: initialData.item,
                serial_number: initialData.serial_number,
                date_in: initialData.date_in,
                maintenance_date: initialData.maintenance_date,
                date_out: initialData.date_out,
                by: initialData.by,
                malfunctions: initialData.malfunctions,
                notes: initialData.notes,
            },
        }
        : DEFAULT_STATE

    return (
        // <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="py-8 px-4">
            <h1 className="text-xl font-semibold mb-6">
                {initialData ? 'Edit maintenance record' : 'New maintenance record'}
            </h1>

            <DynamicForm2
            customeFields={{
                parts: <SparePartsEditor
                            initialParts={initialData?.parts ?? []}
                            url="api/items/?name="
                            // disabled={isPending}
                            onChange={handlePartsChange}
                        // Thread errors down if the server returns them
                        // errors={{ parts: state.errors?.parts }}
                        />
            }}
                metadata={metadata}
                action={actionWithParts}
                initialState={initialState}
                fieldOrder={['client', 'item', 'serial_number', 'date_in', 'maintenance_date', 'date_out', 'by', 'malfunctions', 'notes']}
                dynamicOptionsInputURL={{
                    item: 'api/items/?name=',
                    client: 'api/buyer-supplier-party/?s=',
                    by: 'api/employees/?first_name=',
                    parts: 'api/items/?name=',
                }}
                renderSubmit={(isPending) => (
                    <>
                        <div className="mt-6 flex gap-3">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="px-4 py-2 rounded-md bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isPending ? 'Saving…' : initialData ? 'Save changes' : 'Create record'}
                            </button>
                        </div>
                    </>
                )}
            />
        </div>
    )
}
