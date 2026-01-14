import TransferView from "../view-component";


async function page({ params }) {
    const { id } = await params;

    return <TransferView id={id} />;
}

export default page;
