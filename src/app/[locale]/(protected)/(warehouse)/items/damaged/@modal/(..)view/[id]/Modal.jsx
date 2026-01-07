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
        
        // Add keyboard escape handler
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        
        document.addEventListener('keydown', handleEscape);
        
        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);
    
    return (
        <div
            className="fixed inset-0 bg-gradient-to-br from-black/40 via-gray-900/30 to-indigo-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 lg:p-8 animate-in fade-in duration-300"
            onClick={handleBackdropClick}
        >
            {/* Modal Container */}
            <div
                className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl lg:rounded-3xl w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl border border-white/20 dark:border-gray-700/50 transition-all duration-300 ease-out animate-in slide-in-from-bottom-4 zoom-in-95"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full flex items-center justify-center shadow-lg border border-gray-200/50 dark:border-gray-600/50 transition-all duration-200 hover:shadow-xl hover:scale-105 group"
                    aria-label="Close modal"
                >
                    <svg 
                        className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 group-hover:rotate-90" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {/* Decorative Header Gradient */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600"></div>

                {/* Modal Content */}
                <div className="max-h-[95vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400/50 dark:scrollbar-thumb-gray-600/50 scrollbar-track-transparent hover:scrollbar-thumb-gray-400/70 dark:hover:scrollbar-thumb-gray-600/70">
                    {/* Content Area */}
                    <div className="p-0">
                        {children}
                    </div>
                </div>

                {/* Resize Handle (Visual Indicator) */}
                <div className="absolute bottom-4 right-4 w-4 h-4 opacity-30">
                    <div className="grid grid-cols-2 gap-1">
                        <div className="w-1 h-1 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}