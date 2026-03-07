import InvoiceForm from "../../_common/form";

export function SalesForm({ initialData }) {
    return (
        <InvoiceForm type={'purchases'} initialData={initialData} />
    )
}
