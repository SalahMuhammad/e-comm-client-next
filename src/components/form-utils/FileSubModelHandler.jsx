'use client'

import { useState, useCallback, useId } from 'react'
import MyButtonv2 from './MyButtonv2'


export default function FileSubModelHandler({
    title,
    initialRows = [],
    disabled = false,
    onChange,
    onFileChange, // Custom handler to track files map
    row = () => null
}) {
    const uid = useId()
    const [obj, setObj] = useState(() =>
        initialRows.map(item => ({
            ...item,
            _rowKey: item.id ? `existing-${item.id}` : `new-${crypto.randomUUID()}`,
            _action: 'existing',
            _file: null // Holds the File object if selected
        }))
    );

    const notify = useCallback(
        (next) => {
            setObj(next)
            onChange?.(next)
        },
        [onChange]
    )

    const addRow = () => {
        const key = `new-${Date.now()}`
        notify([
            ...obj,
            {
                _rowKey: key,
                _action: 'create',
                title: '',
                _file: null
            },
        ])
    }

    const markDeleted = (rowKey) => {
        notify(
            obj.map((p) =>
                p._rowKey === rowKey
                    ? { ...p, _actionBeforeDeletion: p._action, _action: 'delete' }
                    : p
            )
        )
    }

    const undoDelete = (rowKey) => {
        notify(
            obj.map((p) =>
                p._rowKey === rowKey
                    ? { ...p, _action: p._action }
                    : p
            )
        )
    }

    const updateField = (rowKey, field, value) => {
        notify(
            obj.map((p) => {
                if (p._rowKey !== rowKey) return p
                const action = p._action === 'existing' ? 'update' : p._action
                return { ...p, [field]: value, _action: action }
            })
        )
    }

    const updateFile = (rowKey, fileObject) => {
        notify(
            obj.map((p) => {
                if (p._rowKey !== rowKey) return p
                const action = p._action === 'existing' ? 'update' : p._action
                return { ...p, _file: fileObject, _action: action }
            })
        )
    }

    const visibleRows = obj.filter((p) => p._action !== 'delete')
    const deletedRows = obj.filter((p) => p._action === 'delete')

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {title}
                </h3>
                <MyButtonv2
                    variant='secondary'
                    size='sm'
                    onClick={addRow}
                    disabled={disabled}
                >
                    <span aria-hidden="true">+ </span> add file
                </MyButtonv2>
            </div>

            <div className="space-y-2">
                {visibleRows.map((item, index) =>
                    row(item, index, uid, updateField, updateFile, markDeleted)
                )}
            </div>
        </div>
    )
}
