import { getTranslations } from "next-intl/server";
import { getInv } from "../../../_common/actions"
import SalesForm from "../page"


async function page({ params }) {
    const t = await getTranslations("global.errors");
    const id = (await params).id
    const inv =  (await getInv('sales', id)).data

    return (
        <div>
            {inv?.id ? (
                <SalesForm initialData={inv} />
            ) : (
                <div className="text-center text-red-500">{t('404')}</div>
            ) }
        </div>
    )
}

export default page
