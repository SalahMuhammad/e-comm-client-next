"use client";

import { useState, useEffect, useMemo, useActionState } from "react";
import { useTranslations } from "next-intl";
import { createUpdateGroup } from "../actions";
import { TextInput } from "@/components/inputs/index";
import PermissionSelector from "@/components/PermissionSelector";
import { useRouter } from "next/navigation";
import GenericFormShell from "@/components/GenericFormShell";

export default function GroupFormClient({ group, permissions, groups = [], onClose, onSuccess, isModal = false }) {
    const t = useTranslations("permission-management.groupForm");
    const tGlobal = useTranslations("");
    const router = useRouter();

    const [name, setName] = useState(group?.name || "");
    const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
    const [selectedSourceGroupIds, setSelectedSourceGroupIds] = useState([]);
    const [state, formAction, isPending] = useActionState(createUpdateGroup, {});

    // Filter available groups for inheritance (exclude self)
    const availableGroups = useMemo(() => {
        return groups.filter(g => !group || g.id !== group.id);
    }, [groups, group]);

    // Initialize form with group data
    useEffect(() => {
        if (group) {
            setName(group.name || "");
            // Note: We only populate manual permissions from the backend 'permissions' list
            // because the backend doesn't store inheritance structure.
            // All existing permissions are treated as "manual" on edit.
            setSelectedPermissionIds(group.permissions?.map(p => p.id) || []);
        }
    }, [group]);

    // Calculate final permissions for submission
    const getFinalPermissions = () => {
        const finalIds = new Set(selectedPermissionIds);

        // Add permissions from selected source groups
        selectedSourceGroupIds.forEach(groupId => {
            const sourceGroup = availableGroups.find(g => g.id === groupId);
            sourceGroup?.permissions?.forEach(p => {
                finalIds.add(p.id);
            });
        });

        return Array.from(finalIds);
    };

    return (
        <GenericFormShell
            state={state}
            formAction={formAction}
            isPending={isPending}
            obj={group}
            t={tGlobal}
            customTitle={group?.id ? t("editTitle") : t("createTitle")}
            showIdField={false}
            isModal={isModal}
            onSuccess={(data) => {
                if (isModal && onSuccess) {
                    onSuccess(data, !group?.id);
                } else {
                    router.push("/permission-management");
                    router.refresh();
                }
            }}
            redirectPath={!isModal ? "/permission-management" : undefined}
        >
            <div className="flex-1 overflow-y-auto space-y-6 p-5">
                <div>
                    <TextInput
                        name="name"
                        id="group-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t("namePlaceholder")}
                        error={!state?.ok ? state?.data?.name?.[0] : ""}
                        required
                    />
                </div>

                <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        {t("permissionsTitle")}
                    </h3>
                    <PermissionSelector
                        groups={availableGroups}
                        permissions={permissions}
                        selectedGroupIds={selectedSourceGroupIds}
                        selectedPermissionIds={selectedPermissionIds}
                        onGroupsChange={setSelectedSourceGroupIds}
                        onPermissionsChange={setSelectedPermissionIds}
                        inputNameGroups="source_groups"
                        inputNamePermissions="permissions"
                    />
                </div>

                {getFinalPermissions().map(id => (
                    <input key={`perm-${id}`} type="hidden" name="permissions" value={id} />
                ))}
            </div>
        </GenericFormShell>
    );
}
