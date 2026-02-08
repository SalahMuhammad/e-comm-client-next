"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { deleteGroup } from "./actions";
// import GroupForm from "./GroupForm"; // Old form
import GroupFormClient from "./form/GroupFormClient";
import useGenericResponseHandler from "@/components/custom hooks/useGenericResponseHandler";
import * as Dialog from '@radix-ui/react-dialog';

export default function GroupsList({ groups, permissions, onGroupDeleted, onGroupCreated, onGroupUpdated }) {
    const t = useTranslations("permission-management.groups");
    const tMain = useTranslations("permission-management");
    const handleGenericErrors = useGenericResponseHandler();

    const [showForm, setShowForm] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [formKey, setFormKey] = useState(0); // Add key to reset form state

    const handleEdit = (group) => {
        setEditingGroup(group);
        setShowForm(true);
        setFormKey(prev => prev + 1);
    };

    const handleCreate = () => {
        setEditingGroup(null);
        setShowForm(true);
        setFormKey(prev => prev + 1);
    };

    const handleDelete = (id) => {
        toast(t("delete.confirm"), {
            description: t("delete.description"),
            action: {
                label: t("delete.yes"),
                onClick: async () => {
                    setDeletingId(id);
                    const res = await deleteGroup(id);

                    if (handleGenericErrors(res)) {
                        setDeletingId(null);
                        return;
                    }

                    if (res.ok) {
                        toast.success(t("delete.success"));
                        onGroupDeleted?.(id);
                    }
                    setDeletingId(null);
                },
            },
            cancel: {
                label: t("delete.no"),
                onClick: () => {
                    toast.info(t("delete.canceled"));
                },
            },
            duration: 10000,
        });
    };

    const handleFormSuccess = (group, isNew) => {
        if (isNew) {
            onGroupCreated?.(group);
        } else {
            onGroupUpdated?.(group);
        }
        setShowForm(false);
        setEditingGroup(null);
    };

    return (
        <div>
            {/* Header with create button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {t("description")}
                </p>
                <button
                    onClick={handleCreate}
                    className="flex w-full sm:w-auto justify-center items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                    <PlusIcon className="h-5 w-5" />
                    <span>{t("create")}</span>
                </button>
            </div>

            {/* Groups Table */}
            {groups.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {t("noGroups")}
                </div>
            ) : (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">{t("table.name")}</th>
                                <th scope="col" className="px-6 py-3">{t("table.permissionCount")}</th>
                                <th scope="col" className="px-6 py-3">{t("table.actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groups.map(group => (
                                <tr
                                    key={group.id}
                                    className={`
                                        bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600
                                        transition-all duration-300 ${deletingId === group.id ? 'opacity-50' : ''}
                                    `}
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                        {group.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded whitespace-nowrap">
                                            {group.permission_count ?? group.permissions?.length ?? 0} {t("table.permissions")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(group)}
                                                className="group flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                            >
                                                <PencilIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
                                                <span className="text-sm">{t("table.edit")}</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(group.id)}
                                                disabled={deletingId === group.id}
                                                className="group flex items-center gap-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors disabled:opacity-50"
                                            >
                                                <TrashIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
                                                <span className="text-sm">{t("table.delete")}</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Group Form Modal using Radix Dialog */}
            <Dialog.Root open={showForm} onOpenChange={setShowForm}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col z-50 p-0 transform transition-all">
                        <Dialog.Title className="sr-only">
                            {editingGroup ? tMain("groupForm.editTitle") : tMain("groupForm.createTitle")}
                        </Dialog.Title>
                        <GroupFormClient
                            key={formKey}
                            group={editingGroup}
                            permissions={permissions}
                            groups={groups}
                            onClose={() => {
                                setShowForm(false);
                                setEditingGroup(null);
                            }}
                            onSuccess={handleFormSuccess}
                            isModal={true}
                        />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}
