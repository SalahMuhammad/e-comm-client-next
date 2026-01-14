import { getList } from "./actions";
import QueryParamSetterInput from '@/components/QueryParamSetterInput';
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import PaymentListTable from "./PaymentListTable";


async function List({ searchParams, type }) {
    const searchParamName = 's';
    const params = await searchParams;
    const limit = params['limit'] ?? 12;
    const offset = params['offset'] ?? 0;
    const search = params[searchParamName] ?? '';
    const paymen_no = params['no'] ?? '';
    const notes = params['notes'] ?? '';
    const date = params['date'] ?? '';
    const date_range_after = params['date_range_after'] ?? '';
    const date_range_before = params['date_range_before'] ?? '';
    const status = params['status'] ?? '';
    const business_account__account_name = params['business_account__account_name'] ?? '';
    const t = await getTranslations();


    const res = (await getList(`${type}`, `?limit=${limit}&offset=${offset}${search ? `&owner=${search}` : ''}${paymen_no ? `&no=${paymen_no}` : ''}${notes ? `&notes=${notes}` : ''}${date ? `&date=${date}` : ''}${date_range_after ? `&date_range_after=${date_range_after}` : ''}${date_range_before ? `&date_range_before=${date_range_before}` : ''}${status ? `&status=${status}` : ''}${business_account__account_name ? `&business_account__account_name=${business_account__account_name}` : ''}`));
    (res?.status === 403 && res.data?.detail?.includes('jwt')) &&
        redirect(`/auth/logout?nexturl=${(await headers()).get('x-original-url') || ''}`, 'replace')
    const data = res.data

    return (
        <>
            <QueryParamSetterInput
                paramName={searchParamName}
                paramOptions={[
                    { label: t('inputs.search.ownerName'), value: 's' },
                    { label: t('inputs.search.paymentNumber'), value: 'no' },
                    { label: t('inputs.search.notes'), value: 'notes' },
                    { label: t('inputs.search.date'), value: 'date', inputType: 'date' },
                    // { label: t('inputs.search.fromDate'), value: 'date_range_after', inputType: 'date' },
                    // { label: t('inputs.search.toDate'), value: 'date_range_before', inputType: 'date' },
                    {
                        label: t('finance.fields.status'),
                        value: 'status',
                        inputType: 'select',
                        selectOptions: [
                            { label: t('finance.statusOptions.pending'), value: '1' },
                            { label: t('finance.statusOptions.confirmed'), value: '2' },
                            { label: t('finance.statusOptions.rejected'), value: '3' },
                            { label: t('finance.statusOptions.reimbursed'), value: '4' }
                        ]
                    },
                    { label: t('inputs.search.accountName'), value: 'business_account__account_name' }
                ]}
            />

            <PaymentListTable data={data} type={type} />
        </>
    )
}

export default List
