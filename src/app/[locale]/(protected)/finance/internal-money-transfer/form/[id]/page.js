import TransferForm from "../page";
import { getTransfer } from "../../actions";


async function page({ params }) {
    const { id } = await params;
    const res = await getTransfer(id);

    if (!res.ok) {
        return (
            <div>
                <h1>Error loading transfer</h1>
                <p>{res.data?.detail || 'Transfer not found'}</p>
            </div>
        );
    }

    return <TransferForm initialData={res.data} />;
}

export default page;
