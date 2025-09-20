// app/[locale]/(protected)/(warehouse)/items/list/@modal/(..)view/[id]/page.jsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Modal({ params, children }) {
    const router = useRouter();

    const handleClose = () => {
        router.back(); // Go back to the list page
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    useEffect(() => {
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-10 z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            <div
                className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Item Details - {1}</h2>
                </div> */}
                    <button
                        onClick={handleClose}
                        className="sticky top-0 right-0 text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                    >
                        ×
                    </button>

                <div className="p-1">
                    {children}
                </div>
            </div>
        </div>
    );
}
