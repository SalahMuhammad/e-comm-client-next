import { getTranslations } from "next-intl/server";
import { getDebtSettlement } from "../../actions";
import DebtSettlementForm from "../page";


async function page({ params }) {
    const t = await getTranslations("global.errors");
    const hashed_id = (await params).id
    const transaction = (await getDebtSettlement(hashed_id)).data


    return (
        transaction?.id ? (
            <DebtSettlementForm initialData={transaction} />
        ) : (
            <div className="text-center text-red-500">{t('404')}</div>
        )
    )
}

export default page
