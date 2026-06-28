'use client'

import { useActionState, useMemo } from 'react'
import {
    ignoreReadOnly,
    customeIgnore,
    getOrderedFields,
    groupsHandler,
    djangoPropsMap,
    resolveDefaultFieldProps,
} from './utility2'
import { componentMap } from './helpers2'


const DEFAULT_STATE = { errors: {}, values: {} }

const noopAction = async (prevState) => {
    console.warn('DynamicForm: no `action` prop provided — submissions go nowhere.')
    return prevState
}

export default function DynamicForm2({
    metadata,
    action,
    initialState = DEFAULT_STATE,
    readonlyExceptList = [],
    ignore = [],
    fieldOrder = [],
    groups = [], // <--- [{ fields: ['first_name', 'last_name'], Wrapper: MyGroup }]
    fieldProps = {}, // <--- {img: { onChange, value, placeholder }}
    customeFields = {}, // {field_name: custome jsx}
    dynamicOptionsInputURL = {},
    renderSubmit, // <--- optional (isPending) => JSX, defaults to a plain submit button
}) {
    const [state, formAction, isPending] = useActionState(action ?? noopAction, initialState)
    
    const rawFields = metadata?.data?.actions?.POST
    // readonlyExceptList/ignore/fieldOrder/groups need to be stable
    // references on the caller's side (useMemo, useState init, or a
    // module-level constant) for this memo to actually skip work — inline
    // array/object literals as props get a new identity every render.
    const { orderedFields, fieldToGroupMap } = useMemo(() => {
        if (!rawFields) return { orderedFields: null, fieldToGroupMap: {} }

        const formFields = { ...rawFields }
        ignoreReadOnly(formFields, readonlyExceptList)
        customeIgnore(formFields, ignore)

        return {
            orderedFields: getOrderedFields(formFields, fieldOrder),
            fieldToGroupMap: groupsHandler(groups),
        }
    }, [rawFields, readonlyExceptList, ignore, fieldOrder, groups])

    if (!orderedFields) return <p>Loading form configuration...</p>

    const renderField = (field, name) => {
        const fieldOverride = fieldProps[name] || {}
        const isControlled = 'value' in fieldOverride
        const defaultProps = resolveDefaultFieldProps(field, name, state?.values, isControlled)

        if (dynamicOptionsInputURL[name] && ! field['url']?.includes(dynamicOptionsInputURL[name])) {
            field['url'] = dynamicOptionsInputURL[name]
        }

        const dpm = djangoPropsMap(field, name)
        const InputComponent = componentMap(field)

        return (
            <InputComponent
                key={name}
                id={`field-${name}`}
                label={field.label}
                placeholder={field.label}
                error={state?.errors?.[name]}
                {...dpm}
                {...defaultProps}
                {...fieldOverride}
                disabled={isPending || (fieldOverride.disabled ?? dpm.disabled)}
            />
        )
    }

    const renderedFields = new Set()

    const fieldElements = Object.keys(orderedFields).map((name) => {
        if (renderedFields.has(name)) return null

        if (customeFields?.[name]) {
            renderedFields.add(name)
            return <div key={name}>{customeFields[name]}</div>
        }

        const group = fieldToGroupMap[name]

        if (group) {
            group.fields.forEach(f => renderedFields.add(f))

            return (
                <group.Wrapper key={`group-${name}`}>
                    {group.fields.map(fieldName => {
                        const field = orderedFields[fieldName]
                        if (!field) return null
                        return renderField(field, fieldName)
                    })}
                </group.Wrapper>
            )
        }

        renderedFields.add(name)
        const field = orderedFields[name]

        return (
            // <div key={name} className="flex flex-col">
                renderField(field, name)
            // </div>
        )
    })

    const nonFieldError = state?.errors?.non_field_errors?.join(', ') || state?.errors?.detail

    return (
        <form action={formAction}>
            {nonFieldError && (
                <p className="text-red-600" role="alert">{nonFieldError}</p>
            )}

            {fieldElements}

            {renderSubmit
                ? renderSubmit(isPending)
                : (
                    <button type="submit" disabled={isPending}>
                        {isPending ? 'Submitting…' : 'Submit'}
                    </button>
                )
            }
        </form>
    )
}
