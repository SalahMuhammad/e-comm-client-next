import Form from "../../_common/Form";
import { getAccount } from "../../actions";

async function Page({ params }) {
    const { id } = await params;
    const hashedID = id?.[0];

    let initialData = null;
    if (hashedID) {
        const res = await getAccount(hashedID);
        initialData = res.data;
    }

    return <Form type="account" initialData={initialData} />;
}

export default Page
