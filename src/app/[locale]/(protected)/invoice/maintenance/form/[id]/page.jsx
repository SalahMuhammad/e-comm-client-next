import { httpRequest } from '@/utils/HTTPMethods'
import MaintenanceForm from '../../components/MaintenanceForm'
import NotFound from "@/components/NotFound"


async function page({ params }) {
    const { id } = await params
    const url = "/api/maintenance/"
    const metadata = await httpRequest(url, 'OPTIONS')
    const initialDataResponse = await httpRequest(`${url}${id}/`, 'GET')


    return (
        <div>
            {initialDataResponse.data?._hashed_id ? (
                <MaintenanceForm metadata={metadata} initialData={initialDataResponse.data}/>
            ) : (
                <NotFound 
                    name={'record'} 
                />
            ) }
        </div>
    )
}

export default page
