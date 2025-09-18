import { getItem } from "../../actions"
import ErrorLoading from "@/components/ErrorLoading"
import ItemsForm from "../page"

async function page({ params }) {
  const { id } = await params
  const res = await getItem(id)

  return (
      <div>
          {res.data?.id ? (
              <ItemsForm obj={res.data} />
          ) : (
              <ErrorLoading name={"warehouse.items.form"} />
          ) }
      </div>
  )
}

export default page
