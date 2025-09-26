import { getTranslations } from "next-intl/server";
import { getPayment } from "../../../_common/actions"
import MyForm from "../../../_common/form"


async function page({ params }) {
    const t = await getTranslations("global.errors");
    const id = (await params).id
    const transaction = (await getPayment(id, 'expenses')).data


    return (
        transaction?.id ? (
            <MyForm initialData={transaction} type={'expenses'} />
        ) : (
            <div className="text-center text-red-500">{t('404')}</div>
        )
    )
}

export default page
