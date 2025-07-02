'use client';

import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { setCookie } from '@/utils/cookieHandler';

export default function ThemeToggle() {
  const baseTheme = localStorage.getItem('theme') || 'light'
  console.log("la b2a", baseTheme)
  const [theme, setTheme] = useState(baseTheme);

  // useEffect(() => {
  //   const stored = localStorage.getItem('theme');
  //   const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  //   const initialTheme = stored || (prefersDark ? 'dark' : 'light');
  //   document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  //   setTheme(initialTheme);
  // }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
    setCookie('theme', newTheme, {expires: 31536000})
    // document.cookie = `theme=${newTheme}; path=/; max-age=31536000`;
    setTheme(newTheme);
  };

  return (
    // bg-gray-200 dark:bg-gray-800
    <button
      onClick={toggleTheme}
      className="relative w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-500 hover:scale-110 shadow-md"
      aria-label="Toggle Theme"
      id='themeToggle'
    >
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${theme === 'dark' ? 'opacity-0' : 'opacity-100'}`}>
        <SunIcon className="w-6 h-6 text-yellow-500 transition-transform duration-500 rotate-0" />
      </div>
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`}>
        <MoonIcon className="w-6 h-6 text-blue-400 transition-transform duration-500 rotate-270" />
      </div>
    </button>
  );
}

