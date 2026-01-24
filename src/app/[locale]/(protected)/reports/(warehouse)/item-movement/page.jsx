'use client'

import FormButton from '@/components/FormButton'
import { DynamicOptionsInput } from "@/components/inputs/index"
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
        const start_date = formData.get('start_date');
        const end_date = formData.get('end_date');
        const repository_id = formData.get('repository_id');

        redirect(`/reports/item-movement/results?item=${item}&start_date=${start_date}&end_date=${end_date}&repository_id=${repository_id}`, RedirectType.push)
    }

    return (
        <Form onSubmit={handleSubmit} className={styles.form}>
            <h1 className='text-2xl font-bold mb-2'>{t("reportSections.warehouse.links.itemMovement.label")}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <DynamicOptionsInput
                    url={'/api/items/?name='}
                    name={'item'}
                    placeholder={'Item'}
                />
                <DynamicOptionsInput
                    url={'/api/repositories/?s='}
                    name={'repository_id'}
                    placeholder={'Repository'}
                    isDisabled={true}
                />
                <div className="flex flex-col">
                    <label htmlFor="start_date" className="text-sm font-medium text-gray-600 mb-1.5">Start Date</label>
                    <input
                        className="border border-gray-300 rounded p-2"
                        type="date"
                        id="start_date"
                        name="start_date"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="end_date" className="text-sm font-medium text-gray-600 mb-1.5">End Date</label>
                    <input
                        className="border border-gray-300 rounded p-2"
                        type="date"
                        id="end_date"
                        name="end_date"
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
