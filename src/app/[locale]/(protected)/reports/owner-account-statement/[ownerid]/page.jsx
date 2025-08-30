import { getOwnerAccountStatement } from "../../actions"


async function page({ params }) {
    const ownerId = (await params).ownerid
    const res = await getOwnerAccountStatement(ownerId)
    console.log(res)
    return (
        <div>

        </div>
    )
}

export default page
