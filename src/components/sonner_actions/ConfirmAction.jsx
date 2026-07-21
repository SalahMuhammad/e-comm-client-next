'use client';

import { useEffect, useId, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import MyButtonv2 from '../form-utils/MyButtonv2';

/**
 * Wraps a trigger element with a confirmation dialog. On confirm it runs
 * `action`, drives a sonner toast through loading -> success/error, then
 * calls `onResponse(result, error)` once the action settles.
 *
 * <ConfirmAction
 *   action={() => deleteSparePart(part.id)}
 *   onResponse={(result, error) => { if (!error) removeRow(part.id); }}
 *   title={t('deleteTitle')}
 *   description={t('deleteDescription', { name: part.name })}
 *   confirmLabel={t('delete')}
 * >
 *   <button>Delete</button>
 * </ConfirmAction>
 */
export default function ConfirmAction({
    action,
    onResponse,
    title,
    description,
    confirmLabel,
    cancelLabel,
    loadingMessage,
    successMessage,
    errorMessage,
    variant = 'danger', // 'danger' | 'default'
}) {
    const t = useTranslations('ConfirmAction');
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const titleId = useId();
    const descriptionId = useId();

    useEffect(() => {
        if (!open) return undefined;
        function handleKeyDown(e) {
            if (e.key === 'Escape' && !isPending) setOpen(false);
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, isPending]);

    const close = () => {
        if (!isPending) setOpen(false);
    };

    const handleConfirm = () => {
        startTransition(async () => {
            const pending = Promise.resolve(action());

            toast.promise(pending, {
                loading: loadingMessage || t('loading'),
                success: successMessage || t('success'),
                error: () => errorMessage || t('error'),
            });

            try {
                const result = await pending;
                setOpen(false);
                onResponse?.(result, null);
            } catch (error) {
                console.error('ConfirmAction failed:', error);
                onResponse?.(null, error);
            }
        });
    };

    // const trigger = cloneElement(children, {
    //     onClick: (e) => {
    //         children.props.onClick?.(e);
    //         setOpen(true);
    //     },

    //     children: "New Button Text" 
    // });

    const trigger2 = (
        <button 
            className="text-sm font-medium text-red-600 hover:text-red-700"
            onClick={() => setOpen(true)}
        >
            {t('delete')}
        </button>
    )

    const isDanger = variant === 'danger';

    return (
        <>
            {trigger2}

            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
                    onClick={close}
                >
                    <div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        aria-describedby={descriptionId}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
                    >
                        <h2 id={titleId} className="text-base font-semibold text-slate-900 dark:text-slate-100">
                            {title || t('title')}
                        </h2>
                        <p id={descriptionId} className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                            {description || t('description')}
                        </p>

                        <div className="mt-6 flex justify-end gap-2">
                            <MyButtonv2
                                variant='secondary'
                                size='sm'
                                onClick={close}
                                disabled={isPending}
                            > 
                                {cancelLabel || t('cancel')}
                            </MyButtonv2>
                            <MyButtonv2
                                variant={variant}
                                size='sm'
                                onClick={handleConfirm}
                                disabled={isPending}
                            >                             
                                {isPending && (
                                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                    </svg>
                                )}
                                {confirmLabel || t('confirm')}
                            </MyButtonv2>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
