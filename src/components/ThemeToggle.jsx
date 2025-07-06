'use client';

import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { getCookie, setCookie } from '@/utils/cookieHandler';

const getPreferredTheme = () => {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

export default function ThemeToggle() {
  let baseTheme = "auto";
  try {
    // baseTheme = localStorage.getItem('theme') || 'auto';
    baseTheme = getCookie('theme') || "light"
  } catch {
    console.warn("LocalStorage/Cookies Err");
  }
  const [theme, setTheme] = useState(baseTheme);
  const [iconTheme, setIconTheme] = useState(baseTheme == 'auto' && getPreferredTheme())
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let appliedTheme = theme;
    if (theme === 'auto') {
      appliedTheme = getPreferredTheme();
    }
    document.documentElement.classList.toggle('dark', appliedTheme === 'dark');
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem("lastPreferredTheme", getPreferredTheme());
      setCookie('lastPreferredTheme', getPreferredTheme(), {expires: 31536000});
    } catch {
      console.warn("LocalStorage/Cookies Err");  
    }
      if (theme !== 'auto') return;

    const handler = (e) => {
      document.documentElement.classList.toggle('dark', e.matches);
      // setIconTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
      setIconTheme(e.matches ? "dark" : "light");

      localStorage.setItem("lastPreferredTheme", e.matches ? 'dark' : 'light');
      setCookie('lastPreferredTheme', e.matches ? 'dark' : 'light', {expires: 31536000});
    };
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const cycleTheme = () => {
    // Order: auto -> light -> dark -> auto
    const nextTheme = theme === 'auto' ? 'light' : theme === 'light' ? 'dark' : 'auto';
    localStorage.setItem('theme', nextTheme);
    setCookie('theme', nextTheme, {expires: 31536000});
    
    setTheme(nextTheme);
    setIconTheme(nextTheme === 'auto' ? getPreferredTheme() : nextTheme);
  };

  if (!mounted) {
    return (
      <button
        className="relative w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-500 shadow-md"
        aria-label="Loading Theme Toggle"
        id='themeToggle'
        disabled
      >
        <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </button>
    );
  }

  return (
    // bg-gray-200 dark:bg-gray-800
    <button
      onClick={cycleTheme}
      className="relative w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-500 hover:scale-110 shadow-md"
      aria-label="Toggle Theme"
      id='themeToggle'
      title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
    >
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${iconTheme === 'dark' ? 'opacity-0' : 'opacity-100'}`}>
        <SunIcon className="w-6 h-6 text-yellow-500 transition-transform duration-500 rotate-0" />
      </div>
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${iconTheme === 'dark' ? 'opacity-100' : 'opacity-0'}`}>
        <MoonIcon className="w-6 h-6 text-blue-400 transition-transform duration-500 rotate-270" />
      </div>
      <span className={`absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100/90 dark:bg-gray-800/90 text-[9px] text-gray-600 dark:text-gray-300 font-semibold pointer-events-none select-none transition-opacity ${theme === 'auto' ? 'opacity-100' : 'opacity-0'}`}>
        A
      </span>
    </button>
  );
}

