import ScatterChartView from "@/components/dashboard/charts/Scatter";
import { getRefilledItems } from "@/app/[locale]/(protected)/refillable-items/actions";
import { getTranslations } from "next-intl/server";
import { ChartBarIcon } from "@heroicons/react/24/outline";

export default async function ScatterChartWidget() {
    const t = await getTranslations('dashboard.widgets.scatterChart');
    const res = await getRefilledItems(`?limit=150`);

    const transformed = (res?.data?.results || []).map(item => ({
        date: new Date(item.date),
        refilled: parseFloat(item.refilled_quantity),
        used: parseFloat(item.used_quantity),
        name: item.refilled_item_name,
        used_name: item.used_item_name,
        notes: item.notes,
    }));

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b border-gray-100 dark:border-gray-700/50">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-700 to-blue-900 shadow-sm">
                    <ChartBarIcon className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('title')}</h3>
            </div>
            <div className="flex-1 min-h-0">
                <ScatterChartView data={transformed} compact={true} className="w-full h-full" />
            </div>
        </div>
    );
}
