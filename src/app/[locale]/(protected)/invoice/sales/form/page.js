import InvoiceForm from "../../common/form";


async function SalesForm({ initialData }) {
    return (
        <InvoiceForm type={'sales'} initialData={initialData} />
    )
}

export default SalesForm
