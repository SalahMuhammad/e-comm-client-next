export const ignoreReadOnly = (obj, except) => {
    obj && Object?.keys(obj)?.forEach(key => {
        if (obj[key]?.read_only && !except.includes(key))
            delete obj[key]
    })
}

export const customeIgnore = (obj, ignoreList) => {
    obj && ignoreList.forEach(key => {
        if (obj[key])
            delete obj[key]
    })
}

export const getOrderedFields = (formFields, fieldOrder) => {
    if (!formFields) return
    let orderedFieldsObj = {};

    fieldOrder.forEach(key => {
        if (formFields[key]) {
            orderedFieldsObj[key] = formFields[key];
        }
    });

    Object.keys(formFields).forEach(key => {
        if (!orderedFieldsObj.hasOwnProperty(key)) {
            orderedFieldsObj[key] = formFields[key];
        }
    });

    return orderedFieldsObj
}

export const groupsHandler = (groups) => {
    const fieldToGroupMap = {};

    groups.forEach(group => {
        group.fields.forEach(fieldName => {
            if (!fieldToGroupMap[fieldName]) fieldToGroupMap[fieldName] = group;
        });
    });

    return fieldToGroupMap
}

export const djangoPropsMap = (props = {}, name) => {
    const mappedProps = {}

    // Only things consumed elsewhere (label, initial) or that shouldn't leak
    // onto the DOM as-is (DRF's abstract `type`, component-selection flags).
    const blackList = [
        'value',
        'label',
        'initial',
        'type',
        'is_foreign_key',
        'is_reverse',
        'endpoint',
        'endpoints'
    ];

    mappedProps['name'] = name

    Object.keys(props).forEach(key => {
        if (blackList.includes(key)) return;

        switch (key) {
            case 'read_only':
                mappedProps['disabled'] = props['read_only']
                break;
            case 'help_text':
                mappedProps['title'] = props['help_text'];
                break;
            // case 'endpoint':
            //     mappedProps['url'] = props['endpoints']
            //     break;
            case 'max_length':
                mappedProps['maxLength'] = props['max_length']
                break;
            default:
                mappedProps[key] = props[key]
        }
    })

    return mappedProps
}

// Resolves controlled vs uncontrolled per field. useActionState reads
// submitted values straight off the DOM via FormData, so the default here
// is uncontrolled (defaultValue/defaultChecked) — the fieldProps escape
// hatch (passing an explicit `value`) is preserved for cases like an image
// preview where you genuinely need controlled behavior.
export const resolveDefaultFieldProps = (field, name, priorValues, isControlled) => {
    if (isControlled) return {}

    if (field.type === 'boolean') {
        return { defaultChecked: priorValues?.[name] ?? field.initial ?? false }
    }

    return { defaultValue: priorValues?.[name] ?? field.initial ?? '' }
}