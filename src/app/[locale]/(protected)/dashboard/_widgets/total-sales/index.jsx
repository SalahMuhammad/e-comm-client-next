import StatCard from '@/components/dashboard/StatCard';
import { getCashAndDeferredPercentages } from '../actions';
import { getTranslations } from 'next-intl/server';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default async function TotalSalesWidget() {
    const t = await getTranslations('dashboard.widgets.totalSales');
    const res = await getCashAndDeferredPercentages();
    const total = res?.data?.total_orders;

    const formatted = total != null
        ? new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(total)
        : null;

    return (
        <StatCard
            title={t('title')}
            value={formatted}
            subtitle={t('subtitle')}
            gradient="from-blue-600 to-blue-800"
            icon={<CurrencyDollarIcon className="w-5 h-5" />}
        />
    );
}
