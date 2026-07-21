'use client'


import { useState, useCallback, useId, useMemo } from 'react'
import MyButtonv2 from './MyButtonv2';

/**
 * SubModelHandler
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
export default function SubModelHandler({
    initialParts = [],
    // url = '?name=',
    // errors = {},
    disabled = false,
    onChange,
    keys = [],
    defaultValues = {},
    row = () => null
}) {
    const normalizedKeys = useCallback((part, isNew=false) => {
        if (isNew) {
            return {
                    ...keys.reduce((acc, key) => {
                    acc[key] = defaultValues[key] ?? null;
                    return acc;
                }, {})
            }
        }

        return {
            ...keys.reduce((acc, key) => {
                acc[key] = part[key] ?? null;
                return acc;
            }, {}) 
        }
    }, []);


    const uid = useId()
    const [obj, setObj] = useState(() => 
        initialParts.map(part => ({
            ...normalizedKeys(part),
            _rowKey: part.id ? `existing-${part.id}` : `new-${crypto.randomUUID()}`,
            _action: 'existing'
        }))
    );

    const notify = useCallback(
        (next) => {
            setObj(next)
            onChange?.(next)
        },
        [onChange]
    )

    // ── row helpers ───────────────────────────────────────────────────────────

    const addRow = () => {
        const key = `new-${Date.now()}`
        notify([
            ...obj,
            {
                ...normalizedKeys(null, true),
                _rowKey:            key,
                _action:            'create',
            },
        ])
    }

    const markDeleted = (rowKey) => {
        notify(
            obj.map((p) =>
                p._rowKey === rowKey
                    /* _actionBeforeDeletion: used in case of undo deletion to differ between update and exsisting */
                    ? { ...p, _actionBeforeDeletion: p._action, _action: 'delete' }
                    : p
            )
        )
    }

    const undoDelete = (rowKey) => {
        notify(
            obj.map((p) =>
                p._rowKey === rowKey
                    // restore: was it previously saved or brand-new?
                    ? { ...p, _action: p._actionBeforeDeletion }
                    : p
            )
        )
    }

    const updateField = (rowKey, field, value) => {
        notify(
            obj.map((p) => {
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
            obj.map((p) => {
                if (p._rowKey !== rowKey) return p
                const action = p._action === 'existing' ? 'update' : p._action
                return { ...p, ...patch, _action: action }
            })
        )
    }

    // ── derived state ─────────────────────────────────────────────────────────

    const visibleParts  = obj.filter((p) => p._action !== 'delete')
    const deletedParts  = obj.filter((p) => p._action === 'delete')

    // ── render ────────────────────────────────────────────────────────────────

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Spare parts
                </h3>
                <MyButtonv2
                    variant='secondary'
                    size='sm'
                    onClick={addRow}
                    disabled={disabled}
                >
                    <span aria-hidden="true">+ </span>
                    add new
                </MyButtonv2>
            </div>

            {visibleParts.length === 0 && (
                <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                    No spare parts added yet
                </p>
            )}

            <div className="space-y-2">
                {visibleParts.map((obj, index) => 
                    row(obj, index, uid, updateField, updateFields, markDeleted)
                )}
            </div>

            {/* Soft-deleted rows — kept in DOM so they're serialised */}
            {deletedParts.map((obj) => (
                <DeletedRow
                    key={obj._rowKey}
                    obj={obj}
                    disabled={disabled}
                    onUndo={() => undoDelete(obj._rowKey)}
                />
            ))}
        </div>
    )
}

function DeletedRow({ obj, disabled, onUndo }) {
    console.log(obj, obj._action.includes('create'))
    if (obj._actionBeforeDeletion.includes('create')) {
        // Brand-new row that was deleted before saving — just discard silently.
        return null
    }
    return (
        <div className="flex items-center justify-between px-3 py-2 mt-2 rounded-lg border border-dashed border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
            <span className="text-sm text-red-600 dark:text-red-400 line-through">
                {obj._spare_part_name || `Part #${obj.id}`}
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
