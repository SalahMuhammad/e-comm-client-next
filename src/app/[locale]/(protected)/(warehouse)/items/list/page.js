import Card from '@/components/warehouse/items/Card'
import { getItems } from "./actions";
import PaginationControls from '@/components/PaginationControls';
import styles from "./itemsList.module.css";
import SearchInput from '@/components/SearchInput';
import ErrorLoading from '@/components/ErrorLoading';

async function Items({ searchParams }) {
    const params = await searchParams;
    const limit = params['limit'] ?? 12;
    const offset = params['offset'] ?? 0;
    const search = params['s'] ?? '';

    const data = await getItems(`?limit=${limit}&offset=${offset}${search ? `&s=${search}` : ''}`);

    return (
        <>
            <SearchInput />
            {data === null ?
                <ErrorLoading name="warehouse.items.list" />
                :
                <>
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-2 space-y-2 mt-4">
                    {data.results.map((item) => (
                        <div key={item.id} className="break-inside-avoid">
                            <Card
                                id={item.id}
                                name={item.name}
                                origin={item.origin}
                                place={item.place}
                                p4={item.price4}
                                imgSrc={item.images[0]}
                            />
                        </div>
                    ))}
                </div>

                <PaginationControls
                    resCount={data.count}
                    hasNext={data.next}
                    hasPrev={data.previous}
                />
                </>
            }

        </>
    )
}

export default Items
