import { getItem } from "../../actions"
// import ErrorLoading from "@/components/ErrorLoading"
import ItemsForm from "../page"
import NotFound from "@/components/NotFound"
import { getTranslations } from "next-intl/server"

async function page({ params }) {
  const { id } = await params
  const res = await getItem(id)
  const t = await getTranslations("")

  return (
      <div>
          {res.data?.id ? (
              <ItemsForm obj={res.data} />
          ) : (
              <NotFound 
                name={t("warehouse.items.form.error")} 
                // customButton={{ href: "/items/list", label: "Home", icon: <HomeIcon className="w-5 h-5" /> }} 
              />
            //   <ErrorLoading name={"warehouse.items.form"} />
          ) }
      </div>
  )
}

export default page
