'use client';

import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export default function Notify({
    action,
    onResponse,
    title,
    message,
    variant = 'success',
    description,
    loadingMessage,
    successMessage,
    errorMessage,
}) {
    const t = useTranslations('ConfirmAction');

    // 1. Logic for Auto-triggering standard toasts (warn, error, success, info)
    useEffect(() => {
        if (variant !== 'action' && message) {
            toast[variant](title || message, { description });
        }
    }, [variant, message, title, description]);

    // 2. Logic for Action Button trigger
    const handleActionClick = () => {
        const executeAction = () => {
            if (!action) return;

            toast.promise(action(), {
                // description: description || t('description'),
                loading: loadingMessage || t('loading'),
                success: (data) => {
                    onResponse?.(data, null);
                    return successMessage || t('success');
                },
                error: (err) => {
                    onResponse?.(null, err);
                    return errorMessage || t('error');
                },
            });
        };

        const confirmedTitle = title || t('title');
        
        if (confirmedTitle) {
            toast(confirmedTitle, {
                description: description || t('description'),
                action: { label: 'Confirm', onClick: executeAction },
                cancel: { label: 'Cancel' },
            });
        } else {
            executeAction();
        }
    };

    // 3. Render logic: Only show the button if it is an 'action' variant
    if (variant === 'action') {
        return (
            <button 
                onClick={handleActionClick}
                className="text-sm font-medium text-red-600 hover:text-red-700"
            >
                {t('delete')}
            </button>
        );
    }

    // Return nothing for standard notifications (they trigger via useEffect)
    return null;
}