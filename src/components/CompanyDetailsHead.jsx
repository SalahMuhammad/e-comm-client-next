import { getCompanyDetails } from "@/app/actions/companyDetails"


async function CompanyDetailsHead({ children }) {
    const companyDetails = (await getCompanyDetails()).data

    
    return (
        <div className="grid grid-cols-3 items-center mb-2 pb-1 border-b border-gray-400 overflow-x-auto">
            <div>
                <h1 className="text-2xl font-bold text-gray-700 font-mono">{companyDetails?.name}</h1>
                <p className="text-xs text-gray-500 font-serif">{companyDetails?.description}</p>
                <div className="leading-tight text-xs text-gray-500 font-serif">
                    <p>{companyDetails?.address}</p>
                </div>
                <div className="leading-tight text-xs text-gray-500 font-serif">
                    <p>{companyDetails?.website}</p>
                </div>
                <p className="leading-tight text-xs text-gray-500 pl-4 font-serif">{companyDetails?.contact?.phone}</p>
                <div className="leading-tight text-xs text-gray-500 pl-4 font-serif">
                    {companyDetails?.contact?.mobiles?.map((num) => (
                        <p key={num}>{num}</p>
                    ))}
                </div>
                <div className="leading-tight text-xs text-gray-500 pl-4 font-serif">
                    {companyDetails?.contact?.emails?.map((email) => (
                        <p key={email}>{email}</p>
                    ))}
                </div>
            </div>
            <div className="flex-shrink-0 mx-auto">
                <img
                    src={`${process.env.API_URL}/media/logo/01.jpeg`}
                    alt="Med Pro Corp Logo"
                    className="h-20 object-contain rounded-lg"
                />
            </div>
            {children}
        </div>
    )
}

export default CompanyDetailsHead
