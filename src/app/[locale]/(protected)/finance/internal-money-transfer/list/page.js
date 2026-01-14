import TransferList from "./list-component";


async function Page({ searchParams }) {
    return (
        <TransferList searchParams={searchParams} />
    )
}

export default Page
