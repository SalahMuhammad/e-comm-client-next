"use client";

import { useTranslations } from 'next-intl';
import Head from 'next/head';
import { useCompany } from '@/app/providers/company-provider.client';


export default function Error({ error, reset }) {
    const t = useTranslations('Error');
    const companyDetails = useCompany();

    // Log error without using useEffect state changes
    if (typeof window !== 'undefined') {
        console.error('Error caught by error boundary:', error);
    }

    return (
        <>
            <Head>
                <title>Error | {companyDetails.name}</title>
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200/30 dark:bg-indigo-800/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/30 dark:bg-blue-800/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="max-w-lg w-full space-y-8 text-center relative z-10 animate-[fadeIn_0.5s_ease-out]">
                    {/* Error Icon with enhanced styling */}
                    <div className="mx-auto flex items-center justify-center h-28 w-28 rounded-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 shadow-lg dark:shadow-red-900/20 border border-red-200/50 dark:border-red-800/50 animate-bounce">
                        <svg
                            className="h-14 w-14 text-red-600 dark:text-red-400 drop-shadow-sm"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>

                    {/* Error Title with improved typography */}
                    <div className="space-y-4">
                        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight">
                            {t("title")}
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
                            {t("message")}
                        </p>
                    </div>

                    {/* Enhanced Error Details Card */}
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl dark:shadow-gray-900/30 p-6 border border-gray-200/50 dark:border-gray-700/50 transform hover:scale-[1.02] transition-transform duration-200">
                        <div className="flex items-center gap-2 mb-3">
                            <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t("errorDetails")}</h3>
                        </div>
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border border-red-200 dark:border-red-800/50 rounded-xl p-4 backdrop-blur-sm">
                            <p className="text-sm text-red-800 dark:text-red-300 font-mono break-words leading-relaxed">
                                {error?.message || 'An unexpected error occurred'}
                            </p>
                        </div>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => reset()}
                            className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 dark:focus:ring-indigo-400 transition-all duration-200 shadow-lg hover:shadow-xl dark:shadow-indigo-500/25 transform hover:scale-105"
                        >
                            <svg
                                className="mr-3 h-5 w-5 group-hover:rotate-180 transition-transform duration-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            {t("retry")}
                        </button>

                        <button
                            onClick={() => window.location.href = '/'}
                            className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 hover:bg-gray-50/90 dark:hover:bg-gray-600/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 dark:focus:ring-indigo-400 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                            <svg
                                className="mr-3 h-5 w-5 group-hover:translate-x-[-2px] transition-transform duration-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            {t("home")}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}