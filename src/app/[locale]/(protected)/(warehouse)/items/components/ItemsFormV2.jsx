'use client'

import { useRef, useCallback, useState, useEffect } from 'react'
import DynamicForm2 from '@/components/DjangoBasedDForm/DForm2'
import { TextInputV2 } from "@/components/inputs";
import SubModelHandler from '@/components/form-utils/SubModelHandler'
import FileSubModelHandler from '@/components/form-utils/FileSubModelHandler'
import MyCollapsible from '@/components/MyCollapsible';
import { httpRequest, save } from '@/utils/HTTPMethods';
import { useRouter } from 'next/navigation';
import { useNotify } from '@/components/sonner_actions/useNotify';



const DEFAULT_STATE = { errors: {}, values: {} }

/**
 * MaintenancePage
 *
 * Props (passed from a server component or layout):
 *   initialData  — the full Maintenance record for edit mode, or null for create.
 *                  Shape: { id, client, serial_number, item, …, parts: [{…}] }
 *   metadata     — the OPTIONS response (field definitions) from getTransactions
 */
export default function ItemsForm({ initialData = null, metadata }) {
    // Keep a ref to the latest parts array so we can read it at submit time
    // without the parts state living inside DynamicForm2 (which owns the
    // FormData / useActionState cycle).
    const router = useRouter();
    const notify = useNotify();
    const barcodesRef = useRef(initialData?.barcodes ?? [])
    const imagesRef = useRef(initialData?.images ?? [])
    const [p1, setP1] = useState(1);
    const [pp, setPP] = useState(null);
    const p2 = useRef()
    const p3 = useRef()
    const p4 = useRef()

    const handleBarcodesChange = useCallback((barcodes) => {
        barcodesRef.current = barcodes
    }, [])

    const handleImagesChange = useCallback((images) => { // ADD THIS
        imagesRef.current = images
    }, [])

    useEffect(() => {
        if (pp) {
            p2.current.value = Number(p1) + Number(p1 * pp.price2);
            p3.current.value = Number(p1) + Number(p1 * pp.price3);
            p4.current.value = Number(p1) + Number(p1 * pp.price4);
        }
    }, [p1])
    
    useEffect(() => {
        httpRequest('api/pp/', 'GET').then(a => setPP(a.data)).catch(console.error);
    }, []);

    // Wrap the real server action to inject parts_json into FormData before
    // it leaves the client. useActionState gives us the wrapped action.
    const actionWithSubmodels = useCallback(
        async (prevState, formData) => {
            // Serialise the parts array. We include ALL rows (including
            // _action='existing') so the server always has the full picture,
            // but the serializer only writes rows with create/update/delete.
            const payload = barcodesRef.current
                .filter((p) => {
                    // Drop brand-new rows that were added then immediately
                    // deleted — they have no id and _action==='delete'.
                    if (!p.id && p._action === 'delete') return false
                    return true
                })
                .map(({ id, barcode, _action }) => ({
                    id,
                    barcode,
                    _action,
                }))

            formData.set('barcodes_json', JSON.stringify(payload))

            // ADD THIS: Images JSON Payload
            const imagesPayload = imagesRef.current
                .filter((p) => {
                    if (!p.id && p._action === 'delete') return false
                    return true
                })
                .map(({ id, img, _file, title, _action }) => ({
                    id,
                    // title,
                    'img': _file,
                    _action,
                }))

            formData.set('images_json', JSON.stringify(imagesPayload))

            // ADD THIS: Append binary image files with matching index contract
            imagesRef.current.forEach((item, index) => {
                if (item._file) {
                    formData.append(`images_file_${index}`, item._file)
                }
            })



            // Pass the maintenance id for PATCH routing (edit mode).
            if (initialData?.id) {
                formData.set('_id', initialData.id)
            }

            const res = await save(prevState, formData, 'api/items', ['images', 'barcodes']);

            if (res?.errors && Object.keys(res.errors).length > 0) {
                notify({
                    variant: 'error',
                    title: 'Validation Failed',
                    description: 'Please check the form for errors.',
                });
            } else if (res?.data?.id && res?.ok) {
                notify({
                    variant: 'success',
                    message: 'Data saved successfully!',
                    description: 'redirecting...',
                });
                router.push(`/items/view/${res.data.id}`);
            }

            return res;
        },
        [initialData?.id]
    )

    const initialState = initialData
        ? {
            errors: {},
            values: {
                type: { value: initialData.type ?? '', label: initialData._type_name ?? '' },
                origin: initialData.origin,
                place: initialData.place,

                name: initialData.name,

                price1: initialData.price1,
                price2: initialData.price2,
                price3: initialData.price3,
                price4: initialData.price4,

                barcodes: initialData.barcodes,
                images: initialData.images,
                

                is_refillable: initialData.is_refillable,
                part_number: initialData.part_number,
                description: initialData.description,
                note: initialData.note,
            },
        }
        : DEFAULT_STATE

    return (
        // <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="py-8 px-4">
            <DynamicForm2
                title={initialData?.id ? `Edit Item record: ${initialData.id}` : 'New item record'}
                customeFields={{
                    barcodes: (formState) => (
                        <SubModelHandler
                            title='Barcodes'
                            keys={['id', 'barcode']}
                            // defaultValues={{ quantity: 1 }}
                            initialParts={initialData?.barcodes ?? []}
                            disabled={formState.isPending}
                            onChange={handleBarcodesChange}
                            row={(obj, index, uid, updateField, updateFields, markDeleted) => {
                                const rowErrors = formState?.errors?.barcodes?.[index] ?? {}
                                return (
                                    <BarcodeRow
                                        key={obj._rowKey}
                                        uid={uid}
                                        index={index}
                                        obj={obj}
                                        rowErrors={rowErrors}
                                        disabled={formState.isPending}
                                        onChange={(val) =>
                                            updateField(obj._rowKey, 'barcode', val)
                                        }
                                        onDelete={() => markDeleted(obj._rowKey)}
                                    />
                                )
                            }}
                        />
                    ),
                    images: (formState) => (
                        <FileSubModelHandler
                            title='Images'
                            keys={['id', 'title', 'img']}
                            initialRows={initialData?.images ?? []}
                            disabled={formState.isPending}
                            onChange={handleImagesChange}
                            row={(obj, index, uid, updateField, updateFile, markDeleted) => {
                                const rowErrors = formState?.errors?.images?.[index] ?? {}
                                return (
                                    <ImageRow
                                        key={obj._rowKey}
                                        uid={uid}
                                        index={index}
                                        obj={obj}
                                        rowErrors={rowErrors}
                                        disabled={formState.isPending}
                                        onTitleChange={(val) => updateField(obj._rowKey, 'title', val)}
                                        onFileChange={(file) => updateFile(obj._rowKey, file)}
                                        onDelete={() => markDeleted(obj._rowKey)}
                                    />
                                )
                            }}
                        />
                    )
                }}
                // fieldProps={{ date_in: { format: "YYYY-MM-DD" } }}
                ignore={['by']}
                metadata={metadata}
                action={actionWithSubmodels}
                initialState={initialState}
                fieldOrder={['type', 'name', 'price1', 'origin', 'place', 'serial_number']}
                dynamicOptionsInputURL={{
                    type: 'api/items/types/?name=',
                }}
                groups={[
                    {
                        fields: ['price1', 'price2', 'price3', 'price4'], 
                        Wrapper: MyCollapsible,
                        wrapperProps: {
                            title: 'Prices',
                            containerClasses: "grid md:grid-cols-2 gap-2",
                        }
                    },
                    {
                        title: 'Additional information',
                        fields: ['is_refillable', 'part_number', 'description', 'note'], 
                        Wrapper: MyCollapsible,
                        wrapperProps: {
                            title: 'Additional information',
                        }
                    }
                ]}
                fieldProps={{
                    price1: {onChange: (e) => setP1(e.target.value)},
                    price2: {ref: p2, step: .10},
                    price3: {ref: p3, step: .10},
                    price4: {ref: p4, step: .10},
                }}
            />
        </div>
    )
}


function BarcodeRow({
    uid,
    index,
    obj,
    rowErrors,
    disabled,
    onChange,
    onDelete,
}) {
    return (
        <div className="flex items-start gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <TextInputV2
                id={`${uid}-barcode-${index}`}
                value={obj.barcode ?? ''}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                error={rowErrors.barcode}
                placeholder='Barcode'
                onFocus={(e) => e.target.select()}
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

function ImageRow({
    uid,
    index,
    obj,
    rowErrors,
    disabled,
    onTitleChange,
    onFileChange,
    onDelete,
}) {
    return (
        <div className="flex items-start gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <TextInputV2
                value={obj.img?.split('8000')[1] ?? ''}
                onChange={(e) => onTitleChange(e.target.value)}
                disabled={disabled}
                error={rowErrors.img}
                placeholder='Image title / caption'
            />
            <input
                type="file"
                accept="image/*"
                disabled={disabled}
                onChange={(e) => onFileChange(e.target.files?.[0] || null)}
                className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:opacity-90"
            />
            <button
                type="button"
                onClick={onDelete}
                disabled={disabled}
                aria-label="Remove image"
                className="mt-6 p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-colors shrink-0"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    )
}
