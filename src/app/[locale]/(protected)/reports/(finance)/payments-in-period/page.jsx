'use client'

import FormButton from '@/components/FormButton'
import { addDays, formatDateManual } from '@/utils/dateFormatter'
import Form from 'next/form'
import { redirect, RedirectType } from 'next/navigation'
import styles from '@/styles/reports/main.module.css'
import { useTranslations } from 'next-intl'

function page() {
    const t = useTranslations("reports")
    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target);
        const from = formData.get('from');
        const to = formData.get('to');

        redirect(`/reports/payments-in-period/${from}   ${to}`, RedirectType.push)
    }

    return (
       <Form onSubmit={handleSubmit} className={styles.form}>
            <h1 className='text-2xl font-bold mb-2'>{t("reportSections.finance.links.paymentsInPeriod.label")}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col">
                    <label htmlFor="from" className="text-sm font-medium text-gray-600 mb-1.5">From</label>
                    <input
                        className="border border-gray-300 rounded p-2"
                        type="date"
                        id="from"
                        name="from"
                        defaultValue={formatDateManual(addDays(-30))}
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="to" className="text-sm font-medium text-gray-600 mb-1.5">To</label>
                    <input
                        className="border border-gray-300 rounded p-2"
                        type="date"
                        id="to"
                        name="to"
                        defaultValue={formatDateManual(new Date())}
                        required
                    />
                </div>
            </div>

            <FormButton
                type="submit"
                variant="secondary"
                size="md"
                bgColor="bg-blue-500 dark:bg-blue-600"
                hoverBgColor="bg-blue-700 dark:bg-blue-800"
                textColor="text-white dark:text-gray-100"
                className="w-full z-0 mt-4"
            >
                {t("generate")}
            </FormButton>
        </Form>
    )
}

export default page
