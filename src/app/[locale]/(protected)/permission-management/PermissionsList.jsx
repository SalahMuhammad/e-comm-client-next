"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDownIcon, ChevronRightIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function PermissionsList({ permissions }) {
    const t = useTranslations("permission-management.permissions");
    const [expandedApps, setExpandedApps] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState("");

    // Group permissions by app_label
    const permissionsByApp = useMemo(() => {
        const grouped = {};
        permissions.forEach(perm => {
            const appLabel = perm.app_label || 'other';
            if (!grouped[appLabel]) {
                grouped[appLabel] = [];
            }
            grouped[appLabel].push(perm);
        });
        return grouped;
    }, [permissions]);

    // Filter permissions by search
    const filteredPermissionsByApp = useMemo(() => {
        if (!searchQuery.trim()) return permissionsByApp;

        const query = searchQuery.toLowerCase();
        const filtered = {};

        Object.entries(permissionsByApp).forEach(([appLabel, perms]) => {
            const matchingPerms = perms.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.codename.toLowerCase().includes(query) ||
                appLabel.toLowerCase().includes(query)
            );
            if (matchingPerms.length > 0) {
                filtered[appLabel] = matchingPerms;
            }
        });

        return filtered;
    }, [permissionsByApp, searchQuery]);

    const toggleAppExpand = (appLabel) => {
        const newExpanded = new Set(expandedApps);
        if (newExpanded.has(appLabel)) {
            newExpanded.delete(appLabel);
        } else {
            newExpanded.add(appLabel);
        }
        setExpandedApps(newExpanded);
    };

    const expandAll = () => {
        setExpandedApps(new Set(Object.keys(filteredPermissionsByApp)));
    };

    const collapseAll = () => {
        setExpandedApps(new Set());
    };

    const appLabels = Object.keys(filteredPermissionsByApp).sort();

    return (
        <div>
            {/* Search and controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t("searchPlaceholder")}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={expandAll}
                        className="flex-1 sm:flex-none px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center justify-center"
                    >
                        {t("expandAll")}
                    </button>
                    <button
                        onClick={collapseAll}
                        className="flex-1 sm:flex-none px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center justify-center"
                    >
                        {t("collapseAll")}
                    </button>
                </div>
            </div>

            {/* Permissions grouped by app */}
            <div className="space-y-2">
                {appLabels.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {t("noResults")}
                    </div>
                ) : (
                    appLabels.map(appLabel => {
                        const perms = filteredPermissionsByApp[appLabel];
                        const isExpanded = expandedApps.has(appLabel);

                        return (
                            <div key={appLabel} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                <div
                                    className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                    onClick={() => toggleAppExpand(appLabel)}
                                >
                                    <div className="flex items-center gap-3">
                                        {isExpanded ? (
                                            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                                        ) : (
                                            <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                                        )}
                                        <span className="font-medium text-gray-900 dark:text-white capitalize">
                                            {appLabel.replace(/_/g, ' ')}
                                        </span>
                                        <span className="text-sm text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                                            {perms.length}
                                        </span>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="bg-white dark:bg-gray-800 overflow-x-auto">
                                        <table className="w-full text-sm min-w-[600px]">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300 font-medium">
                                                        {t("table.name")}
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300 font-medium">
                                                        {t("table.codename")}
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300 font-medium">
                                                        {t("table.model")}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {perms.map(perm => (
                                                    <tr key={perm.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                        <td className="px-4 py-2 text-gray-900 dark:text-white">
                                                            {perm.name}
                                                        </td>
                                                        <td className="px-4 py-2 text-gray-600 dark:text-gray-400 font-mono text-xs">
                                                            {perm.codename}
                                                        </td>
                                                        <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                                                            {perm.model_name}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
