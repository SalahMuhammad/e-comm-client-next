'use server';

import { apiRequest } from '@/utils/api';

/**
 * Shared data action used by TotalSales, TotalPayments, PendingDebt, and PieChart widgets.
 */
export async function getCashAndDeferredPercentages() {
    return await apiRequest('/api/sales/analysis/cash-deferred-percentages/');
}
