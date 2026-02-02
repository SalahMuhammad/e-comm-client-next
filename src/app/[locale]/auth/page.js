"use client";
import { useActionState, useEffect } from 'react';
import { Login } from './actions';
import '@/styles/auth/login.css';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import Form from 'next/form'
import { useTranslations } from "next-intl";
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import { PulsingDots } from '@/components/loaders';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCompany } from '@/app/providers/company-provider.client';
import useGenericResponseHandler from '@/components/custom hooks/useGenericResponseHandler';

export default function Page() {
  const [state, formAction, isPending] = useActionState(Login, { errors: {} });
  const companyDetails = useCompany();
  const searchParams = useSearchParams()
  const router = useRouter();
  const t = useTranslations("auth")
  const handleGenericErrors = useGenericResponseHandler();

  useEffect(() => {
    if (state?.status === undefined) return;

    // Handle errors (returns true if error was handled)
    if (handleGenericErrors(state, false)) return;

    // Success handling
    if (state.status === 200) {
      if (state.data?.password_change_required) {
        router.replace('/auth/change-password?required=true');
      } else if (searchParams.get('nexturl')) {
        router.replace(searchParams.get('nexturl'));
      } else {
        router.replace('/dashboard');
      }
    }
  }, [state, router, searchParams]);

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

          <h1>{t("welcome")}</h1>

          <Form action={formAction}>
            <div className="input-container">
              <div className="input-group">
                <span className="input-icon">
                  <UserIcon className="h-5 w-5 text-gray-500" />
                </span>
                <input
                  type="text"
                  name="username"
                  placeholder={t("username")}
                  required
                  className="input-animate LoginUsername"
                  defaultValue={state?.username || ''}
                />
              </div>
              {state?.errors?.username && (
                <span className="error-message">{t('errors.missing.username')}</span>
              )}
            </div>

            <div className="input-container">
              <div className='input-group'>
                <span className="input-icon">
                  <LockClosedIcon className="h-5 w-5 text-gray-500" />
                </span>
                <input
                  type="password"
                  name="password"
                  placeholder={t("password")}
                  required
                  className="input-animate LoginPassword"
                  defaultValue={state?.password || ''}
                />
              </div>
              {state?.errors?.password && (
                <span className="error-message">{t('errors.missing.password')}</span>
              )}
            </div>

            {!state?.ok && (state?.data?.detail || state?.data?.username || state?.data?.password || state?.data?.non_field_errors) && (
              <div className="error-message general">
                {state.data?.detail || state.data?.username || state.data?.password || state.data?.non_field_errors?.[0] || t('errors.500')}
              </div>
            )}

            <button
              type="submit"
              className={`submit-button ${isPending ? 'loading' : ''}`}
              disabled={isPending}
            >
              <span>{isPending ? t("loading") : t("login")} {isPending && <PulsingDots className='loader' color='bg-gray-200' size='sm' />}</span>
            </button>
          </Form>
        </div>
      </div>

      <div id="control">
        <ThemeToggle />
        <LanguageToggle />
      </div>
    </>
  );
}