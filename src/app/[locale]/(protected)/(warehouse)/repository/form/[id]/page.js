import ErrorLoading from "@/components/ErrorLoading"
import { getRepository } from "../../actions"
import RepositoryForm from "../page"

async function page({ params }) {
    const id = (await params).id
    const repo = await getRepository(id)

    return (
        <div>
            {repo?.id ? (
                <RepositoryForm obj={repo} />
            ) : (
                <ErrorLoading name={"warehouse.repositories.form"} />
            ) }
        </div>
    )
}

export default page
