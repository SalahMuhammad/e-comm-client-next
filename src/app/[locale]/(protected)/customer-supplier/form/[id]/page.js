import { getTranslations } from "next-intl/server"
import { getCS } from "../../actions"
import CSForm from "../page"
import NotFound from "@/components/NotFound"
// import ErrorLoading from "@/components/ErrorLoading"

async function page({ params }) {
    const id = (await params).id
    const CS = await (await getCS(id)).data
    const t = await getTranslations("")

    return (
        <div>
            {CS?.id ? (
                <CSForm obj={CS} />
            ) : (
            <NotFound 
                name={t("customer-supplier.form.error")} 
                // customButton={{ href: "/customer-supplier/list", label: "Home", icon: <HomeIcon className="w-5 h-5" /> }} 
            />
            //   <ErrorLoading name={"global.errors"} err="pageNotFound" />
            ) }
        </div>
    )
}

export default page
