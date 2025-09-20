import { useState, useEffect } from 'react';
import { useTranslations } from "next-intl";
import '@/styles/auth/LogoutAnimation.css';

const LogoutLoader = ({ onComplete, isComplete: externalComplete = false }) => {
    const t = useTranslations('auth')
    const [isComplete, setIsComplete] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(t("logout.loading"));

    useEffect(() => {
        if (externalComplete && !isComplete) {
            setIsComplete(true);
            setCurrentMessage('Logout completed successfully');

            setTimeout(() => {
                if (onComplete) {
                    onComplete();
                }
            }, 3000);
        }
    }, [externalComplete, isComplete, onComplete]);

    const CheckIcon = () => (
        <svg viewBox="0 0 24 24" className="check-icon-svg">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
    );

    const InfoIcon = () => (
        <svg viewBox="0 0 24 24" className="info-icon-svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
    );

    const SecurityIcon = () => (
        <svg viewBox="0 0 24 24" className="security-icon-svg">
            <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16V18H8V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z" />
        </svg>
    );

    return (
        <div className="logout-overlay">
            <div className="logout-container">
                {!isComplete ? (
                    <div className="loading-content">
                        {/* Header Section */}
                        <div className="header-section">
                            <div className="logout-icon">
                                <SecurityIcon />
                            </div>
                            <h2 className="logout-title">{t("logout.progress")}</h2>
                            <p className="logout-subtitle">
                                {t("logout.progressMessage")}
                            </p>
                        </div>

                        {/* Current Activity */}
                        <div className="activity-section">
                            <div className="spinner-container">
                                <div className="spinner" />
                                <span className="activity-text">{currentMessage}</span>
                            </div>
                        </div>

                        {/* Security Notice */}
                        {/* <div className="security-notice">
                            <SecurityIcon />
                            <span>Your session is being terminated</span>
                        </div> */}
                    </div>
                ) : (
                    <div className="success-content">
                        <div className="success-icon">
                            <CheckIcon />
                        </div>
                        <h2 className="success-title">{t("logout.completed")}</h2>
                        <p className="success-subtitle">
                            {t("logout.completedMessage")}
                        </p>
                        <div className="redirect-notice">
                            <InfoIcon />
                            <span>{t("logout.redirect")}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LogoutLoader;