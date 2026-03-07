import StatCard from '@/components/dashboard/StatCard';
import { getCashAndDeferredPercentages } from '../actions';
import { getTranslations } from 'next-intl/server';
import { BanknotesIcon } from '@heroicons/react/24/outline';

export default async function TotalPaymentsWidget() {
    const t = await getTranslations('dashboard.widgets.totalPayments');
    const res = await getCashAndDeferredPercentages();
    const totalOrders = res?.data?.total_orders ?? 0;
    const totalRemaining = res?.data?.total_remaining ?? 0;
    const collected = Math.max(0, totalOrders - totalRemaining);

    const formatted = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(collected);

    return (
        <StatCard
            title={t('title')}
            value={formatted}
            subtitle={t('subtitle')}
            gradient="from-blue-700 to-blue-900"
            icon={<BanknotesIcon className="w-5 h-5" />}
        />
    );
}
