import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import "./[locale]/globals.css";
import { getLocale } from 'next-intl/server';
import 'flowbite'
import { getServerCookie } from "@/utils/serverCookieHandelr";
import { getCompanyDetails } from "@/app/actions/companyDetails";
import CompanyProvider from "@/app/providers/company-provider";
import { API_BASE_URL } from "@/config/api";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ibmPlexArabic = localFont({
  src: [
    {
      path: "../fonts/IBMPlexSansArabic-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/IBMPlexSansArabic-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/IBMPlexSansArabic-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-arabic",
  display: "swap",
});

export async function generateMetadata() {
  try {
    const res = await getCompanyDetails();
    const companyDetails = res?.ok ? res.data : null;

    // Prepend API_BASE_URL to logo if it's a relative path
    let logoUrl = companyDetails?.logo || "/favicon.ico";
    if (logoUrl.startsWith('/') && !logoUrl.startsWith('//')) {
      logoUrl = `${API_BASE_URL}${logoUrl}`;
    }

    return {
      title: {
        template: `%s | ${companyDetails?.name || "Company"}`,
        default: companyDetails?.name || "Company",
      },
      icons: {
        icon: logoUrl,
      },
    };
  } catch (error) {
    console.error("Failed to load company metadata:", error);
    return {
      title: {
        template: "%s | Company",
        default: "Company",
      },
      icons: {
        icon: "/favicon.ico",
      },
    };
  }
}


function getDirection(locale) {
  // Force Arabic to RTL
  if (locale === "ar") {
    return "rtl";
  }
  // Default for other languages
  return "ltr";
}

export default async function RootLayout({ children, params }) {
  const locale = await getLocale();
  const lang = locale ?? 'en';

  const theme = await getServerCookie('theme') || 'light'
  // if (!hasLocale(routing.locales, locale)) {
  //   notFound();
  // }

  let themeClass = ""
  if (theme == "auto") {
    let PreferredTheme = await getServerCookie("lastPreferredTheme");
    if (PreferredTheme == "dark") {
      themeClass = "dark"
    }
  } else if (theme == "dark") {
    themeClass = "dark"
  }

  return (
    <html
      lang={lang}
      // dir={getDirection(lang)}
      className={`${themeClass}`}
    >
      <head>
        {/* <script type="module" src="/theme-init.js" /> */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${ibmPlexArabic.variable} antialiased`}>
        <CompanyProvider>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </CompanyProvider>
      </body>
    </html>
  );
}