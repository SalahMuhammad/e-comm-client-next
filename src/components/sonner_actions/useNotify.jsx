'use client';

import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export function useNotify() {
    const t = useTranslations('ConfirmAction');

    const notify = ({
        action,
        onResponse,
        title,
        message,
        variant = 'success',
        description,
        loadingMessage,
        successMessage,
        errorMessage,
    }) => {
        // 1. Logic for standard toasts (warn, error, success, info)
        if (variant !== 'action' && (message || title)) {
            toast[variant](title || message, { description });
            return;
        }

        // 2. Logic for Action Button trigger (Promises / Confirmations)
        const executeAction = () => {
            if (!action) return;

            toast.promise(action(), {
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

        // const confirmedTitle = title || t('title');
        
        // if (confirmedTitle && variant === 'action') {
        //     toast(confirmedTitle, {
        //         description: description || t('description'),
        //         action: { label: 'Confirm', onClick: executeAction },
        //         cancel: { label: 'Cancel' },
        //     });
        // } else {
            executeAction();
        // }
    };

    return notify;
}
