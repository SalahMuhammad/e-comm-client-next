import { getDamagedItem } from "../../actions"
import { getItem } from "../../../actions"
import DamagedItemsForm from "../page"
import NotFound from "@/components/NotFound"
import { getTranslations } from "next-intl/server"

async function page({ params }) {
    const { id } = await params
    const res = await getDamagedItem(id)
    const t = await getTranslations("")

    let obj = res.data;

    // Fetch item details to get the name if item ID is present
    if (obj?.item) {
        const itemRes = await getItem(obj.item);
        if (itemRes.ok && itemRes.data) {
            obj = {
                ...obj,
                item_name: itemRes.data.name
            };
        }
    }

    return (
        <div>
            {obj?.id ? (
                <DamagedItemsForm obj={obj} />
            ) : (
                <NotFound
                    name={t("warehouse.repositories.damagedItems.form.error")}
                />
            )}
        </div>
    )
}

export default page
