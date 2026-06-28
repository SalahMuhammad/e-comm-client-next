import {
    TextInputV2,
    DateInputV2,
    FileInputV2,
    NumberInputV2,
    DynamicOptionsInput,
    TextAreaInput2
    // CheckboxInputV2, // verify this is actually exported from @/components/inputs
} from "@/components/inputs";

export const componentMap = (field) => {
    switch (field.type) {
        case "string":
        case "url":
            if (field.ui_type == "textarea") return TextAreaInput2
            return TextInputV2;
        case "field":
            // Relational field. Vanilla DRF OPTIONS doesn't include
            // is_foreign_key/endpoint by default — these only show up if
            // your backend's metadata class adds them.
            // if (field.is_foreign_key && field.endpoint) return DynamicOptionsInput;
            if (field.is_foreign_key) return DynamicOptionsInput;
            return TextInputV2;
        case "choice":
            // TODO: stock DRF ChoiceField metadata exposes an inline
            // `choices` array rather than an endpoint — wire a native
            // <select> here if/when you need it.
            return TextInputV2;
        case "decimal":
        case "integer":
        case "float":
            return NumberInputV2;
        case "datetime":
        case "date":
            return DateInputV2;
        case "file upload": // confirm this matches your DRF version's metadata.py
            return FileInputV2;
        // case "boolean":
        //     return CheckboxInputV2;
        default:
            return TextInputV2;
    }
}