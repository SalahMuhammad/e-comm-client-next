import { ignoreReadOnly, customeIgnore, getOrderedFields, groupsHandler, djangoPropsMap } from './utility'
import { componentMap } from './helpers'


export default function DynamicForm({ 
    metadata, 
    readonlyExceptList=[], 
    ignore=[], 
    fieldOrder=[], 
    groups = [], // <--- [{ fields: ['first_name', 'last_name'], Wrapper: MyGroup }] 
    fieldProps = {}, // <--- {img: { onChange, value, placeholder }}
    customeFields = {}
}) {
    const rawFields = metadata?.data?.actions?.POST;

    if (!rawFields) return <p>Loading form configuration...</p>;

    const formFields = { ...rawFields };
console.log('from dform too many rerenders issue')
    // Apply filtering logic
    ignoreReadOnly(formFields, readonlyExceptList);
    customeIgnore(formFields, ignore);
    const orderedFields = getOrderedFields(formFields, fieldOrder);
    // 1. Map each field name to its corresponding group for O(1) lookup
    const fieldToGroupMap = groupsHandler(groups)

    const renderedFields = new Set();

    return Object.keys(orderedFields).map((name) => {
        // Skip if this field was already rendered as part of a group
        if (renderedFields.has(name)) return null;
        
        // FIX 1: Correctly return the custom field JSX
        if (customeFields?.[name]) {
            renderedFields.add(name);
            return <div key={name}>{customeFields[name]}</div>;
        }

        const group = fieldToGroupMap[name];

        if (group) {
            // 2. Render the whole group at this position
            // Mark all fields in this group as 'rendered' immediately
            group.fields.forEach(f => renderedFields.add(f));

            return (
                <group.Wrapper key={`group-${name}`}>
                    {group.fields.map(fieldName => {
                        const uuid = crypto.randomUUID();

                        const field = orderedFields[fieldName];
                        if (!field) return null;
                        const dpm = djangoPropsMap(field, fieldName)
                        const InputComponent = componentMap(field.type);

                        return (
                            <InputComponent 
                                key={fieldName}
                                id={uuid}
                                label={field.label}
                                placeholder={field.label}
                                {...dpm}
                                {...(fieldProps[fieldName] || {})}
                            />
                        );
                    })}
                </group.Wrapper>
            );
        }

        // 3. Render individual field if not part of a group
        renderedFields.add(name);
        const uuid = crypto.randomUUID();

        const field = orderedFields[name];
        const dpm = djangoPropsMap(field, name)
        const InputComponent = componentMap(field.type);

        return (
            <div key={name} className="flex flex-col">
                <InputComponent 
                    id={uuid}
                    label={field.label}
                    placeholder={field.label}
                    {...dpm}
                    {...(fieldProps[name] || {})}
                />
            </div>
        );
    })
}
