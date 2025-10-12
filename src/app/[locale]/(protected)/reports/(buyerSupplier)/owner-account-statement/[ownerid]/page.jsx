import { getOwnerAccountStatement } from "../../actions"
import PageView from "./View"

async function page({ params }) {
    const ownerId = (await params).ownerid
    const res = await getOwnerAccountStatement(ownerId)
    
    return (
        <PageView data={res} />
    )
}

export default page
