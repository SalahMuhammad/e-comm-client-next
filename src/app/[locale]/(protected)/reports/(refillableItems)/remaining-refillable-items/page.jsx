import CompanyDetailsHead from "@/components/CompanyDetailsHead"
import { InlineLinkIcon } from "@/components/MyLink";
import { httpRequest } from "@/utils/HTTPMethods";
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'refillableItems.AllRemainingCansOutside' });
    
    return {
        title: t('title'),
        description: t('description'),
    };
}

async function page({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'refillableItems.AllRemainingCansOutside' });

    const res = await httpRequest('api/refillable-sys/refillable-items-owners-has/')
    const data = res?.data?.data || []

    if (data.length === 0) return t('noDataFound')

    const cylinderTypes = [
        "DCD Can v1 (Empty)",
        "DCD Can v2 (Empty)",
        "DCD Can v3 (Empty)",
        "Clarity DCD Can (Empty)"
    ]

    const totals = cylinderTypes.reduce((acc, type) => {
        acc[type] = data.reduce((sum, curr) => sum + Number(curr.cylinders?.[type] || 0), 0)
        return acc
    }, {})

    return (
        <div id="printarea" className="min-w-2xl bg-white">
            <div className="overflow-x-auto shadow-[8px_8px_8px_-5px_rgba(0,0,0,0.3)]">
                <CompanyDetailsHead>
                    <div className="mx-auto text-base text-black">
                        <h1 className="text-xl font-bold font-serif">{t('title')}</h1>
                    </div>
                </CompanyDetailsHead>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-300">
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">{t('owner')}</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">DCD Can v1</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">DCD Can v2</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">DCD Can v3</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">Clarity DCD Can</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {data?.map((row, index) => (
                            <tr key={index} className="border-b border-gray-100 odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 dark:border-gray-700">
                                <td className="p-4 text-sm font-medium text-gray-900">
                                    <InlineLinkIcon href={`/customer-supplier/view/${row.id}`}> 
                                        {row.owner}
                                    </InlineLinkIcon>
                                </td>
                                <td className="p-4 text-sm text-gray-900">
                                    {row.cylinders["DCD Can v1 (Empty)"] || 0}
                                </td>
                                <td className="p-4 text-sm text-gray-900">
                                    {row.cylinders["DCD Can v2 (Empty)"] || 0}
                                </td>
                                <td className="p-4 text-sm text-gray-900">
                                    {row.cylinders["DCD Can v3 (Empty)"] || 0}
                                </td>
                                <td className="p-4 text-sm text-gray-900">
                                    {row.cylinders["Clarity DCD Can (Empty)"] || 0}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="grid grid-cols-2 gap-4 pt-8 p-4">
                    <div>
                        <h1 className="font-bold text-gray-800 mb-2">{t('cylindersTotals')}</h1>
                        {Object.entries(totals).map(([type, total], index) => (
                            <p key={index} className="text-sm text-gray-700">{type}: <span className="font-medium">{total}</span></p>
                        ))}
                    </div>
                </div>

                <div className="text-center mt-12 text-gray-500 text-xs pb-1">
                    <p>{t('thankYou')}</p>
                    <p>{t('generatedOn', { date: new Date().toString().split(' GMT')[0] })}</p>
                </div>
            </div>
        </div>
    )
}

export default page