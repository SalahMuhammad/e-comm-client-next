import { getItem } from "../../actions"
import ErrorLoading from "@/components/ErrorLoading"
import ItemsForm from "../page"

async function page({ params }) {
  const { id } = await params
  const item = await getItem(id)

  return (
      <div>
          {item?.id ? (
              <ItemsForm obj={item} />
          ) : (
              <ErrorLoading name={"warehouse.items.form"} />
          ) }
      </div>
  )
}

export default page
