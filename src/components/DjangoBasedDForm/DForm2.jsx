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
import MyButtonv2 from '../form-utils/MyButtonv2'
import NotifyV2 from '../sonner_actions/NotifyV2'


const DEFAULT_STATE = { errors: {}, values: {} }

const noopAction = async (prevState) => {
    console.warn('DynamicForm: no `action` prop provided — submissions go nowhere.')
    return prevState
}

export default function DynamicForm2({
    title,
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

        if (dynamicOptionsInputURL[name] && !field['url']?.includes(dynamicOptionsInputURL[name])) {
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
            // Prepare the props you want to pass
            const fieldProps = {
                errors: state?.errors,
                isPending,
            };

            // Execute the function
            const CustomComponent = customeFields[name];

            return (
                <div key={name} className="w-full h-full overflow-x-auto z-50 overflow-y-hidden pb-20">
                    <div className="flex h-full w-max min-w-full items-center gap-4">
                        <div className="flex-1 min-w-0">
                            {CustomComponent(fieldProps)}
                        </div>
                    </div>
                </div>
            );
        }

        const group = fieldToGroupMap[name]

        if (group) {
            group.fields.forEach(f => renderedFields.add(f))

            return (
                <group.Wrapper
                    key={`group-${name}`}
                    {...group.wrapperProps}
                >

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
        <div className='w-full max-w-full mx-auto overflow-x-hidden font-sans p-2.5 sm:p-4 lg:p-5'>
            <form action={formAction} className='bg-[var(--background)] dark:bg-[#273549] rounded-xl shadow-md overflow-hidden'>
                {title && (
                    <div className="bg-[#f9f9fb] p-4 sm:p-6 border-b border-gray-200 mb-4 dark:bg-slate-800 dark:border-slate-700">
                        <h2 className="m-0 text-xl sm:text-2xl font-semibold text-gray-800 dark:text-slate-200">
                            {title}
                        </h2>
                    </div>
                )}

                {nonFieldError && (
                    <NotifyV2 key={Math.random()} message={nonFieldError} variant='error' />
                )}

                {fieldElements}

                <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-slate-700 flex justify-center">
                    {renderSubmit
                        ? renderSubmit(isPending)
                        : (
                            <MyButtonv2
                                type='submit'
                                variant={(initialState.values?.id || initialState.values?._hashed_id) ? 'success' : 'primary'}
                                disabled={isPending}
                            >
                                {isPending ? 'Saving…' : (initialState.values?.id || initialState.values?._hashed_id) ? 'Save changes' : 'Create record'}
                            </MyButtonv2>
                        )
                    }
                </div>
            </form>
        </div>
    )
}
