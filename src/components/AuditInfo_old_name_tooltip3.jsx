'use client';

import { useTranslations } from 'next-intl';


function AuditInfo({
    created_by,
    created_at,
    last_updated_by,
    last_updated_at,
    time_diff,
    flex_direction = 'flex-col'
}) {
    const t = useTranslations('auditInfo');


    return (
        <div className={`flex ${flex_direction} flex-wrap gap-x-6 gap-y-1 text-xs text-gray-400 dark:text-gray-500 px-1`}>
            <span>{t('createdBy')}: {created_by}</span>
            <span>{t('createdAt')}: {created_at}</span>
            <span>{t('lastUpdatedBy')}: {last_updated_by}</span>
            {time_diff !== '0s' ?
                (
                    <span className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                        {t('lastUpdatedAt')}: {last_updated_at}
                        {' '}
                        ({time_diff})
                    </span>
                )
                : <span>{t('lastUpdatedAt')}: {last_updated_at}</span>
            }
        </div>
    )
}

export default AuditInfo
