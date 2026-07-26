import NotFound from "@/components/NotFound"
import { getTranslations } from "next-intl/server"
import ItemsForm from '../../components/ItemsFormV2'
import { httpRequest } from "@/utils/HTTPMethods"



async function page({ params }) {
    const { id } = await params
    const url = "/api/items/"
    const metadata = await httpRequest(url, 'OPTIONS')
    const initialDataResponse = await httpRequest(`${url}${id}/`, 'GET')
    const t = await getTranslations("")


    return (
        <div>
            {initialDataResponse.data?.id ? (
                <ItemsForm metadata={metadata} initialData={initialDataResponse.data}/>
            ) : (
                <NotFound 
                    name={t("warehouse.items.form.error")}
                />
            ) }
        </div>
    )
}

export default page
