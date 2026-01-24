import { getDamagedItems } from "./actions";
import DamagedItemsListClient from './DamagedItemsListClient';
import PaginationControls from '@/components/PaginationControls';
import { URLQueryParameterSetter } from '@/components/inputs/index';
import ErrorLoading from '@/components/ErrorLoading';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getTranslations } from 'next-intl/server';

export default async function DamagedItems({ searchParams }) {
    const t = await getTranslations('inputs.search');
    const params = await searchParams;
    const limit = params['limit'] ?? 12;
    const offset = params['offset'] ?? 0;
    const item__name = params['item__name'] ?? '';
    const owner__name = params['owner__name'] ?? '';
    const repository__name = params['repository__name'] ?? '';
    const notes = params['notes'] ?? '';

    const queryString = `?limit=${limit}&offset=${offset}${item__name ? `&item__name=${item__name}` : ''}${owner__name ? `&owner__name=${owner__name}` : ''}${repository__name ? `&repository__name=${repository__name}` : ''}${notes ? `&notes=${notes}` : ''}`;

    const res = await getDamagedItems(queryString);

    if (res?.status === 403 && res.data?.detail?.includes('jwt')) {
        redirect(`/auth/logout?nexturl=${(await headers()).get('x-original-url') || ''}`, 'replace');
    }

    const data = res?.data;

    return (
        <>
            <URLQueryParameterSetter
                paramOptions={[
                    { label: t('itemName'), value: 'item__name' },
                    { label: t('ownerName'), value: 'owner__name' },
                    { label: t('repository'), value: 'repository__name' },
                    { label: t('notes'), value: 'notes' },
                ]}
            />
            {data?.err || data?.count == 0 ?
                data?.err &&
                <ErrorLoading name="warehouse.items.list" message={data.err} className="w-full mt-3 transform-translate-x-1/2 flex justify-center items-center bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 p-5 rounded-md" />
                :
                <>
                    <DamagedItemsListClient initialItems={data?.results || []} />
                    <PaginationControls
                        resCount={data?.count}
                        hasNext={data?.next}
                        hasPrev={data?.previous}
                    />
                </>
            }
            {data?.count == 0 &&
                <ErrorLoading name="warehouse.repositories.table" err="nothing" className="w-full transform-translate-x-1/2 flex justify-center items-center bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 p-5 rounded-md" />
            }
        </>
    )
}