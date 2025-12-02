import { ItemsView } from './Card'
import { getItems } from "./actions";
import PaginationControls from '@/components/PaginationControls';
import styles from "./itemsList.module.css";
import QueryParamSetterInput from '@/components/QueryParamSetterInput';
import ErrorLoading from '@/components/ErrorLoading';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

async function Items({ searchParams }) {
    const params = await searchParams;
    const limit = params['limit'] ?? 12;
    const offset = params['offset'] ?? 0;
    const type = params['type'] ?? '';
    const id = params['id'] ?? '';
    const name = params['name'] ?? '';
    const barcode = params['barcode'] ?? '';
    const place = params['place'] ?? '';
    const origin = params['origin'] ?? '';

    const res = await getItems(`
?limit=${limit}
&offset=${offset}
${type ? `&type=${type}` : ''}
${id ? `&id=${id}` : ''}
${name ? `&name=${name}` : ''}
${barcode ? `&barcode=${barcode}` : ''}
${place ? `&place=${place}` : ''}
${origin ? `&origin=${origin}` : ''}
`);
    (res?.status === 403 && res.data?.detail?.includes('jwt')) &&
                redirect(`/auth/logout?nexturl=${(await headers()).get('x-original-url') || ''}`, 'replace')
    const data = res?.data
    
    return (
        <>
            <QueryParamSetterInput
                paramOptions={[
                    { label: 'Type', value: 'type' },
                    { label: 'ID', value: 'id' },
                    { label: 'Name', value: 'name' },
                    { label: 'Barcode', value: 'barcode' },
                    { label: 'Place', value: 'place' },
                    { label: 'Origin', value: 'origin' },
                ]}
            />    
            {data.err || data?.count == 0 ? 
                data.err &&  
                    <ErrorLoading name="warehouse.items.list" message={data.err} className="w-full mt-3 transform-translate-x-1/2 flex justify-center items-center bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 p-5 rounded-md" />
                :
                <>
                    <ItemsView items={data.results} />
                    <PaginationControls
                        resCount={data.count}
                        hasNext={data.next}
                        hasPrev={data.previous}
                    />
                </>
            }
            {data.count == 0 && 
                <ErrorLoading name="warehouse.repositories.table" err="nothing" className="w-full transform-translate-x-1/2 flex justify-center items-center bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 p-5 rounded-md" />
            }
        </>
    )
}

export default Items