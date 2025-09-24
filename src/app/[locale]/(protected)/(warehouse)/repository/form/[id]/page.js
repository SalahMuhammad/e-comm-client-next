// import ErrorLoading from "@/components/ErrorLoading"
import { getRepository } from "../../actions"
import RepositoryForm from "../page"
import NotFound from "@/components/NotFound"
import { getTranslations } from "next-intl/server"

async function page({ params }) {
    const id = (await params).id
    const repo = (await getRepository(id)).data
    const t = await getTranslations()

    return (
        <div>
            {repo?.id ? (
                <RepositoryForm obj={repo} />
            ) : (
                <NotFound 
                    name={t("warehouse.repositories.form.error")} 
                    // customButton={{ href: "/repository/list", label: "Home", icon: <HomeIcon className="w-5 h-5" /> }} 
                />
                // <ErrorLoading name={"warehouse.repositories.form"} />
            ) }
        </div>
    )
}

export default page
