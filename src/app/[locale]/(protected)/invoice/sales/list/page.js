'use server'
import InvoiceList from '../../common/list'

async function page({ searchParams }) {
  return (
    <InvoiceList searchParams={searchParams} type={'sales'} />
  )
}

export default page
