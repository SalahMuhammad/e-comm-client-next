import { getTransactions } from '../actions'
import MaintenanceForm from '../components/MaintenanceForm'


async function page() {
    const res = await getTransactions(0, 0, "OPTIONS")

    return (
        <MaintenanceForm metadata={res}/>
    )
}

export default page
