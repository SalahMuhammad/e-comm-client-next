"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { createUpdateGroup } from "../actions";
import useGenericResponseHandler from "@/components/custom hooks/useGenericResponseHandler";
import { TextInput } from "@/components/inputs/index";
import PermissionSelector from "@/components/PermissionSelector";
import { useRouter } from "next/navigation";
import FormButton from "@/components/FormButton";

export default function GroupFormClient({ group, permissions, groups = [], onClose, onSuccess, isModal = false }) {
    const t = useTranslations("permission-management.groupForm");
    const tGlobal = useTranslations("");
    const handleGenericErrors = useGenericResponseHandler();
    const router = useRouter();

    const [name, setName] = useState(group?.name || "");
    const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
    const [selectedSourceGroupIds, setSelectedSourceGroupIds] = useState([]);
    const [isPending, setIsPending] = useState(false);
    const [errors, setErrors] = useState({});

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsPending(true);
        setErrors({});

        // Create FormData
        const formData = new FormData();
        if (group?.id) {
            formData.set('id', group.id.toString());
        }
        formData.set('name', name);

        // Combine manual and inherited permissions
        const finalPermissions = getFinalPermissions();
        finalPermissions.forEach(id => {
            formData.append('permissions', id.toString());
        });

        const result = await createUpdateGroup({}, formData);

        setIsPending(false);

        if (handleGenericErrors(result)) return;

        if (result.ok) {
            const successMsg = group?.id ? tGlobal("global.form.editSuccess") : tGlobal("global.form.createSuccess");
            toast.success(successMsg);

            if (isModal) {
                onSuccess?.(result.data, !group?.id);
            } else {
                router.push("/permission-management");
                router.refresh();
            }
        } else {
            setErrors(result.data || {});
            if (result.data?.name) {
                toast.error(result.data.name[0]);
            }
        }
    };

    const handleCancel = () => {
        if (isModal) {
            onClose();
        } else {
            router.back();
        }
    };

    const content = (
        <form onSubmit={handleSubmit} className={`flex flex-col bg-white dark:bg-gray-800 rounded-lg overflow-hidden ${isModal ? 'h-[85vh]' : 'h-full'}`}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {group?.id ? t("editTitle") : t("createTitle")}
                </h2>
                {isModal && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                )}
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                    <TextInput
                        name="name"
                        id="group-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t("namePlaceholder")}
                        error={errors.name?.[0] || ""}
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
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    {tGlobal("global.delete.cancelLabel")}
                </button>
                <FormButton
                    type="submit"
                    variant={group?.id ? "secondary" : "primary"}
                    size="md"
                    bgColor={group?.id ? "bg-emerald-500 dark:bg-emerald-600" : "bg-blue-600 dark:bg-blue-600"}
                    hoverBgColor={group?.id ? "bg-emerald-700 dark:bg-emerald-800" : "bg-blue-700 dark:bg-blue-800"}
                    textColor="text-white dark:text-gray-100"
                    className="flex-1"
                    isLoading={isPending}
                    onClick={handleSubmit}
                    disabled={!name.trim()}
                >
                    {group?.id ? tGlobal("global.form.edit") : tGlobal("global.form.submit")}
                </FormButton>
            </div>
        </form>
    );

    if (isModal) {
        return content;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sticky">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl mx-auto shadow-lg flex flex-col h-[85vh] ">
                {content}
            </div>
        </div>
    );
}
