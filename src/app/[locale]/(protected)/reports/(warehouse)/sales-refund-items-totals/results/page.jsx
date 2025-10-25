// ...existing code...
import CompanyDetailsHead from "@/components/CompanyDetailsHead"
import { getSalesAndRefundTotals } from "../../actions"
import Link from "next/link"

export async function generateMetadata({  }) {
    return {
        title: `Item movement`,
        description: '...',
    };
}

async function page({ searchParams }) {
    const {fromdate, todate} = searchParams;
    const res = await getSalesAndRefundTotals(fromdate, todate)
    // endpoint may return array under different keys — try common ones
    const data = res?.data?.items || res?.data?.movements || res?.data || [];

    const fmt = (v) => {
        if (v === null || v === undefined || v === '') return '0.00';
        return Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    return (
        <div id="printarea" className="min-w-2xl bg-white">
            <div className="overflow-x-auto shadow-[8px_8px_8px_-10px_rgba(0,0,0,0.3)]">
                <CompanyDetailsHead>
                    <div className="mx-auto text-base text-black">
                        <h1 className={`text-xl font-bold font-serif`}>Item movement {fromdate && `from ${fromdate}`} {todate && `to ${todate}`}</h1>
                    </div>
                </CompanyDetailsHead>

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-300">
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">Item</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">Repository</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">Qty Sold</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">Qty Returned</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">Net Qty</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">Total Sold</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">Total Returned</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">Net Total</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white">
                        {Array.isArray(data) && data.length > 0 ? data.map((row) => (
                            <tr key={row.item_id ?? `${row.item_repr}-${row.repository_id}`} className={`border-b border-gray-100 odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 dark:border-gray-700`}>
                                <td className="p-4 text-sm text-gray-900">
                                    <div className="max-w-[320px] truncate">{row.item_repr}</div>
                                    <div className="text-xs text-gray-500">#{row.item_id}</div>
                                </td>

                                <td className="p-4 text-sm text-gray-900">
                                    {row.repository_id ?? '—'}
                                </td>

                                <td className="p-4 text-sm text-right font-medium text-gray-900">
                                    {fmt(row.quantity_sold)}
                                </td>

                                <td className="p-4 text-sm text-right font-medium text-gray-900">
                                    {fmt(row.quantity_returned)}
                                </td>

                                <td className="p-4 text-sm text-right font-medium text-gray-900">
                                    {fmt(row.net_quantity)}
                                </td>

                                <td className="p-4 text-sm text-right font-medium text-gray-900">
                                    {fmt(row.total_sold)}
                                </td>

                                <td className="p-4 text-sm text-right font-medium text-gray-900">
                                    {fmt(row.total_returned)}
                                </td>

                                <td className="p-4 text-sm text-right font-medium text-gray-900">
                                    {fmt(row.net_total)}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={8} className="p-6 text-center text-sm text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="text-center mt-12 text-gray-500 text-xs pb-1">
                    <p>Thank you for your business!</p>
                    <p>Generated on {new Date().toString().split(' GMT')[0]}</p>
                </div>
            </div>
        </div>
    )
}

export default page
// ...existing code...