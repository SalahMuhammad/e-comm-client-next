"use client";

import { useActionState, useEffect } from 'react';
import { changePassword } from '../actions';
import '@/styles/auth/login.css';
import { LockClosedIcon, KeyIcon, ShieldCheckIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import Form from 'next/form';
import { useTranslations } from "next-intl";
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import { PulsingDots } from '@/components/loaders';
import { redirect, useSearchParams } from 'next/navigation';
import { useCompany } from '@/app/providers/company-provider.client';
import { toast } from 'sonner';
import Link from 'next/link';

export default function Page() {
    const [state, formAction, isPending] = useActionState(changePassword, { errors: {} });
    const companyDetails = useCompany();
    const t = useTranslations("auth.changePassword");
    const searchParams = useSearchParams();
    const isRequired = searchParams.get('required') === 'true';
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    useEffect(() => {
        if (state?.ok) {
            toast.success(t('success'));
            // Small delay to show success message before redirect
            setTimeout(() => {
                redirect(callbackUrl);
            }, 500);
        }
    }, [state]);

    function getErrorMessage(field) {
        if (!state?.data || state?.ok) return null;
        if (state.data[field]) {
            return typeof state.data[field] === 'string'
                ? state.data[field]
                : state.data[field][0];
        }
        if (field === 'general' && state.data.detail) {
            return state.data.detail;
        }
        return null;
    }

    return (
        <>
            <div className="login-container">

                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>

                <div className="login-box">
                    <div className="login-logo">
                        <div className="logo-inner">
                            <img
                                src={companyDetails.logo}
                                alt="Logo"
                                width={100}
                                height={100}
                                className="logo-image"
                            />
                        </div>
                    </div>

                    <h1>{t("title")}</h1>
                    {isRequired && (
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 text-center">
                            {t("description")}
                        </p>
                    )}

                    <Form action={formAction}>
                        <div className="input-container">
                            <div className="input-group">
                                <span className="input-icon">
                                    <LockClosedIcon className="h-5 w-5 text-gray-500" />
                                </span>
                                <input
                                    type="password"
                                    name="current_password"
                                    placeholder={t("currentPassword")}
                                    required
                                    className="input-animate LoginPassword"
                                />
                            </div>
                            {getErrorMessage('current_password') && (
                                <span className="error-message">{getErrorMessage('current_password')}</span>
                            )}
                        </div>
                        <div className="input-container">
                            <div className="input-group">
                                <span className="input-icon">
                                    <KeyIcon className="h-5 w-5 text-gray-500" />
                                </span>
                                <input
                                    type="password"
                                    name="new_password"
                                    placeholder={t("newPassword")}
                                    required
                                    className="input-animate LoginPassword"
                                    defaultValue={state?.values?.new_password || ''}
                                />
                            </div>

                            {getErrorMessage('new_password') && (
                                <span className="error-message">{getErrorMessage('new_password')}</span>
                            )}
                        </div>

                        <div className="input-container">
                            <div className="input-group">
                                <span className="input-icon">
                                    <ShieldCheckIcon className="h-5 w-5 text-gray-500" />
                                </span>
                                <input
                                    type="password"
                                    name="confirm_password"
                                    placeholder={t("confirmPassword")}
                                    required
                                    className="input-animate LoginPassword"
                                    defaultValue={state?.values?.confirm_password || ''}
                                />
                            </div>
                            {getErrorMessage('confirm_password') && (
                                <span className="error-message">{getErrorMessage('confirm_password')}</span>
                            )}
                        </div>

                        {getErrorMessage('general') && (
                            <div className="error-message general">{getErrorMessage('general')}</div>
                        )}

                        <button
                            type="submit"
                            className={`submit-button ${isPending ? 'loading' : ''}`}
                            disabled={isPending}
                        >
                            <span>
                                {isPending ? t("loading") : t("submit")}
                                {isPending && <PulsingDots className='loader' color='bg-gray-200' size='sm' />}
                            </span>
                        </button>
                    </Form>

                    {!isRequired && (
                        <div className="mt-4 text-center">
                            <Link
                                href={callbackUrl}
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                            >
                                {t("back")}
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <div id="control" className=''>
                <ThemeToggle />
                <LanguageToggle />
                <Link
                    href="/auth/logout"
                    className="relative w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-500 hover:scale-110 shadow-md"
                >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </Link>
            </div>
        </>
    );
}
