import { getCS } from "../../actions"
import CSForm from "../page"
import ErrorLoading from "@/components/ErrorLoading"

async function page({ params }) {
    const id = (await params).id
    const CS = await (await getCS(id)).data

    return (
        <div>
            {CS?.id ? (
                <CSForm obj={CS} />
            ) : (
              <ErrorLoading name={"global.errors"} err="pageNotFound" />
            ) }
        </div>
    )
}

export default page
