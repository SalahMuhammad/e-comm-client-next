import { httpRequest } from '@/utils/HTTPMethods'
import ItemsForm from '../components/ItemsFormV2'



async function page() {
    const res = await httpRequest('api/items/', "OPTIONS")


    return (
        <ItemsForm metadata={res}/>
    )
}

export default page
