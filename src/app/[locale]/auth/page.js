"use client";
import { useActionState } from 'react';
import { Login } from './actions';
import '@/styles/auth/login.css';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import Form from 'next/form'
import { useTranslations } from "next-intl";
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';

export default function Page() {
  const [state, formAction, isPending] = useActionState(Login, { errors: {} });
  const t = useTranslations("auth")


  function handleErrors(data) {
    if (data.success) {
      return;
    }

    const errorCode = data?.errors?.general;

    switch (errorCode) {
      case 403:
        return t('errors.403');

      case 404:
        return t('errors.404');

      default:
        if (errorCode >= 500) {
          return t("errors.500");
        } else if (errorCode) {
          return t("errors.etc");
        }
    }

    return false;
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
              src="/assets/logo/fav2.png"
              alt="Logo"
              width={100}
              height={100}
              className="logo-image"
            />
          </div>
        </div>

        <h1>{t("welcome")}</h1>

        <Form action={formAction}>
          <div className="input-group">
            <span className="input-icon">
                <UserIcon className="h-5 w-5 text-gray-500" />
            </span>
            <input
              type="text"
              name="username"
              placeholder={t("username")}
              required
              className="input-animate"
              defaultValue={state?.username || ''} 
            />
            {state?.errors?.username && (
              <span className="error-message">{t('errors.missing.username')}</span>
            )}
          </div>

          <div className="input-group">
            <span className="input-icon">
                <LockClosedIcon className="h-5 w-5 text-gray-500" />
            </span>
            <input
              type="password"
              name="password"
              placeholder={t("password")}
              required
              className="input-animate"
              defaultValue={state?.password || ''}
            />
            {state?.errors?.password && (
              <span className="error-message">{t('errors.missing.password')}</span>
            )}
          </div>

          {state?.errors?.general && (
            <div className="error-message general">{handleErrors(state)}</div>
          )}

          <button
            type="submit"
            className={`submit-button ${isPending ? 'loading' : ''}`}
            disabled={isPending}
          >
            <span>{isPending ? 'Logging in...' : 'Login'}</span>
          </button>
        </Form>
      </div>
    </div>
    <ThemeToggle />
    <LanguageToggle />
    </>
  );
}