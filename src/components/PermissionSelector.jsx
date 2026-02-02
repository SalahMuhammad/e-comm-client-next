"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ChevronDownIcon, ChevronRightIcon, CheckIcon } from "@heroicons/react/24/outline";
import { toast } from 'sonner';

/**
 * PermissionSelector - Reusable component for selecting groups and permissions
 * 
 * Features:
 * - Select groups (expands to show individual permissions)
 * - Select individual permissions
 * - When a group is selected, its permissions are highlighted
 * - Permissions grouped by app_label
 * 
 * @param {Object} props
 * @param {Array} props.groups - Available groups
 * @param {Array} props.permissions - Available permissions
 * @param {Array} props.selectedGroupIds - Currently selected group IDs
 * @param {Array} props.selectedPermissionIds - Currently selected permission IDs
 * @param {Function} props.onGroupsChange - Callback when groups change
 * @param {Function} props.onPermissionsChange - Callback when permissions change
 * @param {string} props.inputNameGroups - Form input name for groups
 * @param {string} props.inputNamePermissions - Form input name for permissions
 */
function PermissionSelector({
    groups = [],
    permissions = [],
    selectedGroupIds = [],
    selectedPermissionIds = [],
    onGroupsChange,
    onPermissionsChange,
    inputNameGroups = "groups",
    inputNamePermissions = "permissions"
}) {
    const t = useTranslations("permission-management.selector");

    // Track which app_labels are expanded
    const [expandedApps, setExpandedApps] = useState(new Set());
    const [selectionMode, setSelectionMode] = useState("combined"); // "groups", "manual", "combined"

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

    // Get all permission IDs that come from selected groups
    const groupPermissionIds = useMemo(() => {
        const ids = new Set();
        groups.forEach(group => {
            if (selectedGroupIds.includes(group.id)) {
                group.permissions?.forEach(perm => {
                    ids.add(perm.id);
                });
            }
        });
        return ids;
    }, [groups, selectedGroupIds]);

    // Toggle group selection - expands group permissions to manual list
    const toggleGroup = (groupId) => {
        const group = groups.find(g => g.id === groupId);
        if (!group) return;

        const isUnselecting = selectedGroupIds.includes(groupId);

        const newSelectedGroups = isUnselecting
            ? selectedGroupIds.filter(id => id !== groupId)
            : [...selectedGroupIds, groupId];

        onGroupsChange(newSelectedGroups);

        if (isUnselecting) {
            // When removing a group, remove its permissions from the manual list
            // UNLESS they are provided by other selected groups
            const otherSelectedGroups = groups.filter(g =>
                newSelectedGroups.includes(g.id) && g.id !== group.id
            );

            // Get IDs of permissions provided by OTHER groups
            const otherGroupPermissionIds = new Set();
            otherSelectedGroups.forEach(g => {
                g.permissions?.forEach(p => otherGroupPermissionIds.add(p.id));
            });

            // Filter out permissions that belong to the removed group AND are not in other groups
            const newPermissionIds = selectedPermissionIds.filter(permId => {
                const isInDataRemovedGroup = group.permissions?.some(p => p.id === permId);
                const isInOtherGroups = otherGroupPermissionIds.has(permId);

                // Keep if:
                // 1. It was NOT in the removed group (unrelated permission)
                // 2. OR it IS in other selected groups (still covered)
                return !isInDataRemovedGroup || isInOtherGroups;
            });

            onPermissionsChange(newPermissionIds);
            // toast.warning(t("groupRemovedWarning", { groupNames: group.name }));
        } else if (group.permissions) {
            // When adding a group, add its permissions to the manual list
            const newPermissionIds = new Set(selectedPermissionIds);
            group.permissions.forEach(perm => {
                newPermissionIds.add(perm.id);
            });
            onPermissionsChange([...newPermissionIds]);
        }
    };

    // Toggle individual permission
    const togglePermission = (permId) => {
        const isSelected = selectedPermissionIds.includes(permId);

        if (isSelected) {
            // Unselecting
            // Find selected groups that actually contain this permission
            // Use loose equality (==) for IDs to handle potential string/number mismatches
            const groupsAffected = groups.filter(g =>
                selectedGroupIds.includes(g.id) &&
                g.permissions?.some(p => p.id == permId)
            );

            if (groupsAffected.length > 0) {
                // Remove only the affected groups
                const groupsToRemoveIds = groupsAffected.map(g => g.id);
                // Keep groups that are NOT in the removal list
                const remainingGroups = selectedGroupIds.filter(id => !groupsToRemoveIds.includes(id));
                const groupNames = groupsAffected.map(g => g.name).join(", ");

                // Collect permissions from removed groups to keep manually
                const permissionsToKeep = new Set(selectedPermissionIds);

                // Add all permissions from affected groups
                groupsAffected.forEach(g => {
                    g.permissions?.forEach(p => permissionsToKeep.add(p.id));
                });

                // Remove the current one we are unselecting
                permissionsToKeep.delete(permId);

                // Update state
                onGroupsChange(remainingGroups);
                onPermissionsChange([...permissionsToKeep]);

                // Notify with specific group names
                toast.warning(t("groupRemovedWarning", { groupNames }));
                return;
            }
        }

        const newPermissions = isSelected
            ? selectedPermissionIds.filter(id => id !== permId)
            : [...selectedPermissionIds, permId];

        onPermissionsChange(newPermissions);
    };

    // Toggle all permissions in an app
    const toggleAppPermissions = (appLabel) => {
        const appPermIds = permissionsByApp[appLabel]?.map(p => p.id) || [];
        const allSelected = appPermIds.every(id => selectedPermissionIds.includes(id));

        if (allSelected) {
            // Unselecting the entire app
            // Check for affected groups
            const groupsAffected = groups.filter(g =>
                selectedGroupIds.includes(g.id) &&
                g.permissions?.some(p => appPermIds.some(aid => aid == p.id))
            );

            if (groupsAffected.length > 0) {
                // Break these groups
                const groupsToRemoveIds = groupsAffected.map(g => g.id);
                const remainingGroups = selectedGroupIds.filter(id => !groupsToRemoveIds.includes(id));
                const groupNames = groupsAffected.map(g => g.name).join(", ");

                // Re-calculate manual permissions
                const permissionsToKeep = new Set(selectedPermissionIds);

                // Add all permissions from affected groups (to keep ones from other apps)
                groupsAffected.forEach(g => {
                    g.permissions?.forEach(p => permissionsToKeep.add(p.id));
                });

                // Remove the permissions of the current App
                appPermIds.forEach(id => permissionsToKeep.delete(id));

                onGroupsChange(remainingGroups);
                onPermissionsChange([...permissionsToKeep]);

                toast.warning(t("groupRemovedWarning", { groupNames }));
                return;
            }

            // Remove all app permissions
            onPermissionsChange(selectedPermissionIds.filter(id => !appPermIds.includes(id)));
        } else {
            // Add all app permissions
            const newPermissions = new Set(selectedPermissionIds);
            appPermIds.forEach(id => newPermissions.add(id));
            onPermissionsChange([...newPermissions]);
        }
    };

    // Toggle expand/collapse for app
    const toggleAppExpand = (appLabel) => {
        const newExpanded = new Set(expandedApps);
        if (newExpanded.has(appLabel)) {
            newExpanded.delete(appLabel);
        } else {
            newExpanded.add(appLabel);
        }
        setExpandedApps(newExpanded);
    };

    // Select all permissions
    const selectAll = () => {
        onPermissionsChange(permissions.map(p => p.id));
    };

    // Clear all selections
    const clearAll = () => {
        onGroupsChange([]);
        onPermissionsChange([]);
    };

    const appLabels = Object.keys(permissionsByApp).sort();

    return (
        <div className="space-y-4">
            {/* Mode selector */}
            <div className="flex gap-2 mb-4">
                <button
                    type="button"
                    onClick={() => {
                        setSelectionMode("groups");
                        onPermissionsChange([]); // Clear manual permissions
                    }}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${selectionMode === "groups"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                >
                    {t("modeGroups")}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setSelectionMode("manual");
                        onGroupsChange([]); // Clear groups
                    }}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${selectionMode === "manual"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                >
                    {t("modeManual")}
                </button>
                <button
                    type="button"
                    onClick={() => setSelectionMode("combined")}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${selectionMode === "combined"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                >
                    {t("modeCombined")}
                </button>
            </div>

            {/* Groups Section */}
            {(selectionMode === "groups" || selectionMode === "combined") && groups.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        {t("groupsTitle")}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {groups.map(group => (
                            <button
                                key={group.id}
                                type="button"
                                onClick={() => toggleGroup(group.id)}
                                className={`px-3 py-1.5 text-sm rounded-lg transition-all flex items-center gap-1 ${selectedGroupIds.includes(group.id)
                                    ? "bg-blue-600 text-white"
                                    : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-500"
                                    }`}
                            >
                                {selectedGroupIds.includes(group.id) && (
                                    <CheckIcon className="h-3 w-3" />
                                )}
                                {group.name}
                                <span className="text-xs opacity-70">({group.permission_count || group.permissions?.length || 0})</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Permissions Section */}
            {(selectionMode === "manual" || selectionMode === "combined") && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t("permissionsTitle")}
                            <span className="ml-2 text-xs text-gray-500">
                                ({selectedPermissionIds.length} {t("selected")})
                            </span>
                        </h3>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={selectAll}
                                className="text-xs text-blue-600 hover:text-blue-700"
                            >
                                {t("selectAll")}
                            </button>
                            <button
                                type="button"
                                onClick={clearAll}
                                className="text-xs text-red-600 hover:text-red-700"
                            >
                                {t("clearAll")}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {appLabels.map(appLabel => {
                            const appPerms = permissionsByApp[appLabel];
                            const isExpanded = expandedApps.has(appLabel);
                            const selectedCount = appPerms.filter(p => selectedPermissionIds.includes(p.id)).length;
                            const allSelected = selectedCount === appPerms.length;

                            return (
                                <div key={appLabel} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                                    <div
                                        className="flex items-center justify-between px-3 py-2 bg-white dark:bg-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-500"
                                        onClick={() => toggleAppExpand(appLabel)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {isExpanded ? (
                                                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                                            ) : (
                                                <ChevronRightIcon className="h-4 w-4 text-gray-500" />
                                            )}
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 capitalize">
                                                {appLabel.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                ({selectedCount}/{appPerms.length})
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleAppPermissions(appLabel);
                                            }}
                                            className={`text-xs px-2 py-0.5 rounded ${allSelected
                                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                                                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                                }`}
                                        >
                                            {allSelected ? t("unselectApp") : t("selectApp")}
                                        </button>
                                    </div>

                                    {isExpanded && (
                                        <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 grid grid-cols-1 md:grid-cols-2 gap-1">
                                            {appPerms.map(perm => {
                                                const isFromGroup = groupPermissionIds.has(perm.id);
                                                const isSelected = selectedPermissionIds.includes(perm.id);

                                                return (
                                                    <label
                                                        key={perm.id}
                                                        className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${isFromGroup
                                                            ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
                                                            : "hover:bg-gray-100 dark:hover:bg-gray-600"
                                                            }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => togglePermission(perm.id)}
                                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <span className="text-sm text-gray-700 dark:text-gray-200 block truncate">
                                                                {perm.name}
                                                            </span>
                                                            <span className="text-xs text-gray-500 block truncate">
                                                                {perm.codename}
                                                            </span>
                                                        </div>
                                                        {isFromGroup && (
                                                            <span className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-1.5 py-0.5 rounded">
                                                                {t("fromGroup")}
                                                            </span>
                                                        )}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Hidden form inputs */}
            {selectedGroupIds.map(id => (
                <input key={`group-${id}`} type="hidden" name={inputNameGroups} value={id} />
            ))}
            {selectedPermissionIds.map(id => (
                <input key={`perm-${id}`} type="hidden" name={inputNamePermissions} value={id} />
            ))}
        </div>
    );
}

export default PermissionSelector;
