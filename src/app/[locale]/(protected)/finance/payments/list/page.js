import List from "../../common/list";


async function Page({ searchParams }) {
    return (
        <List searchParams={searchParams} type={'payments'}/>
    )
}

export default Page
