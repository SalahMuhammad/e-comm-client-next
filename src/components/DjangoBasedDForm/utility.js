export const ignoreReadOnly = (obj, except) => {
    obj && Object?.keys(obj)?.forEach(key => {
        if (obj[key]?.read_only && ! except.includes(key))
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
    if (! formFields) return
    let orderedFieldsObj = {};

    fieldOrder.forEach(key => {
        if (formFields[key]) {
            orderedFieldsObj[key] = formFields[key];
        }
    });

    // 3. Add any remaining fields that weren't in fieldOrder 
    // (This ensures you don't lose fields if they aren't in your criteria)
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
            // Only map if the group hasn't been assigned to another field yet
            if (!fieldToGroupMap[fieldName]) fieldToGroupMap[fieldName] = group;
        });
    });

    return fieldToGroupMap
}

export const djangoPropsMap = (props = {}, name) => {
    const mappedProps = {}

    // List of keys to NEVER spread into the HTML input
    const blackList = [
        'value', 
        'label', 
        'initial', 
        'type', 
        // 'required', 
        'max_length', 
        'is_foreign_key', 
        'is_reverse', 
        'endpoint'
    ];

    mappedProps['name'] = name

    Object.keys(props).map(key => {
        if (blackList.includes(key)) return;
        
        switch (key) {
            case 'read_only':
                mappedProps['disabled'] = props['read_only']
                break;
            case 'help_text':
                mappedProps['title'] = props['help_text'];
                break;
            // case 'endpoint':
            //     mappedProps['url'] = props['endpoint']
            default:
                mappedProps[key] = props[key]
        }
    })

    return mappedProps
}
