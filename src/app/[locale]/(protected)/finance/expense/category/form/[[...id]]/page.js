import Form from "../../_common/Form";
import { getCategory } from "../../actions";

async function Page({ params }) {
    const { id } = await params;
    const categoryId = id?.[0];

    let initialData = null;
    if (categoryId) {
        const res = await getCategory(categoryId);
        initialData = res.data;
    }

    return <Form initialData={initialData} />;
}

export default Page
