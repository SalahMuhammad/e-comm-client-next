import StatCard from '@/components/dashboard/StatCard';
import { getCashAndDeferredPercentages } from '../actions';
import { getTranslations } from 'next-intl/server';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default async function PendingDebtWidget() {
    const t = await getTranslations('dashboard.widgets.pendingDebt');
    const res = await getCashAndDeferredPercentages();

    const debt = res?.data?.total_remaining || 0;

    const formatted = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(debt);

    return (
        <StatCard
            title={t('title')}
            value={formatted}
            subtitle={t('subtitle')}
            gradient="from-blue-800 to-blue-950"
            icon={<ExclamationCircleIcon className="w-5 h-5" />}
        />
    );
}
