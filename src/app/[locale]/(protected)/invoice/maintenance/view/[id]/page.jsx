import React from 'react'
import MaintenanceView from '../../components/MaintenanceView'
import NotFound from "@/components/NotFound"
import { httpRequest } from '@/utils/HTTPMethods'


async function page({ params }) {
    const { id } = await params
    const res = await httpRequest(`api/maintenance/${id}/`, "GET")


    return (
        <div>
            {res.data?._hashed_id ? (
                <MaintenanceView data={res?.data} />
            ) : (
                <NotFound 
                    name={'record'} 
                    customButton={{label: "back to the list", href: '/invoice/maintenance/list'}}
                />
            ) }
        </div>
    )
}

export default page
