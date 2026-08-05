'use client'

// NOTE: This page uses 'use client' because SparePartsEditor is interactive.
// If you need the initial data fetch on the server, split into a server
// component that fetches, and a client component that receives the props.

import { useRef, useCallback, useEffect, useState } from 'react'
import DynamicForm2 from '@/components/DjangoBasedDForm/DForm2'
import { DynamicOptionsInput, NumberInputV2 } from "@/components/inputs";
import SubModelHandler from '@/components/form-utils/SubModelHandler'
import { save, httpRequest } from '@/utils/HTTPMethods';
import { useNotify } from '@/components/sonner_actions/useNotify';
import { useRouter } from 'next/navigation';
import { ensureISOString } from '@/components/inputs/date/dateV2Utils';



const DEFAULT_STATE = { errors: {}, values: {} }

/**
 * MaintenancePage
 *
 * Props (passed from a server component or layout):
 *   initialData  — the full Maintenance record for edit mode, or null for create.
 *                  Shape: { id, client, serial_number, item, …, parts: [{…}] }
 *   metadata     — the OPTIONS response (field definitions) from getTransactions
 */
export default function MaintenanceForm({ initialData = null, metadata }) {
    // Keep a ref to the latest parts array so we can read it at submit time
    // without the parts state living inside DynamicForm2 (which owns the
    // FormData / useActionState cycle).
    const notify = useNotify();
    const router = useRouter();
    const partsRef = useRef(initialData?.parts ?? [])
    const [serverConfig, setServerConfig] = useState({})

    const handlePartsChange = useCallback((parts) => {
        partsRef.current = parts
    }, [])

    useEffect(() => {
        async function getData() {
            const res = await httpRequest('api/services/configuration/')
            if(res.ok)
                setServerConfig(res.data?.data?.items?.maintenance_optional_filters?.fields)
        }

        getData()
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
                .map(({ id, spare_part, quantity, repository, _action }) => ({
                    id,
                    spare_part,
                    quantity,
                    repository,
                    _action,
                }))

            formData.set('parts_json', JSON.stringify(payload))
            

            // Pass the maintenance id for PATCH routing (edit mode).
            if (initialData?._hashed_id) {
                formData.set('_id', initialData._hashed_id)
            }

            const res = await save(prevState, formData, 'api/maintenance', ['parts']);
            
            if (res?.errors && Object.keys(res.errors).length > 0) {
                notify({
                    variant: 'error',
                    title: 'Validation Failed',
                    description: 'Please check the form for errors.',
                });
            } else if (res?.data?._hashed_id && res?.ok) {
                notify({
                    variant: 'success',
                    message: 'Transaction saved successfully!',
                    description: 'redirecting...',
                });
                router.push(`/invoice/maintenance/view/${res.data._hashed_id}`);
            }

            return res
        },
        [initialData?.id]
    )

    const initialState = initialData
        ? {
            errors: {},
            values: {
                client: { value: initialData.client, label: initialData._client_name },
                item: { value: initialData.item, label: initialData._item_name },
                serial_number: initialData.serial_number,
                date_in: initialData.date_in,
                maintenance_date: initialData.maintenance_date,
                date_out: initialData.date_out,
                by: initialData.by,
                malfunctions: initialData.malfunctions,
                notes: initialData.notes,
                _hashed_id: initialData._hashed_id,
                cost: initialData.cost
            },
        }
        : DEFAULT_STATE

    return (
        // <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="py-8 px-4">
            <DynamicForm2
                title={initialData?._hashed_id ? `Edit maintenance record: ${initialData._hashed_id}` : 'New maintenance record'}
                customeFields={{
                    parts: (formState) => 
                        <SubModelHandler
                            title='Spare parts'
                            keys={['id', 'spare_part', '_spare_part_name', 'quantity', 'repository', '_repository_name']}
                            defaultValues={{ quantity: 1 }}
                            initialParts={initialData?.parts ?? []}
                            disabled={formState.isPending}
                            onChange={handlePartsChange}
                            row={(obj, index, uid, updateField, updateFields, markDeleted) => {
                                const rowErrors = formState?.errors?.parts?.[index] ?? {}
                                return (
                                    <SparepartFormRow
                                        key={obj._rowKey}
                                        uid={uid}
                                        index={index}
                                        part={obj}
                                        rowErrors={rowErrors}
                                        disabled={formState.isPending}
                                        defaultFilter={serverConfig?.spare_parts}
                                        onSparePartChange={(selectedOption, actionMeta) =>
                                            updateFields(obj._rowKey, {
                                                spare_part: selectedOption?.value ?? null,
                                                _spare_part_name: selectedOption?.label ?? '',
                                            })
                                        }
                                        onQuantityChange={(val) =>
                                            updateField(obj._rowKey, 'quantity', val)
                                        }
                                        onRepositoryChange={(selectedOption, actionMeta) =>
                                            updateFields(obj._rowKey, {
                                                repository: selectedOption?.value ?? null,
                                                repository_name: selectedOption?.label ?? '',
                                            })
                                        }
                                        onDelete={() => markDeleted(obj._rowKey)}
                                    />
                                )
                            }}
                        />
                }}

                
                fieldProps={{
                    date_in: {format: "YYYY-MM-DD", defaultValue: ensureISOString(new Date())},
                    cost: {defaultValue: initialState.values.cost || 0}
                }}
                ignore={['parts_json']}
                metadata={metadata}
                action={actionWithParts}
                initialState={initialState}
                fieldOrder={['client', 'item', 'serial_number', 'date_in', 'maintenance_date', 'date_out', 'malfunctions', 'notes','maintained_by', 'cost']}
                dynamicOptionsInputURL={{
                    item: `api/items/?${serverConfig?.maintainable_items ? serverConfig?.maintainable_items + '&' : ''}name=`,
                    client: 'api/buyer-supplier-party/?s=',
                    maintained_by: 'api/employees/?first_name=',
                    // parts: 'api/items/?name=',
                }}
            />
        </div>
    )
}


function SparepartFormRow({
    uid,
    index,
    part,
    defaultFilter,
    rowErrors,
    disabled,
    onSparePartChange,
    onQuantityChange,
    onRepositoryChange,
    onDelete,
}) {
    return (
        <div className="flex items-start gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            {/* Spare part autocomplete */}
            <div className="flex-1 min-w-3/4">
                <DynamicOptionsInput
                    id={`${uid}-spare-${index}`}
                    label="Spare part"
                    // name={`parts[${index}][spare_part]`}
                    url={`api/items/?${defaultFilter ? defaultFilter + '&' : ''}name=`}
                    defaultValue={{value: part.spare_part, label: part._spare_part_name}}
                    error={rowErrors.spare_part}
                    disabled={disabled}
                    onChange={(selectedOption, actionMeta) => onSparePartChange(selectedOption, actionMeta)}
                />
            </div>

            {/* Quantity */}
            <NumberInputV2 
                id={`${uid}-qty-${index}`}
                min="1"
                step="1"
                value={part.quantity}
                onChange={(e) => onQuantityChange(e.target.value)}
                disabled={disabled}
                error={rowErrors.quantity}
                placeholder='Qty'
                onFocus={(e) => e.target.select()}
            />

            <DynamicOptionsInput
                id={`${uid}-repository-${index}`}
                label="Repository"
                // name={`parts[${index}][spare_part]`}
                url={`api/repositories/?s=`}
                defaultValue={{value: part.repository, label: part._repository_name ?? 'main'}}
                error={rowErrors.repository}
                disabled={disabled}
                onChange={(selectedOption, actionMeta) => onRepositoryChange(selectedOption, actionMeta)}
            />

            {/* Delete button */}
            <button
                type="button"
                onClick={onDelete}
                disabled={disabled}
                aria-label="Remove this part"
                className="mt-6 p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
        </div>
    )
}
