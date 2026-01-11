import { getAccountType } from "../../../actions";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { PencilIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import DeleteButton from "../../../_common/DeleteButton";


async function Page({ params }) {
    const { id } = await params;
    const res = await getAccountType(id);
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

    const type = res.data;

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <Link
                    href="/finance/account-vault/type/list"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-2"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    {t('global.backToList')}
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mt-2">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white break-words">
                            {type.name}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            #{type.hashed_id}
                        </p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                        <Link
                            href={`/finance/account-vault/type/form/${type.hashed_id}`}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                        >
                            <PencilIcon className="h-4 w-4 mr-2" />
                            {t('global.form.edit')}
                        </Link>
                        <DeleteButton type="type" id={type.hashed_id} isViewPage={true} />
                    </div>
                </div>
            </div>

            {/* Type Details Card */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DetailItem
                        label={t('accountVault.fields.typeName')}
                        value={type.name}
                    />
                    <div></div> {/* Empty cell for grid alignment */}
                    <DetailItem
                        label={t('global.createdAt')}
                        value={new Date(type.created_at).toLocaleString()}
                    />
                    <DetailItem
                        label={t('toolTip.createdBy')}
                        value={type.created_by || '-'}
                    />
                    <DetailItem
                        label={t('global.updatedAt')}
                        value={new Date(type.updated_at).toLocaleString()}
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
