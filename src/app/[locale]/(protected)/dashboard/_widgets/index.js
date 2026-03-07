/**
 * Widget Component Barrel
 * ───────────────────────
 * Each widget lives in its own subfolder: ./<widget-id>/index.jsx
 * The export name MUST match the `componentName` field in configs.js.
 *
 * To add a new widget:
 *   1. Create ./<widget-id>/index.jsx  (server component or client wrapper)
 *   2. Add ONE export line here
 *   3. Add ONE entry in configs.js
 */

export { default as TotalSalesWidget } from './total-sales';
export { default as TotalPaymentsWidget } from './total-payments';
export { default as PendingDebtWidget } from './pending-debt';
export { default as PieChartWidget } from './pie-chart';
export { default as ScatterChartWidget } from './scatter-chart';
export { default as RefillableItemsCostAnalysisWidget } from './rica';
