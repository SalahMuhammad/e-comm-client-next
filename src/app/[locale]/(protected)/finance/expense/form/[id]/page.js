import { getTranslations } from "next-intl/server";
import { getExpense } from "../../actions";
import ExpenseForm from "../page";


async function page({ params }) {
    const t = await getTranslations("global.errors");
    const hashed_id = (await params).id
    const expense = (await getExpense(hashed_id)).data


    return (
        expense?.hashed_id ? (
            <ExpenseForm initialData={expense} />
        ) : (
            <div className="text-center text-red-500">{t('404')}</div>
        )
    )
}

export default page
