'use client';

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import * as Dialog from '@radix-ui/react-dialog';
import { PermissionGate } from '@/components/PermissionGate';

/**
 * CreateDialogButton — Generic "Create" button that opens a modal dialog.
 *
 * Handles all dialog state, form key reset, and PermissionGate internally.
 * Drop this anywhere you need a create popup — no boilerplate required.
 *
 * @param {string}          label           - Button text
 * @param {string}          title           - Accessible dialog title (sr-only)
 * @param {string}          [description]   - Accessible dialog description (sr-only)
 * @param {React.Component} FormComponent   - The form component to render inside the dialog.
 *                                            Receives: onSuccess, onCancel, isModal=true, ...formProps
 * @param {Object}          [formProps]     - Extra props forwarded to FormComponent
 * @param {Function}        [onSuccess]     - Called with the new data after successful creation
 * @param {string}          [permission]    - PERMISSIONS.X.ADD — wraps button in <PermissionGate> if provided
 * @param {string}          [maxWidth]      - Tailwind max-w class for the dialog (default: 'max-w-2xl')
 * @param {string}          [buttonClassName] - Extra classes for the trigger button
 */
export default function CreateDialogButton({
    label,
    title,
    description,
    FormComponent,
    formProps = {},
    onSuccess,
    permission,
    maxWidth = 'max-w-2xl',
    buttonClassName = '',
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [formKey, setFormKey] = useState(0);

    const handleSuccess = (newData) => {
        setIsOpen(false);
        setFormKey(prev => prev + 1);
        if (onSuccess && newData) {
            onSuccess(newData);
        }
    };

    const button = (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild>
                <button
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors dark:bg-gray-600 dark:hover:bg-gray-700 ${buttonClassName}`}
                >
                    <PlusIcon className="w-4 h-4" />
                    <span>{label}</span>
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                <Dialog.Content
                    className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto z-50 p-6 pt-0`}
                >
                    <Dialog.Title className="sr-only">{title}</Dialog.Title>
                    {description && (
                        <Dialog.Description className="sr-only">{description}</Dialog.Description>
                    )}
                    <FormComponent
                        key={formKey}
                        onSuccess={handleSuccess}
                        onCancel={() => setIsOpen(false)}
                        isModal={true}
                        {...formProps}
                    />
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );

    if (permission) {
        return <PermissionGate permission={permission}>{button}</PermissionGate>;
    }

    return button;
}
