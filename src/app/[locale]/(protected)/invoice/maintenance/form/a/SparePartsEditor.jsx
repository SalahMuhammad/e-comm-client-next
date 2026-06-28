'use client'

import { useState, useCallback, useId } from 'react'
import DynamicOptionsInput from '@/components/inputs/text/DynamicOptionsInput'

/**
 * SparePartsEditor
 *
 * Manages an inline list of spare part rows inside a Maintenance form.
 * Each row carries a hidden `_action` field:
 *   - 'create'  — new row, never persisted
 *   - 'update'  — existing row that has been modified
 *   - 'delete'  — existing row marked for deletion (rendered hidden)
 *
 * On submit the parent serialises the visible parts array into the
 * `parts_json` hidden input via `getPartsJson()`.
 *
 * Props:
 *   initialParts  — array from the server (edit mode). Shape:
 *                   [{ id, spare_part: { id, name }, quantity }]
 *   urlSuffix     — query-string suffix for the spare_part autocomplete,
 *                   e.g. '?name='
 *   errors        — field-level errors from the server action, shape:
 *                   { parts: [{ spare_part: '…', quantity: '…' }, …] }
 *   disabled      — true while the parent form is submitting (isPending)
 *   onChange      — called whenever the parts array changes, receives the
 *                   current parts array so the parent can serialise it
 */
export default function SparePartsEditor({
    initialParts = [],
    url = '?name=',
    errors = {},
    disabled = false,
    onChange,
}) {
    const uid = useId()

    // Normalise server rows into internal shape on first render only.
    // New rows use a negative temp id so we never collide with real PKs.
    const [parts, setParts] = useState(() =>
        initialParts.map((p) => ({
            _rowKey:    `existing-${p.id}`,
            id:         p.id,
            spare_part: p.spare_part?.id ?? p.spare_part,   // keep the id for submission
            _spareName: p.spare_part?.name ?? '',            // display-only label
            quantity:   String(p.quantity ?? 1),
            _action:    'existing',  // becomes 'update' only if the user edits it
        }))
    )

    const notify = useCallback(
        (next) => {
            setParts(next)
            onChange?.(next)
        },
        [onChange]
    )

    // ── row helpers ───────────────────────────────────────────────────────────

    const addRow = () => {
        const key = `new-${Date.now()}`
        notify([
            ...parts,
            {
                _rowKey:    key,
                id:         null,
                spare_part: null,
                _spareName: '',
                quantity:   '1',
                _action:    'create',
            },
        ])
    }

    const markDeleted = (rowKey) => {
        notify(
            parts.map((p) =>
                p._rowKey === rowKey
                    ? { ...p, _action: 'delete' }
                    : p
            )
        )
    }

    const undoDelete = (rowKey) => {
        notify(
            parts.map((p) =>
                p._rowKey === rowKey
                    // restore: was it previously saved or brand-new?
                    ? { ...p, _action: p.id ? 'existing' : 'create' }
                    : p
            )
        )
    }

    const updateField = (rowKey, field, value) => {
        notify(
            parts.map((p) => {
                if (p._rowKey !== rowKey) return p
                // An existing row becomes 'update' as soon as the user touches it.
                const action =
                    p._action === 'existing' ? 'update' : p._action
                return { ...p, [field]: value, _action: action }
            })
        )
    }

    const updateFields = (rowKey, patch) => {
        notify(
            parts.map((p) => {
                if (p._rowKey !== rowKey) return p
                const action = p._action === 'existing' ? 'update' : p._action
                return { ...p, ...patch, _action: action }
            })
        )
    }

    // ── derived state ─────────────────────────────────────────────────────────

    const visibleParts  = parts.filter((p) => p._action !== 'delete')
    const deletedParts  = parts.filter((p) => p._action === 'delete')

    // ── render ────────────────────────────────────────────────────────────────

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Spare parts
                </h3>
                <button
                    type="button"
                    onClick={addRow}
                    disabled={disabled}
                    className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <span aria-hidden="true">+</span>
                    Add part
                </button>
            </div>

            {visibleParts.length === 0 && (
                <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                    No spare parts added yet
                </p>
            )}

            <div className="space-y-2">
                {visibleParts.map((part, index) => {
                    const rowErrors = errors?.parts?.[index] ?? {}
                    return (
                        <PartRow
                            key={part._rowKey}
                            uid={uid}
                            index={index}
                            part={part}
                            rowErrors={rowErrors}
                            disabled={disabled}
                            url={url}
                            onSparePartChange={(selectedOption, actionMeta) =>
                                updateFields(part._rowKey, {
                                    spare_part: selectedOption?.value ?? null,
                                    _spareName: selectedOption?.label ?? '',
                                })
                            }
                            onQuantityChange={(val) =>
                                updateField(part._rowKey, 'quantity', val)
                            }
                            onDelete={() => markDeleted(part._rowKey)}
                        />
                    )
                })}
            </div>

            {/* Soft-deleted rows — kept in DOM so they're serialised */}
            {deletedParts.map((part) => (
                <DeletedRow
                    key={part._rowKey}
                    part={part}
                    disabled={disabled}
                    onUndo={() => undoDelete(part._rowKey)}
                />
            ))}
        </div>
    )
}

// ── sub-components ────────────────────────────────────────────────────────────

function PartRow({
    uid,
    index,
    part,
    rowErrors,
    disabled,
    url,
    onSparePartChange,
    onQuantityChange,
    onDelete,
}) {
    return (
        <div className="flex items-start gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            {/* Spare part autocomplete */}
            <div className="flex-1 min-w-0">
                <DynamicOptionsInput
                    id={`${uid}-spare-${index}`}
                    label="Spare part"
                    name={`parts[${index}][spare_part]`}
                    url={url}
                    // value={part.spare_part}
                    // displayValue={part._spareName}
                    error={rowErrors.spare_part}
                    disabled={disabled}
                    onChange={(selectedOption, actionMeta) => onSparePartChange(selectedOption, actionMeta)}
                />
            </div>

            {/* Quantity */}
            <div className="w-24 shrink-0">
                <label
                    htmlFor={`${uid}-qty-${index}`}
                    className="block text-xs text-gray-500 dark:text-gray-400 mb-1"
                >
                    Qty
                </label>
                <input
                    id={`${uid}-qty-${index}`}
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={part.quantity}
                    onChange={(e) => onQuantityChange(e.target.value)}
                    disabled={disabled}
                    className={`
                        w-full rounded-md border px-2 py-1.5 text-sm
                        border-gray-300 dark:border-gray-600
                        bg-white dark:bg-gray-800
                        text-gray-900 dark:text-gray-100
                        focus:outline-none focus:ring-2 focus:ring-primary-500
                        disabled:opacity-50
                        ${rowErrors.quantity ? 'border-red-500 focus:ring-red-500' : ''}
                    `}
                />
                {rowErrors.quantity && (
                    <p className="text-xs text-red-600 mt-0.5">{rowErrors.quantity}</p>
                )}
            </div>

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

function DeletedRow({ part, disabled, onUndo }) {
    if (!part.id) {
        // Brand-new row that was deleted before saving — just discard silently.
        return null
    }
    return (
        <div className="flex items-center justify-between px-3 py-2 mt-2 rounded-lg border border-dashed border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
            <span className="text-sm text-red-600 dark:text-red-400 line-through">
                {part._spareName || `Part #${part.id}`}
            </span>
            <button
                type="button"
                onClick={onUndo}
                disabled={disabled}
                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline disabled:opacity-50 transition-colors"
            >
                Undo
            </button>
        </div>
    )
}
