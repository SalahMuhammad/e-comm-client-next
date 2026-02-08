import { getCompanyDetails } from "@/app/actions/companyDetails";
import CompanyProviderClient from "./company-provider.client";
import { API_BASE_URL } from "@/config/api";


export default async function CompanyProvider({ children }) {
    const res = await getCompanyDetails();

    // Fallback to default values if API fails
    let companyDetails = res?.ok ? res.data : {
        name: "Company",
        logo: "/favicon.ico",
    };

    // Prepend API_BASE_URL to logo if it's a relative path (starts with /)
    if (companyDetails?.logo && companyDetails.logo.startsWith('/') && !companyDetails.logo.startsWith('//')) {
        companyDetails = {
            ...companyDetails,
            logo: `${API_BASE_URL}${companyDetails.logo}`
        };
    }

    return (
        <CompanyProviderClient companyDetails={companyDetails}>
            {children}
        </CompanyProviderClient>
    );
}
