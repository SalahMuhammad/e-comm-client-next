
export function addDays(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}

export function formatDateManual(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2-digit day
    return `${year}-${month}-${day}`;
}

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const formatDateTime = (dateString, is12Hour) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',      // Include hours
        minute: '2-digit',    // Include minutes
        second: '2-digit',    // Include seconds (optional)
        hour12: is12Hour          // Use 12-hour clock (AM/PM)
    });
};
