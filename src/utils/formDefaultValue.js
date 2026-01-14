/**
 * Utility function to get default values for form inputs.
 * Prioritizes: state.formData -> initialData -> defaultValue
 * 
 * @param {Object} state - The form state object containing formData
 * @param {Object} initialData - Initial data object (e.g., from API response)
 * @param {string} valueKey - The key for the value field
 * @param {Object} options - Configuration options
 * @param {string} options.labelKey - The key for the label field (for select inputs)
 * @param {Array} options.selectOptions - Array of options to find label from (e.g., [{value: 'x', label: 'Label X'}])
 * @param {*} options.defaultValue - Fallback value if nothing is found (defaults to '' for simple values, undefined for select values)
 * 
 * @returns {string|Object|undefined} - Returns a string for simple inputs, or {value, label} for select inputs
 * 
 * @example
 * // Simple text/number input
 * const defaultAmount = getFormDefaultValue(state, initialData, 'amount', { defaultValue: '' })
 * 
 * @example
 * // Select input with separate label field
 * const defaultVault = getFormDefaultValue(state, initialData, 'vault_id', { 
 *   labelKey: 'vault_name' 
 * })
 * 
 * @example
 * // Select input with options array to find label
 * const defaultType = getFormDefaultValue(state, initialData, 'transfer_type', { 
 *   selectOptions: transferTypeOptions,
 *   defaultValue: transferTypeOptions[0]
 * })
 */
export function getFormDefaultValue(state, initialData, valueKey, options = {}) {
    const {
        labelKey = null,
        selectOptions = null,
        defaultValue = labelKey || selectOptions ? undefined : ''
    } = options;

    // Get the value from state or initialData
    const value = state.formData?.[valueKey] || initialData?.[valueKey];

    // If no value exists, return the default
    if (!value && value !== 0 && value !== false) {
        return defaultValue;
    }

    // For simple values (no label needed)
    if (!labelKey && !selectOptions) {
        return value;
    }

    // For select inputs with a separate label field
    if (labelKey) {
        const label = state.formData?.[labelKey] || initialData?.[labelKey];
        return {
            value,
            label
        };
    }

    // For select inputs where we need to find the label from options array
    if (selectOptions) {
        const option = selectOptions.find(opt => opt.value === value);
        return {
            value,
            label: option?.label || value
        };
    }

    return value;
}
