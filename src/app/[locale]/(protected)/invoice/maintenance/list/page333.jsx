'use server'

import React from 'react'
import MaintenanceList from './components/List'
import { getTransactions } from '../actions'

async function page() {
    const res = await getTransactions('');
    

    return (
        <MaintenanceList initialData={ {results: res.data.results}} />
    )
}

export default page
