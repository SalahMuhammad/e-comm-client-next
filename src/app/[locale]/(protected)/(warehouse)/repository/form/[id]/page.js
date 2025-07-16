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
                <div className="text-center text-red-500">page not found</div>
            ) }
        </div>
    )
}

export default page
