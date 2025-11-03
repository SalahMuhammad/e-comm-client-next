import CompanyDetailsHead from "@/components/CompanyDetailsHead"
import { getOwnersCreditList } from "../actions"
import numberFormatter from "@/utils/NumberFormatter"

export async function generateMetadata({ params }) {
    return {
        title: `owners's credit balance list - ${new Date().toString().split(' GMT')[0]}`,
        description: '...',
    };
}

async function page() {
    const res = await getOwnersCreditList()
    const data = res?.data?.list || []

    if (data.length === 0) return 'no data found'

    return (
        <div id="printarea" className="min-w-2xl bg-white">
            <div className="overflow-x-auto shadow-[8px_8px_8px_-5px_rgba(0,0,0,0.3)]">
                <CompanyDetailsHead>
                    <div className="mx-auto text-base text-black">
                        <h1 className={`text-xl font-bold font-serif`}>Owners credit balance list - {new Date().toString().split(' GMT')[0]}</h1>
                    </div>
                </CompanyDetailsHead>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-300">
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">Owner</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {data?.map((ownerObject, index) => (
                            <tr key={index} className={`border-b border-gray-100 odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 dark:border-gray-700`}>
                                <td className="p-4 w-[20rem] max-w-[20rem] text-sm w-sm w-sm text-gray-900">
                                    {ownerObject.name}
                                </td>
                                <td className="p-4 text-sm w-sm" style={{color: Number(ownerObject.amount) > 0 ? 'green' : 'red'}}>
                                    {numberFormatter(ownerObject.amount)}
                                </td>
                                {/* <td className="p-4 text-sm w-sm text-gray-900">
                                    {transaction.payment_type}
                                </td>
                                <td className="p-4 text-sm w-sm font-medium text-gray-900">
                                    {transaction.amount}
                                </td>
                                <td className="p-4 text-sm whitespace-pre font-medium text-gray-900">
                                    {transaction.note}
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <p className="pt-2">Total: {numberFormatter(data.reduce((acc, curr) => acc+=Number(curr.amount), 0))}</p>

                <div className="text-center mt-12 text-gray-500 text-xs pb-1">
                    <p>Thank you for your business!</p>
                    <p>Generated on {new Date().toString().split(' GMT')[0]}</p>
                </div>
            </div>
        </div>
    )
}

export default page
