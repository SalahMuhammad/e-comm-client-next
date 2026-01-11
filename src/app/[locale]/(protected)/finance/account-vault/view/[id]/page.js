import { getAccount } from "../../actions";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import numberFormatter from "@/utils/NumberFormatter";
import { PencilIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import DeleteButton from "../../_common/DeleteButton";


async function Page({ params }) {
    const { id } = await params;
    const res = await getAccount(id);
    const t = await getTranslations();

    if (!res.ok) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-600 dark:text-red-400">
                    {t('global.errors.loadError')}
                </p>
            </div>
        );
    }

    const account = res.data;

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <Link
                    href="/finance/account-vault/list"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-2"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    {t('global.backToList')}
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mt-2">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white break-words">
                            {account.account_name}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            #{account.hashed_id}
                        </p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                        <Link
                            href={`/finance/account-vault/form/${account.hashed_id}`}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                        >
                            <PencilIcon className="h-4 w-4 mr-2" />
                            {t('global.form.edit')}
                        </Link>
                        <DeleteButton type="account" id={account.hashed_id} isViewPage={true} />
                    </div>
                </div>
            </div>

            {/* Account Details Card */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                {/* Balance Highlight */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-6 text-white">
                    <p className="text-sm opacity-90">{t('accountVault.fields.currentBalance')}</p>
                    <p className="text-4xl font-bold mt-1">
                        {numberFormatter(account.current_balance)}
                    </p>
                </div>

                {/* Details Grid */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DetailItem
                        label={t('accountVault.fields.accountType')}
                        value={account.account_type_name}
                    />
                    <DetailItem
                        label={t('accountVault.fields.accountNumber')}
                        value={account.account_number || '-'}
                    />
                    <DetailItem
                        label={t('accountVault.fields.phoneNumber')}
                        value={account.phone_number || '-'}
                    />
                    <DetailItem
                        label={t('accountVault.fields.bankName')}
                        value={account.bank_name || '-'}
                    />
                    <DetailItem
                        label={t('accountVault.fields.isActive')}
                        value={
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${account.is_active
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                }`}>
                                {account.is_active ? t('accountVault.status.active') : t('accountVault.status.inactive')}
                            </span>
                        }
                    />
                    <DetailItem
                        label={t('global.createdAt')}
                        value={new Date(account.created_at).toLocaleString()}
                    />
                    <DetailItem
                        label={t('toolTip.createdBy')}
                        value={account.created_by || '-'}
                    />
                    <DetailItem
                        label={t('global.updatedAt')}
                        value={new Date(account.updated_at).toLocaleString()}
                    />
                </div>
            </div>
        </div>
    );
}


function DetailItem({ label, value }) {
    return (
        <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {label}
            </dt>
            <dd className="text-base text-gray-900 dark:text-white">
                {value}
            </dd>
        </div>
    );
}

export default Page;
