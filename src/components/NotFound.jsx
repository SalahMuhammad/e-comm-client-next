"use client";

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function EventNotFound({ eventId, customButton, name = 'Event', message }) {
  const t = useTranslations('EventNotFound');
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleCustomButton = () => {
    if (customButton?.href) {
      router.push(customButton.href);
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200/30 dark:bg-indigo-800/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/30 dark:bg-blue-800/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/20 dark:bg-purple-800/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className={`max-w-lg w-full space-y-8 text-center relative z-10 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>

        <div className="mx-auto flex items-center justify-center h-32 w-32 rounded-full bg-gradient-to-br from-orange-100 to-red-200 dark:from-orange-900/40 dark:to-red-800/40 shadow-lg dark:shadow-orange-900/20 border border-orange-200/50 dark:border-orange-800/50 animate-bounce relative">
          <XMarkIcon className="w-16 h-16 text-red-600 dark:text-red-400" />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight">
            {t('title', { name })}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
            {message || t('message', { name })}
          </p>
        </div>

        {eventId && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl dark:shadow-gray-900/30 p-6 border border-gray-200/50 dark:border-gray-700/50 transform hover:scale-[1.02] transition-transform duration-200">
            <div className="flex items-center gap-2 mb-3">
              <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('eventId', { name })}</h3>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border border-orange-200 dark:border-orange-800/50 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-sm text-orange-800 dark:text-orange-300 font-mono break-words leading-relaxed">
                {eventId}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {customButton && (
            <button
              onClick={handleCustomButton}
              className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 dark:focus:ring-indigo-400 transition-all duration-200 shadow-lg hover:shadow-xl dark:shadow-indigo-500/25 transform hover:scale-105"
            >
              {!customButton?.icon ?
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
                    d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z"
                  />
                </svg>
                : <div className='mr-3 h-5 w-5 items-center justify-center flex group-hover:translate-x-[-2px] transition-transform duration-300'>{customButton.icon}</div>
              }
              {customButton.label}
            </button>
          )}

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
            {t('back')}
          </button>
        </div>
      </div>
    </div>
  );
}