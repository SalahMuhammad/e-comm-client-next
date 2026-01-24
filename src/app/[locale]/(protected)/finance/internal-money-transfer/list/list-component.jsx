import { URLQueryParameterSetter } from '@/components/inputs/index';
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTransfers } from "../actions";
import TransferListTable from './TransferListTable';


async function TransferList({ searchParams }) {
    const params = await searchParams;
    const limit = params['limit'] ?? 12;
    const offset = params['offset'] ?? 0;
    const fromAccountName = params['from'] ?? '';
    const toAccountName = params['to'] ?? '';
    const notes = params['notes'] ?? '';
    const date = params['date'] ?? '';
    const dateRangeAfter = params['date_range_after'] ?? '';
    const dateRangeBefore = params['date_range_before'] ?? '';
    const transferType = params['transfer_type'] ?? '';
    const t = await getTranslations();

    const queryString = `?limit=${limit}&offset=${offset}${fromAccountName ? `&from_vault__account_name=${fromAccountName}` : ''}${toAccountName ? `&to_vault__account_name=${toAccountName}` : ''}${notes ? `&notes=${notes}` : ''}${date ? `&date=${date}` : ''}${dateRangeAfter ? `&date_range_after=${dateRangeAfter}` : ''}${dateRangeBefore ? `&date_range_before=${dateRangeBefore}` : ''}${transferType ? `&transfer_type=${transferType}` : ''}`;

    const res = await getTransfers(queryString);
    (res?.status === 403 && res.data?.detail?.includes('jwt')) &&
        redirect(`/auth/logout?nexturl=${(await headers()).get('x-original-url') || ''}`, 'replace')
    const data = res.data

    return (
        <>
            <URLQueryParameterSetter
                paramName={'search'}
                paramOptions={[
                    { label: t('finance.fields.fromVault'), value: 'from', inputType: 'text' },
                    { label: t('finance.fields.toVault'), value: 'to', inputType: 'text' },
                    { label: t('inputs.search.notes'), value: 'notes', inputType: 'text' },
                    { label: t('inputs.search.date'), value: 'date', inputType: 'date' },
                    {
                        label: t('finance.fields.transferType'),
                        value: 'transfer_type',
                        inputType: 'select',
                        selectOptions: [
                            { label: t('finance.transferTypes.internal'), value: 'internal' },
                            { label: t('finance.transferTypes.external'), value: 'external' },
                            { label: t('finance.transferTypes.p2p'), value: 'p2p' }
                        ]
                    }
                ]}
            />

            <TransferListTable data={data} />
        </>
    )
}

export default TransferList
