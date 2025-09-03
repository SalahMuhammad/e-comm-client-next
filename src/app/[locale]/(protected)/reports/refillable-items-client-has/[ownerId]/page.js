import CompanyDetailsHead from "@/components/CompanyDetailsHead"
import { getRefillableItemsClientHas } from "../../actions"
import { formatDate } from "@/utils/dateFormatter"

export async function generateMetadata({ params }) {
    const ownerId = (await params).ownerId
    const res = await getRefillableItemsClientHas(ownerId)
    const data = res.data

    return {
        title: `Due DCD Cans Log From ${data?.owner_name} - ${formatDate(new Date())}`,
        description: '...',
    };
}


async function page({ params }) {
    const ownerId = (await params).ownerId
    const res = await getRefillableItemsClientHas(ownerId)
    const data = res?.data

    return (
        <div id="printarea" className="min-w-2xl bg-white">
            <div className="overflow-x-auto shadow-[8px_8px_8px_-5px_rgba(0,0,0,0.3)]">
                <CompanyDetailsHead>
                    <div className="mx-auto text-base text-black">
                        <h1 className={`text-xl font-bold font-serif`}>Due DCD Cans Log From "<strong>{data?.owner_name}</strong>".</h1>
                    </div>
                </CompanyDetailsHead>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-300">
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">DATE</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">QTY</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">DESCRIPTION</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">REMAINING</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {data?.results?.map((item, index) => (
                            <tr key={index} className={`border-b border-gray-100 odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 dark:border-gray-700`}>
                                <td className="py-4 px-4 text-sm text-gray-900">{item.date}</td>
                                <td className="py-4 px-4 text-sm">
                                    <span className={`font-medium ${item.qty < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {item.qty > 0 ? '+' : ''}{item.qty}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-900">{item.description}</td>
                                <td className="py-4 px-4 text-sm font-medium text-gray-900">{item.remaining}</td>
                            </tr>
                        ))}
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
