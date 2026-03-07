/**
 * WIDGET REGISTRY — Metadata only (no React imports, client-safe)
 * ─────────────────────────────────────────────────────────────────
 * To add a new widget:
 *  1. Create your component in ./_widgets/YourWidget.jsx
 *  2. Add ONE entry here (copy-paste a similar one and adjust)
 *  3. Add ONE export line in ./_widgets/index.js
 *
 * Fields:
 *  id           — matches the key, used as the grid item id
 *  componentName — must match the export name in index.js
 *  compact      — true = use small skeleton fallback
 *  defaultW/H   — grid columns/rows when first added
 *  minW/H maxW/H — resize constraints
 *  colorClass   — Tailwind gradient for drag handle & library icon
 *  iconName     — any @heroicons/react/24/outline icon name
 */

export const WIDGET_REGISTRY = {
    'total-sales': {
        id: 'total-sales',
        componentName: 'TotalSalesWidget',
        // permission: 'SALES_INVOICES.VIEW',
        permission: null,
        compact: true,
        defaultW: 4, defaultH: 3,
        minW: 3, minH: 3,
        maxW: 6, maxH: 4,
        colorClass: 'from-blue-600 to-blue-800',
        iconName: 'CurrencyDollarIcon',
    },
    'total-payments': {
        id: 'total-payments',
        componentName: 'TotalPaymentsWidget',
        // permission: 'SALES_INVOICES.VIEW',
        permission: null,
        compact: true,
        defaultW: 4, defaultH: 3,
        minW: 3, minH: 3,
        maxW: 6, maxH: 4,
        colorClass: 'from-blue-700 to-blue-900',
        iconName: 'BanknotesIcon',
    },
    'pending-debt': {
        id: 'pending-debt',
        componentName: 'PendingDebtWidget',
        // permission: 'SALES_INVOICES.VIEW',
        permission: null,
        compact: true,
        defaultW: 4, defaultH: 3,
        minW: 3, minH: 3,
        maxW: 6, maxH: 4,
        colorClass: 'from-blue-800 to-blue-950',
        iconName: 'ExclamationCircleIcon',
    },
    'pie-chart': {
        id: 'pie-chart',
        componentName: 'PieChartWidget',
        // permission: 'SALES_INVOICES.VIEW',
        permission: null,
        compact: false,
        defaultW: 5, defaultH: 6,
        minW: 4, minH: 5,
        maxW: 12, maxH: 10,
        colorClass: 'from-blue-600 to-blue-800',
        iconName: 'ChartPieIcon',
    },
    'scatter-chart': {
        id: 'scatter-chart',
        componentName: 'ScatterChartWidget',
        permission: 'REFILLABLE_ITEMS.VIEW',
        compact: false,
        defaultW: 7, defaultH: 6,
        minW: 4, minH: 5,
        maxW: 12, maxH: 10,
        colorClass: 'from-blue-700 to-blue-900',
        iconName: 'ChartBarIcon',
    },
    'rica': {
        id: 'rica',
        componentName: 'RefillableItemsCostAnalysisWidget',
        permission: 'REFILLABLE_ITEMS.VIEW',
        compact: false,
        defaultW: 12, defaultH: 8,
        minW: 8, minH: 8,
        maxW: 12, maxH: 14,
        colorClass: 'from-blue-700 to-blue-900',
        iconName: 'ChartBarSquareIcon',
    },
};
