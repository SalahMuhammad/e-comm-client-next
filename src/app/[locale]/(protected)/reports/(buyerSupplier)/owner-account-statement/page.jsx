'use client'

import FormButton from '@/components/FormButton'
import { DynamicOptionsInput } from "@/components/inputs/index"
import Form from 'next/form'
import { redirect, RedirectType } from 'next/navigation'
import styles from '@/styles/reports/main.module.css'
import { useTranslations } from 'next-intl'

function page() {
    const t = useTranslations("reports")
    const handleSubmit = (e) => {
        e.preventDefault()

        const formData = new FormData(e.target);
        const owner = formData.get('owner');
        redirect(`/reports/owner-account-statement/${owner}`, RedirectType.push);
    }

    return (
        <div>
            <Form onSubmit={handleSubmit} className={styles.form}>
                <h1 className='text-2xl font-bold mb-2'>{t("reportSections.clientsSuppliers.links.accountStatement.label")}</h1>
                <DynamicOptionsInput
                    url={'/api/buyer-supplier-party/?s='}
                    name={`owner`}
                    placeholder={"Client-Supplier"}
                />

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
        </div>
    )
}

export default page
