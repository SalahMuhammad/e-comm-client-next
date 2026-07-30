'use client'

import FormButton from '@/components/FormButton'
import Form from 'next/form'
import { redirect, RedirectType } from 'next/navigation'
import { useTranslations } from 'next-intl'
import styles from '@/styles/reports/main.module.css'
import { PermissionGate } from '@/components/PermissionGate'
import { PERMISSIONS } from '@/config/permissions.config'
import TextInput from '@/components/inputs/text/TextInput'
import useGenericResponseHandler from '@/components/custom hooks/useGenericResponseHandler'
import {useState} from 'react'
import { httpRequest  } from '@/utils/HTTPMethods'
import { toast } from 'sonner'

function page() {
    const handleResponse = useGenericResponseHandler();
    const [isLoading, setIsLoading] = useState(false);

    const t = useTranslations('maintenance.report');

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData(e.target);
        const serialNum = formData.get("serialNum");

        setIsLoading(true);
        const res = await httpRequest(`api/maintenance/?serial_number=${serialNum}`);
        console.log(res)
        if (handleResponse(res)) return;
        if (res.ok) {
            if ((res?.data?.count || 0) != 0) {
                // redirect(`/reports/maintenance-history/${serialNum}`, RedirectType.push);
            } else {
                toast.error(t("error404"))
            }
        }
        setIsLoading(false);
    }

    return (
        <PermissionGate permission={PERMISSIONS.MAINTENANCE_INVOICES.VIEW}>
            <div>
                <Form onSubmit={handleSubmit} className={styles.form}>
                    <h1 className='text-2xl font-bold mb-2'>{t("title")}</h1>
                    <TextInput
                        name="serialNum"
                        label={t("serial")}
                        error=''
                        required
                    />

                    <FormButton
                        type="submit"
                        variant="secondary"
                        size="md"
                        bgColor="bg-blue-500 dark:bg-blue-600"
                        hoverBgColor="bg-blue-700 dark:bg-blue-800"
                        textColor="text-white dark:text-gray-100"
                        className="w-full z-0 mt-4"
                        isLoading={isLoading}
                    >
                        {t("search")}
                    </FormButton>
                </Form>
            </div>
        </PermissionGate>
    )
}

export default page
