import Form from "../../../_common/Form";
import { getAccountType } from "../../../actions";

async function Page({ params }) {
    const { id } = await params;
    const hashedID = id?.[0];

    let initialData = null;
    if (hashedID) {
        const res = await getAccountType(hashedID);
        initialData = res.data;
    }

    return <Form type="type" initialData={initialData} />;
}

export default Page
