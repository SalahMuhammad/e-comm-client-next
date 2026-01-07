"use client";

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import "./[locale]/globals.css";
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import Head from 'next/head';
import companyDetails from '@/constants/company';

export default function NotFound() {
    const t = useTranslations('NotFound');
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Trigger entrance animation
        setIsVisible(true);
    }, []);

    const handleGoBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push('/');
        }
    };

    return (
        <>
        <Head>
            <title>404 Not Found | {companyDetails.name}</title>
        </Head>
        
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200/30 dark:bg-indigo-800/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/30 dark:bg-blue-800/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/20 dark:bg-purple-800/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className={`max-w-lg w-full space-y-8 text-center relative z-10 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}>

                {/* 404 Icon with enhanced styling */}
                <div className="mx-auto flex items-center justify-center h-32 w-32 rounded-full bg-gradient-to-br from-orange-100 to-red-200 dark:from-orange-900/40 dark:to-red-800/40 shadow-lg dark:shadow-orange-900/20 border border-orange-200/50 dark:border-orange-800/50 animate-bounce relative">
                    <ExclamationCircleIcon className="absolute inset-0 w-full h-full text-red-600/20 dark:text-red-400/20 p-4" />

                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 drop-shadow-sm relative z-10">
                        404
                    </div>
                </div>

                {/* 404 Title with improved typography */}
                <div className="space-y-4">
                    <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight">
                        {t("title")}
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
                        {t("message")}
                    </p>
                </div>

                {/* Enhanced URL/Path Display Card */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl dark:shadow-gray-900/30 p-6 border border-gray-200/50 dark:border-gray-700/50 transform hover:scale-[1.02] transition-transform duration-200">
                    <div className="flex items-center gap-2 mb-3">
                        <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t("url")}</h3>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border border-orange-200 dark:border-orange-800/50 rounded-xl p-4 backdrop-blur-sm">
                        <p className="text-sm text-orange-800 dark:text-orange-300 font-mono break-words leading-relaxed">
                            {typeof window !== 'undefined' ? window.location.pathname : '/unknown-path'}
                        </p>
                    </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => router.push('/')}
                        className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 dark:focus:ring-indigo-400 transition-all duration-200 shadow-lg hover:shadow-xl dark:shadow-indigo-500/25 transform hover:scale-105"
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

                    <button
                        onClick={handleGoBack}
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
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        {t("back")}
                    </button>
                </div>

                {/* Enhanced Quick Links */}
                {/* <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl p-4 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30">
                    <p className="mb-3 font-medium text-gray-700 dark:text-gray-300">Maybe you're looking for:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        <a
                            href="/about"
                            className="inline-flex items-center px-3 py-1 rounded-lg text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200 text-sm font-medium"
                        >
                            About
                        </a>
                        <a
                            href="/contact"
                            className="inline-flex items-center px-3 py-1 rounded-lg text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200 text-sm font-medium"
                        >
                            Contact
                        </a>
                        <a
                            href="/help"
                            className="inline-flex items-center px-3 py-1 rounded-lg text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200 text-sm font-medium"
                        >
                            Help
                        </a>
                    </div>
                </div> */}
            </div>
        </div>
        </>
    );
}