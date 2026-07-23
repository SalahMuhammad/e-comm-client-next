import MaintenanceForm from '../components/MaintenanceForm'
import { httpRequest } from '@/utils/HTTPMethods'



async function page() {
    const res = await httpRequest('api/maintenance/', "OPTIONS")

    return (
        <MaintenanceForm metadata={res}/>
    )
}

export default page
