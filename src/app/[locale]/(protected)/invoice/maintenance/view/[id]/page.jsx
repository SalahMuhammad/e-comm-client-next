import React from 'react'
import MaintenanceView from '../components/MaintenanceView'
import { getTransactions } from '../../actions'

async function page({ params }) {
    const { id } = await params
    const res = await getTransactions('', id)


    return (
        <MaintenanceView data={res?.data} />
    )
}

export default page
