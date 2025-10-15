import List from "../../_common/list";


async function Page({ searchParams }) {
    return (
        <List searchParams={searchParams} type={'reverse-payment'}/>
    )
}

export default Page
