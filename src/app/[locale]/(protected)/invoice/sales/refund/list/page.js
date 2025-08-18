'use server'
import InvoiceList from '@/app/[locale]/(protected)/invoice/common/list'

async function page({ searchParams }) {
  return (
    <InvoiceList searchParams={searchParams} type={'sales/refund'} />
  )
}

export default page
