import { getAccountList } from "../actions";
import PaginationControls from '@/components/PaginationControls';
import QueryParamSetterInput from '@/components/QueryParamSetterInput';
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ErrorLoading from "@/components/ErrorLoading";
import ListClient from "../_common/ListClient";


async function Page({ searchParams }) {
    const searchParamName = 's';
    const params = await searchParams;
    const limit = params['limit'] ?? 12;
    const offset = params['offset'] ?? 0;
    const search = params[searchParamName] ?? '';
    const accountType = params['account_type__name'] ?? '';
    const phoneNumber = params['phone_number'] ?? '';
    const bankName = params['bank_name'] ?? '';
    const isActive = params['is_active'] ?? '';
    const t = await getTranslations();


    const res = await getAccountList(`?limit=${limit}&offset=${offset}${search ? `&account_name=${search}` : ''}${accountType ? `&account_type__name=${accountType}` : ''}${phoneNumber ? `&phone_number=${phoneNumber}` : ''}${bankName ? `&bank_name=${bankName}` : ''}${isActive ? `&is_active=${isActive}` : ''}`);

    (res?.status === 403 && res.data?.detail?.includes('jwt')) &&
        redirect(`/auth/logout?nexturl=${(await headers()).get('x-original-url') || ''}`, 'replace')

    const data = res.data

    return (
        <>
            <QueryParamSetterInput
                paramName={searchParamName}
                paramOptions={[
                    { label: t('accountVault.placeholders.searchAccountName'), value: 's' },
                    { label: t('accountVault.placeholders.searchAccountType'), value: 'account_type__name' },
                    { label: t('accountVault.fields.phoneNumber'), value: 'phone_number' },
                    { label: t('accountVault.fields.bankName'), value: 'bank_name' },
                    {
                        label: t('accountVault.fields.isActive'),
                        value: 'is_active',
                        inputType: 'select',
                        selectOptions: [
                            { label: t('accountVault.status.active'), value: 'true' },
                            { label: t('accountVault.status.inactive'), value: 'false' }
                        ]
                    }
                ]}
            />

            <ListClient
                type="account"
                initialItems={data.results}
                count={data.count}
                next={data.next}
                previous={data.previous}
            />

            {data?.count == 0 &&
                <ErrorLoading name="global.errors" err="nothing" className="w-full transform-translate-x-1/2 flex justify-center items-center bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 p-5 rounded-md mt-3" />
            }

            <PaginationControls
                resCount={data?.count}
                hasNext={data?.next}
                hasPrev={data?.previous}
            />
        </>
    )
}

export default Page
