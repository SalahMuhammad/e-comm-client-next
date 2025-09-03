'use client'; // Mark as a Client Component

import { createContext, useState, useContext } from 'react';

const titleContext = createContext(undefined);

export function ThemeProvider({ children }) {
    const [title, setTitle] = useState('MedPro Corp');

    const value = { title, setTitle };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}
