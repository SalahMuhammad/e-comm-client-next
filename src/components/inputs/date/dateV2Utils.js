export const formatDate = (isoString, locale = 'en-US', options = { year: "numeric", month: "long", day: "numeric" }) => {
    if (!isoString) return "";
    const [y, m, d] = isoString.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return isNaN(date.getTime()) ? "" : date.toLocaleDateString(locale, options);
};

export const toISODate = (input) => {
    if (!input) return "";
    const clean = input.trim().replace(/,/g, '/');
    
    // Check YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;
    
    // Check MM/DD/YYYY
    const mdy = clean.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (mdy) return `${mdy[3]}-${mdy[1].padStart(2, "0")}-${mdy[2].padStart(2, "0")}`;

    const parsed = Date.parse(clean);
    if (!isNaN(parsed)) {
        const d = new Date(parsed);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }
    return "";
};
