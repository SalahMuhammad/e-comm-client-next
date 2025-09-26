import InvoiceForm from "../../_common/form";


async function SalesForm({ initialData }) {
    return (
        <InvoiceForm type={'purchases'} initialData={initialData} />
    )
}

export default SalesForm
