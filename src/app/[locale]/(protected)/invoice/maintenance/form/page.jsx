import DynamicForm2 from '@/components/DjangoBasedDForm/DForm2'
import { getTransactions } from '../actions'
// import MaintenanceForm from './components/MaintenanceForm'
import MaintenancePage from './a/page'


async function page() {
    const res = await getTransactions(0, 0, "OPTIONS")
    console.log(res)
    // return (
    //     // <MaintenanceForm />
    //     <DynamicForm2 
    //         fieldOrder={['client', 'item']} 
    //         metadata={res} 
    //         dynamicOptionsInputURLSuffix={{
    //             item: '?name=',
    //             client: '?s=',
    //             by: '?first_name='
    //         }}
    //          />
    // )

    return (
        <MaintenancePage metadata={res}/>
    )
}

export default page
