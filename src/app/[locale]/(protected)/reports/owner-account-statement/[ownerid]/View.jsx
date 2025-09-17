import CompanyDetailsHead from "@/components/CompanyDetailsHead";
import numberFormatter from "@/utils/NumberFormatter";
import { useTranslations } from "next-intl";
import Link from "next/link";


function PageView({ data }) {
    const t = useTranslations('ownerAccountStatement')
    let remainingCredit = 0

    if (! data?.data?.list?.length) 
        return (
            <p className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" colSpan={2}>{t('noData')}</p>
        )

    return (
        <div className="p-6 space-y-6 min-w-2xl">
            <CompanyDetailsHead >
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Account statement for "{data?.data?.list?.[0]?.owner_name}"</h2>
            </CompanyDetailsHead>

            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{t('transactionSummary')}</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('table.type')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('table.count')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{t('types.salesInvoices')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{data.data.sales_invs}</td>
                            </tr>
                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{t('types.returnSalesInvoices')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{data.data.return_sales_invs}</td>
                            </tr>
                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{t('types.purchasesInvoices')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{data.data.purcahses_invs}</td>
                            </tr>
                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{t('types.payments')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{data.data.payments}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{t('creditTotals.title')}</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('table.type')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('table.amount')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {data?.data?.credit_totals && Object.entries(data.data.credit_totals).length > 0 ? (
                                Object.entries(data.data.credit_totals).map(([key, value]) => {
                                    const label = t(`creditTotals.items.${key.split(' ').join('')}`)
                                    return (
                                        <tr key={key} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{label}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{numberFormatter(value)}</td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" colSpan={2}>{t('noData')}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{t('transactions.title')}</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('transactions.fields.ref')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('transactions.fields.type')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('transactions.fields.date')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('transactions.fields.amount')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('transactions.fields.remaining')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {data?.data?.list?.map((transaction) => {
                                remainingCredit += Number(transaction?.amount ? transaction.amount : transaction.total_amount)
                                const amount = transaction?.amount ? transaction.amount : transaction.total_amount

                                return (
                                    <tr key={transaction.id + transaction.type.replaceAll(' ', '')} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 dark:border-gray-700">
                                        <DynamicRefIdLink transaction={transaction} />
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                            {transaction.type}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                            {transaction?.date ? transaction.date : transaction.issue_date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100" style={{color: amount == 0 ? 'black' : Number(amount) > 0 ? 'green' : 'red'}}>
                                            {numberFormatter(amount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                            {numberFormatter(remainingCredit)}
                                        </td>
                                    </tr>
                                )}
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}


export default PageView


const DynamicRefIdLink = ({ transaction }) => {
    let url = '#'
    
    switch (transaction.type) {
        case 'sales invoice':
            url = `/invoice/sales/view/${transaction.hashed_id}`
            break;
        case 'sales invoice refund':
            url = `/invoice/sales/refund/view/${transaction.hashed_id}`
            break;
        case 'purchase invoice':
            url = `/invoice/purchases/view/${transaction.hashed_id}`
            break;
        case 'payment':
            url = `/finance/payments/view/${transaction.hashed_id}`
            break;
    }

    return (
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            {url === '#' ? (
                transaction?.hashed_id ? `#${transaction.hashed_id}` : `#${transaction.id}`
            ) : (
                <Link className="text-blue text-blue-600 hover:underline" href={url}>
                    #{transaction?.hashed_id ? transaction.hashed_id : transaction.id}
                </Link>
            )}
        </td>
    )
}
