'use client'

import { useTranslations } from 'use-intl';
import { PrinterIcon } from '@heroicons/react/24/outline';


function PrintButton() {
    const t = useTranslations()

    const handlePrint = () => {
        window.print();
    }

    return (
        <button
            onClick={handlePrint}
            style={{ backgroundColor: '#1e40af', opacity: 1 }}
            className="inline-flex cursor-pointer items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors duration-200 text-sm font-medium shadow-sm hover:shadow-md"
        >
            <PrinterIcon className="h-4 w-4" />
            {t('global.print.label')}
        </button>
    )
}

export default PrintButton
