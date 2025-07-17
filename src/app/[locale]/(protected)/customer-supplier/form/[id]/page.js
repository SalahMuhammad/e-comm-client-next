import { getTranslations } from "next-intl/server";
import { getCS } from "../../actions"
import CSForm from "../page"

async function page({ params }) {
    const t = await getTranslations("global.errors");
    const id = (await params).id
    const CS = await getCS(id)

    return (
        <div>
            {CS?.id ? (
                <CSForm obj={CS} />
            ) : (
                <div className="text-center text-red-500">{t('404')}</div>
            ) }
        </div>
    )
}

export default page
