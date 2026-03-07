"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";

export default function UnauthorizedPage() {
    const t = useTranslations("unauthorized");
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="max-w-md w-full text-center">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-6">
                        <ShieldExclamationIcon className="w-16 h-16 text-red-600 dark:text-red-400" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {t("title")}
                </h1>

                {/* Message */}
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {t("message")}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
                    {t("contactAdmin")}
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                    >
                        {t("goBack")}
                    </button>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        {t("goToDashboard")}
                    </button>
                </div>
            </div>
        </div>
    );
}
