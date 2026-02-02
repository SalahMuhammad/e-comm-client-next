"use client";

import Form from "next/form";
import { createUpdateUser } from "../actions";
import { createUpdateGroup } from "../../permission-management/actions";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState, useMemo } from "react";
import { toast } from 'sonner';
import { useRouter } from "next/navigation";
import FormButton from "@/components/FormButton";
import { TextInput, ToggleInput } from "@/components/inputs/index";
import useGenericResponseHandler from "@/components/custom hooks/useGenericResponseHandler";
import PermissionSelector from "@/components/PermissionSelector";
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
// import UserAvatar from "@/components/UserAvatar"; // UserAvatar is used inside AvatarUpload
// import { useRef } from "react";
import { AvatarUpload } from "@/components/inputs";

function UserForm({ user, groups = [], permissions = [] }) {
    const t = useTranslations("user-management.form");
    const tGlobal = useTranslations("");
    const [state, formAction, isPending] = useActionState(createUpdateUser, { errors: {} });
    const router = useRouter();
    const handleGenericErrors = useGenericResponseHandler();

    // Track selected groups and permissions
    const [localGroups, setLocalGroups] = useState(groups);
    const [selectedGroupIds, setSelectedGroupIds] = useState([]);
    const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
    const [isActive, setIsActive] = useState(true);
    const [isStaff, setIsStaff] = useState(false);
    const [isSuperuser, setIsSuperuser] = useState(false);

    // State for "Save as Group" modal
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [savingGroup, setSavingGroup] = useState(false);

    // State for Profile Details
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Update local groups when props change
    useEffect(() => {
        setLocalGroups(groups);
    }, [groups]);

    // Initialize from user data
    useEffect(() => {
        if (user) {
            setIsActive(user.is_active ?? true);
            setIsStaff(user.is_staff ?? false);
            setIsSuperuser(user.is_superuser ?? false);
            setSelectedGroupIds(user.groups?.map(g => g.id) || []);
            setSelectedPermissionIds(user.user_permissions?.map(p => p.id) || []);
        }
    }, [user]);

    useEffect(() => {
        if (!state?.status) return;
        if (handleGenericErrors(state)) return;

        if (state.ok) {
            if (user?.id) {
                toast.success(tGlobal("global.form.editSuccess"));
            } else {
                toast.success(tGlobal("global.form.createSuccess"));
            }
            router.replace("/user-management/list/");
        }
    }, [state]);

    // Handle "Save as Group" functionality
    const handleSaveAsGroup = async () => {
        if (!newGroupName.trim()) {
            toast.error(t("saveAsGroup.nameRequired"));
            return;
        }

        if (selectedPermissionIds.length === 0) {
            toast.error(t("saveAsGroup.noPermissions"));
            return;
        }

        setSavingGroup(true);

        // Create FormData for the group
        const formData = new FormData();
        formData.set('name', newGroupName);
        selectedPermissionIds.forEach(id => {
            formData.append('permissions', id.toString());
        });

        const result = await createUpdateGroup({}, formData);

        setSavingGroup(false);

        if (result.ok) {
            toast.success(t("saveAsGroup.success"));

            // Add the new group to local groups list
            // The result.data contains the created group object
            if (result.data) {
                const newGroup = result.data;

                // To be safe, if permissions are just IDs, map them.
                if (newGroup.permissions && newGroup.permissions.length > 0 && typeof newGroup.permissions[0] === 'number') {
                    newGroup.permissions = permissions.filter(p => newGroup.permissions.includes(p.id));
                }

                setLocalGroups(prev => [...prev, newGroup]);
                setSelectedGroupIds(prev => [...prev, newGroup.id]);
            }

            setShowGroupModal(false);
            setNewGroupName("");
        } else {
            toast.error(result.data?.name?.[0] || t("saveAsGroup.error"));
        }
    };

    const defaultUsername = state?.formData?.username || (!state?.ok && user?.username) || '';

    return (
        <>
            <Form
                action={formAction}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
                {user?.id && (
                    <input type="hidden" name="id" value={user.id} />
                )}

                <div className="space-y-6">
                    {/* Basic Info Section */}
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            {t("basicInfo")}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextInput
                                name="username"
                                id="username"
                                defaultValue={defaultUsername}
                                placeholder={t("username")}
                                error={!state.ok && state.data?.username?.[0] || ""}
                                autoComplete="off"
                                required
                            />

                            <TextInput
                                name="password"
                                id="password"
                                type="password"
                                placeholder={user?.id ? t("passwordHint") : t("password")}
                                error={!state.ok && state.data?.password?.[0] || ""}
                                autoComplete="off"
                                required={!user?.id}
                            />
                        </div>

                        <div className="flex gap-6 mt-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    value="true"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-gray-700 dark:text-gray-300">{t("isActive")}</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_staff"
                                    value="true"
                                    checked={isStaff}
                                    onChange={(e) => setIsStaff(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-gray-700 dark:text-gray-300">{t("isStaff")}</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_superuser"
                                    value="true"
                                    checked={isSuperuser}
                                    onChange={(e) => setIsSuperuser(e.target.checked)}
                                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                                />
                                <span className="text-gray-700 dark:text-gray-300">{t("isSuperuser")}</span>
                            </label>
                        </div>

                        {/* Hidden inputs for unchecked checkboxes */}
                        {!isActive && <input type="hidden" name="is_active" value="false" />}
                        {!isStaff && <input type="hidden" name="is_staff" value="false" />}
                        {!isSuperuser && <input type="hidden" name="is_superuser" value="false" />}
                    </div>

                    {/* Profile Details Section (Collapsible) */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                {t("profileDetails")}
                            </span>
                            {isProfileOpen ? (
                                <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                            ) : (
                                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                            )}
                        </button>

                        {isProfileOpen && (
                            <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                                {/* Avatar Upload Section */}
                                <div className="flex flex-col items-center mb-8">
                                    <AvatarUpload
                                        user={user}
                                        text={{
                                            clickToUpload: t("clickToUpload"),
                                            remove: t("removePhoto"),
                                            dragActive: t("clickToUpload")
                                        }}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <TextInput
                                        name="first_name"
                                        id="first_name"
                                        defaultValue={user?.first_name || ''}
                                        placeholder={t("firstName")}
                                        autoComplete="given-name"
                                    />
                                    <TextInput
                                        name="last_name"
                                        id="last_name"
                                        defaultValue={user?.last_name || ''}
                                        placeholder={t("lastName")}
                                        autoComplete="family-name"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Permissions Section */}
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {t("permissions")}
                            </h2>

                            <button
                                type="button"
                                onClick={() => setShowGroupModal(true)}
                                className="px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                            >
                                {t("saveAsGroup.button")}
                            </button>
                        </div>

                        <PermissionSelector
                            groups={localGroups}
                            permissions={permissions}
                            selectedGroupIds={selectedGroupIds}
                            selectedPermissionIds={selectedPermissionIds}
                            onGroupsChange={setSelectedGroupIds}
                            onPermissionsChange={setSelectedPermissionIds}
                            inputNameGroups="groups"
                            inputNamePermissions="user_permissions"
                        />
                    </div>

                    {/* Submit Button */}
                    <FormButton
                        type="submit"
                        variant={user?.id ? "secondary" : "primary"}
                        size="md"
                        bgColor={user?.id ? "bg-emerald-500 dark:bg-emerald-600" : "bg-blue-500 dark:bg-blue-600"}
                        hoverBgColor={user?.id ? "bg-emerald-700 dark:bg-emerald-800" : "bg-blue-700 dark:bg-blue-800"}
                        textColor="text-white dark:text-gray-100"
                        className="w-full"
                        isLoading={isPending}
                    >
                        {user?.id ? tGlobal("global.form.edit") : tGlobal("global.form.submit")}
                    </FormButton>
                </div>
            </Form>

            {/* Save as Group Modal */}
            {showGroupModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            {t("saveAsGroup.title")}
                        </h3>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {t("saveAsGroup.description", { count: selectedPermissionIds.length })}
                        </p>

                        <TextInput
                            name="groupName"
                            id="groupName"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            placeholder={t("saveAsGroup.namePlaceholder")}
                        />

                        <div className="flex gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowGroupModal(false);
                                    setNewGroupName("");
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                {tGlobal("global.delete.cancelLabel")}
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveAsGroup}
                                disabled={savingGroup}
                                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                                {savingGroup ? t("saveAsGroup.saving") : t("saveAsGroup.save")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default UserForm;
