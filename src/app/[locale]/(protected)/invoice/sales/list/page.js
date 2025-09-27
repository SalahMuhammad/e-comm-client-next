'use server'
import InvoiceList from '../../_common/list'

async function page({ searchParams }) {
  return (
    <InvoiceList searchParams={searchParams} type={'sales'} />
  )
}

export default page
