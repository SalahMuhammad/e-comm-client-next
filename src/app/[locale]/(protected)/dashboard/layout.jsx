import { getTranslations } from 'next-intl/server';
import { getUserPermissionsAndStatus } from '@/utils/auth/role';
import { PERMISSIONS } from '@/config/permissions.config';
import { ChartBarIcon } from '@heroicons/react/24/outline';

export default async function DashboardLayout({ children, ScatterChart, PieChart, RefillableItemsCostAnalysis }) {
    const { permissions: userPermissions, isSuperuser } = await getUserPermissionsAndStatus();
    const t = await getTranslations('dashboard');

    const hasPieChartPerm = isSuperuser || userPermissions.includes(PERMISSIONS.SALES_INVOICES.VIEW);
    const hasScatterChartPerm = isSuperuser || userPermissions.includes(PERMISSIONS.REFILLABLE_ITEMS.VIEW);
    const hasAnyChartPerm = hasPieChartPerm || hasScatterChartPerm;

    if (!hasAnyChartPerm) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300 pt-3 rounded-md">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                    <div className="flex flex-col items-center justify-center p-12 mt-4 text-center bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="w-20 h-20 mb-6 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                            <ChartBarIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {t("emptyState.title")}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                            {t("emptyState.description")}
                        </p>
                    </div>
                </div>
                <div>{children}</div>
            </div>
        );
    }

    return (
        <>
            <div>{hasScatterChartPerm ? ScatterChart : null}</div>
            <div className="mb-3">{RefillableItemsCostAnalysis}</div>

            <div className="grid grid-cols-8 gap-1 w-full">
                <div className="col-span-8 md:col-span-4 row-span-4">{hasPieChartPerm ? PieChart : null}</div>
            </div>
            <div>{children}</div>
        </>
    );
}