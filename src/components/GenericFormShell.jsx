'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Form from 'next/form';
import FormButton from '@/components/FormButton';
import { NumberInput } from '@/components/inputs/index';
import useGenericResponseHandler from '@/components/custom hooks/useGenericResponseHandler';
import styles from '@/app/[locale]/(protected)/(warehouse)/_common/form.module.css';
import { useTranslations } from 'next-intl';

/**
 * GenericFormShell — Universal Form Shell Client Component
 *
 * One component for ALL form pages. Update the form layout/button styles
 * here → propagates to every form in the app.
 *
 * @param {Object}   props.state           - useActionState result (state)
 * @param {Function} props.formAction      - useActionState result (formAction)
 * @param {boolean}  props.isPending       - useActionState result (isPending)
 * @param {Object}   props.obj             - Existing record being edited (null for create)
 * @param {Function} props.t               - useTranslations instance (must have 'title', 'edit', 'submit', 'id', 'successCreate', 'successEdit' keys)
 * @param {string}   props.redirectPath    - Path to navigate to after successful edit (e.g. '/repository/list/')
 * @param {boolean}  props.isModal         - True if used inside a dialog modal
 * @param {Function} props.onSuccess       - Optional callback after success in modal mode
 * @param {React.ReactNode} props.children - The unique form fields for this entity
 * @param {boolean}  props.showIdField     - Show the green read-only ID field when editing (default: true)
 */
export default function GenericFormShell({
    state,
    formAction,
    isPending,
    obj,
    t,
    redirectPath,
    isModal = false,
    onSuccess,
    children,
    showIdField = true,
    customTitle,
    className,
    formClassName = 'pt-1'
}) {
    const router = useRouter();
    const handleGenericErrors = useGenericResponseHandler();
    const tGlobal = useTranslations('global.form');
    const isEdit = !!(obj?.id || obj?.hashed_id);

    useEffect(() => {
        if (state?.ok === undefined) return;
        if (handleGenericErrors(state)) return;

        if (state?.ok) {
            toast.success(tGlobal(isEdit ? 'successEdit' : 'successCreate'));

            if (onSuccess) {
                onSuccess(state.data);
                return;
            }

            if (isEdit && redirectPath) {
                router.replace(redirectPath);
            }

            if (!isModal && !isEdit) {
                window.location.reload();
            }
        }
    }, [state]);

    return (
        <div className={`${styles.formContainer} ${className}`}>
            <Form action={formAction} className={`${styles.form}`}>
                {/* Header — change header style once, applies to all forms */}
                <div className={styles.formHeader}>
                    <h2>{customTitle || t(isEdit ? 'edit' : 'title')}</h2>
                </div>

                {/* Body */}
                {/* <div className={styles.formContent}> */}
                <div className={`${formClassName} p-5`}>
                    {/* Read-only ID field shown when editing */}
                    {isEdit && showIdField && (
                        <NumberInput
                            placeholder={tGlobal('id')}
                            id="id"
                            value={state?.id || state?.hashed_id || obj?.id || obj?.hashed_id}
                            borderColor="border-green-500 dark:border-green-400"
                            labelColor="text-green-600 dark:text-green-400"
                            focusColor=""
                            focusLabelColor=""
                            name="id"
                            readOnly
                        />
                    )}

                    {/* Feature-specific fields go here */}
                    {children}
                </div>

                {/* Submit button — change button style once, applies to all forms */}
                <div className={styles.formActions}>
                    <FormButton
                        type="submit"
                        variant={isEdit ? 'secondary' : 'primary'}
                        size="md"
                        bgColor={isEdit ? 'bg-emerald-500 dark:bg-emerald-600' : 'bg-blue-500 dark:bg-blue-600'}
                        hoverBgColor={isEdit ? 'bg-emerald-700 dark:bg-emerald-800' : 'bg-blue-700 dark:bg-blue-800'}
                        textColor="text-white dark:text-gray-100"
                        className="w-full"
                        isLoading={isPending}
                    >
                        {tGlobal(isEdit ? 'edit' : 'submit')}
                    </FormButton>
                </div>
            </Form>
        </div>
    );
}
