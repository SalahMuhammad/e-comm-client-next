"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import PermissionsList from "./PermissionsList";
import GroupsList from "./GroupsList";

export default function PermissionManagementClient({ permissions, groups, initialGroups }) {
    const t = useTranslations("permission-management");
    const [activeTab, setActiveTab] = useState("groups"); // "groups" or "permissions"
    const [groupsData, setGroupsData] = useState(groups);

    const handleGroupDeleted = (deletedId) => {
        setGroupsData(prev => prev.filter(g => g.id !== deletedId));
    };

    const handleGroupCreated = (newGroup) => {
        setGroupsData(prev => [...prev, newGroup]);
    };

    const handleGroupUpdated = (updatedGroup) => {
        setGroupsData(prev => prev.map(g => g.id === updatedGroup.id ? updatedGroup : g));
    };

    return (
        <div>
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
                <button
                    onClick={() => setActiveTab("groups")}
                    className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === "groups"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        }`}
                >
                    {t("tabs.groups")}
                    <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                        {groupsData.length}
                    </span>
                    {activeTab === "groups" && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("permissions")}
                    className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === "permissions"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        }`}
                >
                    {t("tabs.permissions")}
                    <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                        {permissions.length}
                    </span>
                    {activeTab === "permissions" && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                    )}
                </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === "groups" ? (
                    <GroupsList
                        groups={groupsData}
                        permissions={permissions}
                        onGroupDeleted={handleGroupDeleted}
                        onGroupCreated={handleGroupCreated}
                        onGroupUpdated={handleGroupUpdated}
                    />
                ) : (
                    <PermissionsList permissions={permissions} />
                )}
            </div>
        </div>
    );
}
