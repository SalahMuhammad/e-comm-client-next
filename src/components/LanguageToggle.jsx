'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { routing } from '@/i18n/routing';

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const toggleLanguage = () => {
    const locales = routing.locales;

    const currentIndex = locales.indexOf(locale);
    const nextLocale = locales[(currentIndex + 1) % locales.length];

    const newPath = pathname.replace(new RegExp(`^/(${locales.join('|')})`), '');

    router.replace(`/${nextLocale}${newPath}`);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="relative w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-500 hover:scale-110 shadow-md"
      aria-label="Toggle Language"
      id="languageToggle"
    >
      <span className="text-sm font-bold uppercase text-gray-800 dark:text-gray-100">
        {locale.toUpperCase() === routing.locales[0].toUpperCase()
          ? routing.locales[1].toUpperCase()
          : routing.locales[0].toUpperCase()}
      </span>
    </button>
  );
}
