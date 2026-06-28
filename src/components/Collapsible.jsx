"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDownIcon } from "@heroicons/react/24/outline";


function MyCollapsible({ children }) {
    const [open, setOpen] = useState(false);
    const t = useTranslations("warehouse.items.form.collapsible");


    return (
        <Collapsible.Root open={open} onOpenChange={setOpen} className="mb-3">
            <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold text-gray-800 dark:text-white">{t("prices")}</span>
                <Collapsible.Trigger asChild>
                    <button
                        type="button"
                        className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                        aria-label="Toggle Price Inputs"
                    >
                        {open ? t("hide") : t("show")} {t("inputs")}
                        <ChevronDownIcon
                            className={`w-5 h-5 transform transition-transform ${open ? "rotate-180" : "rotate-0"
                                }`}
                        />
                    </button>
                </Collapsible.Trigger>
            </div>

            <Collapsible.Content
                className="grid md:grid-cols-2 md:gap-2 mt-5 mb-1  transition-all duration-300 ease-in-out data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp"
            >
                {children}
            </Collapsible.Content>
        </Collapsible.Root>
    )
}

export default MyCollapsible
