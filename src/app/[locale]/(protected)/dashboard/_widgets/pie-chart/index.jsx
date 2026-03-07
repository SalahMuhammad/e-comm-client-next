import PieChartView from "@/components/dashboard/charts/PieChart";
import { getCashAndDeferredPercentages } from "../actions";
import { getTranslations } from "next-intl/server";
import { ChartPieIcon } from "@heroicons/react/24/outline";

export default async function PieChartWidget() {
    const t = await getTranslations('dashboard.widgets.pieChart');
    const res = await getCashAndDeferredPercentages();

    const ordersTotalAmount = res?.data?.total_orders || 0;
    const totalRemaining = res?.data?.total_remaining || 0;

    const deferredPct = ordersTotalAmount ? (totalRemaining / ordersTotalAmount) * 100 : 0;
    const cashPct = ordersTotalAmount ? 100 - deferredPct : 100;

    const transformed = [
        { name: 'Deferred', value: parseFloat(deferredPct.toFixed(1)) },
        { name: 'Cash', value: parseFloat(cashPct.toFixed(1)) },
    ];

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b border-gray-100 dark:border-gray-700/50">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 shadow-sm">
                    <ChartPieIcon className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('title')}</h3>
            </div>
            <div className="flex-1 min-h-0">
                <PieChartView chartData={transformed} className="w-full h-full" />
            </div>
        </div>
    );
}
