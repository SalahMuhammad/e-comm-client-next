'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';

    // Remove the current locale from the pathname
    const newPath = pathname.replace(/^\/(en|ar)/, '');

    // Navigate to the same path under the new locale
    router.replace(`/${newLocale}${newPath}`);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="relative w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-500 hover:scale-110 shadow-md"
      aria-label="Toggle Language"
      id="languageToggle"
    >
      <span   className="text-sm font-bold uppercase text-gray-800 dark:text-gray-100">
        {locale === 'en' ? 'AR' : 'EN'}
      </span>
    </button>
  );
}
