import List from "../../common/list";


async function Page({ searchParams }) {
    return (
        <List searchParams={searchParams} type={'expenses'}/>
    )
}

export default Page
