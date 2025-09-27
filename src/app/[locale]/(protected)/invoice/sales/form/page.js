import InvoiceForm from "../../_common/form";


async function SalesForm({ initialData }) {
    return (
        <InvoiceForm type={'sales'} initialData={initialData} />
    )
}

export default SalesForm
