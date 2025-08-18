import { getTranslations } from "next-intl/server";
import { getInv } from "../../../common/actions"
import PurchaseForm from "../page"


async function page({ params }) {
    const t = await getTranslations("global.errors");
    const id = (await params).id
    const inv = await (await getInv('purchases', id)).json()

    return (
        <div>
            {inv?.id ? (
                <PurchaseForm initialData={inv} />
            ) : (
                <div className="text-center text-red-500">{t('404')}</div>
            ) }
        </div>
    )
}

export default page
