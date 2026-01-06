'use client'; // Mark as a Client Component

import companyDetails from '@/constants/company';
import { createContext, useState, useContext } from 'react';

const titleContext = createContext(undefined);

export function ThemeProvider({ children }) {
    const [title, setTitle] = useState(companyDetails.name);

    const value = { title, setTitle };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}
