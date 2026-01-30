'use client';

import { createContext, useContext } from 'react';

const CompanyContext = createContext(null);

export function useCompany() {
    const context = useContext(CompanyContext);
    if (!context) {
        throw new Error('useCompany must be used within a CompanyProvider');
    }
    return context;
}

export default function CompanyProviderClient({ companyDetails, children }) {
    return (
        <CompanyContext.Provider value={companyDetails}>
            {children}
        </CompanyContext.Provider>
    );
}
