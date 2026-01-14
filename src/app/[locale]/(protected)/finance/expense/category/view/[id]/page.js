import { getCategory } from "../../actions";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LocalizedDate from "@/components/LocalizedDate";

async function Page({ params }) {
    const { id } = await params;
    const t = await getTranslations();

    const res = await getCategory(id);

    (res?.status === 403 && res.data?.detail?.includes('jwt')) &&
        redirect(`/auth/logout?nexturl=${(await headers()).get('x-original-url') || ''}`, 'replace')

    const category = res.data;

    if (!category) {
        return <div>Category not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                    {category.name}
                </h1>

                <div className="space-y-4">
                    <div>
                        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {t('finance.expense.category.description')}
                        </h2>
                        <p className="mt-1 text-gray-900 dark:text-white">
                            {category.description || '-'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div>
                            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {t('global.createdAt')}
                            </h2>
                            <p className="mt-1 text-gray-900 dark:text-white">
                                <LocalizedDate date={category.created_at} />
                            </p>
                        </div>

                        <div>
                            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {t('global.updatedAt')}
                            </h2>
                            <p className="mt-1 text-gray-900 dark:text-white">
                                <LocalizedDate date={category.updated_at} />
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex space-x-3">
                    <a
                        href={`/finance/expense/category/form/${category.id}`}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        {t('finance.expense.category.edit')}
                    </a>
                    <a
                        href="/finance/expense/category/list"
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
                    >
                        {t('global.backToList')}
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Page;
