import MyView from "../../../_common/view";


async function page({ params }) {
    const { id } = await params;

    return <MyView type={'internal-money-transfer'} id={id} />;
}

export default page;
