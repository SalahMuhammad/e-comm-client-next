import ItemView from "./ItemView";

export default async function page({ params }) {
    const id = (await params).id

    return (
        <ItemView id={id} />
    );
}