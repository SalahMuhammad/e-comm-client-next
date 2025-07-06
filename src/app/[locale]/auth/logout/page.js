"use client"

import { useEffect, useState } from "react";
import { logoutAction } from "./actions";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import "@/styles/auth/logout.css";
import LogoutLoader from "@/components/LogoutAnimation";

export default function Page() {
    const t = useTranslations('auth')
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLogoutComplete, setIsLogoutComplete] = useState(false);
    const router = useRouter();

    const handleLogoutComplete = () => {
        router.replace("/auth/");
    };

    async function handleLogout() {
        setError(null);
        setLoading(true);
        try {
            await logoutAction();
            setIsLogoutComplete(true);
        } catch (e) { 
            setError(t('logout.error'));
            setLoading(false);
        }
    }

    useEffect(() => {
        handleLogout();
    }, []);

    return (
        <>
            {loading && !error && (
                <div className="logout-loading-center">
                    {/* Loading GIF */}
                    {/* <img src="/logout.gif" alt="Logging out..." className="logout-loading-gif" /> */}
                    
                    {/* Loading Spinner */}
                    {/* <div className="logout-loading-spinner"></div> */}
                    {/* <div className="logout-loading-text">{t('logout.loading')}</div> */}

                    {/* Logout Animation */}
                    <LogoutLoader 
                        isComplete={isLogoutComplete} 
                        onComplete={handleLogoutComplete} 
                    />
                </div>
            )}
            {error && !loading && (
                <div className="logout-error-center">
                    <div
                        className="logout-error-card"
                        role="alert"
                    >
                        <svg className="logout-error-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /></svg>
                        <div>
                            <div className="logout-error-title">{t('logout.failed')}</div>
                            <div className="logout-error-message">{error}</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="logout-error-btn"
                        aria-label="Retry Logout"
                    >
                        <svg className="logout-error-btn-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        <span>{t('logout.retry')}</span>
                    </button>
                </div>
            )}
        </>
    );
}
