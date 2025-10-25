'use client'

import FormButton from '@/components/FormButton'
import SearchableDropdown from '@/components/SearchableDropdown'
import { formatDateManual } from '@/utils/dateFormatter'
import Form from 'next/form'
import { redirect, RedirectType } from 'next/navigation'
import styles from '@/styles/reports/main.module.css'
import { useTranslations } from 'next-intl'

function page() {
    const t = useTranslations("reports")
    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target);
        const item = formData.get('item');
        const from_date = formData.get('fromdate');
        const to_date = formData.get('todate');
        const repository_id = formData.get('repository_id');

        redirect(`/reports/sales-refund-items-totals/results/?fromdate=${from_date}&todate=${to_date}`, RedirectType.push)
    }

    return (
        <Form onSubmit={handleSubmit} className={styles.form}>
            <h1 className='text-2xl font-bold mb-2'>{t("reportSections.warehouse.links.itemMovement.label")}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="flex flex-col">
                    <label htmlFor="fromdate" className="text-sm font-medium text-gray-600 mb-1.5">Start Date</label>
                    <input
                        className="border border-gray-300 rounded p-2"
                        type="date"
                        id="fromdate"
                        name="fromdate"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="todate" className="text-sm font-medium text-gray-600 mb-1.5">End Date</label>
                    <input
                        className="border border-gray-300 rounded p-2"
                        type="date"
                        id="todate"
                        name="todate"
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
