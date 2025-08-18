'use server'
import InvoiceList from '../../common/list'

async function page({ searchParams }) {
  return (
    <InvoiceList searchParams={searchParams} type={'purchases'} />
  )
}

export default page
