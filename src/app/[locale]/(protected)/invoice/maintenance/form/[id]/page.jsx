import { getTransactions } from '../../actions'
import MaintenanceForm from '../../components/MaintenanceForm'
import NotFound from "@/components/NotFound"


async function page({ params }) {
    const { id } = await params
    const res = await getTransactions(0, 0, "OPTIONS")
    const res2 = await getTransactions(0, id, "GET")

    return (
        <div>
            {res2.data?._hashed_id ? (
                <MaintenanceForm metadata={res} initialData={res2.data}/>
            ) : (
                <NotFound 
                    name={'record'} 
                />
            ) }
        </div>
    )
}

export default page
