import { TextInputV2, DateInputV2, FileInputV2, NumberInputV2, DynamicOptionsInput } from "@/components/inputs";


export const componentMap = (type) => {
    switch (type) {
        case "string":
            return TextInputV2;
        // case "field":
        //     if (url) return DynamicOptionsInput
        case "decimal":
        case "integer":
            return NumberInputV2;
        case "datetime":
            return DateInputV2;
        case "field 2":
            return FileInputV2;
        case "boolean":
            // return CheckboxInputV2;
            // return TextInputV2; 
        default:
            return TextInputV2; // Fallback
    }
}
