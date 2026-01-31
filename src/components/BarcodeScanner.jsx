"use client";

import { useState, useCallback, useEffect } from 'react';
import { XMarkIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import BarcodeCameraScanner from './scanners/BarcodeCameraScanner';
import BarcodePOSScanner from './scanners/BarcodePOSScanner';

/**
 * Unified Barcode Scanner Component with Dual Modes
 * 
 * @param {Object} props
 * @param {Function} props.onScan - Callback when barcode is scanned
 * @param {boolean} props.disabled - Disable the scanner button
 * @param {string} props.className - Additional CSS classes
 * @param {'button' | 'icon'} props.variant - 'button' for prominent button, 'icon' for compact icon
 * @param {'xs' | 'sm' | 'md' | 'lg'} props.size - Icon size (only for icon variant)
 * @param {boolean} props.isParentOpen - When false, automatically closes the scanner (useful when parent dialog closes)
 */
export default function BarcodeScanner({
    onScan,
    disabled = false,
    className = '',
    variant = 'button',
    size = 'sm',
    isParentOpen = true
}) {
    const t = useTranslations('barcodeScanner');
    const [modalOpen, setModalOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [scannerMode, setScannerMode] = useState('camera'); // 'camera' | 'pos'
    const [isMobile, setIsMobile] = useState(false);

    // Detect device type and load preference
    useEffect(() => {
        const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        setIsMobile(mobile);

        // Load saved preference or use device-based default
        const savedMode = localStorage.getItem('barcodeScannerMode');
        if (savedMode === 'camera' || savedMode === 'pos') {
            setScannerMode(savedMode);
        } else {
            // Default: mobile → camera, desktop → POS
            setScannerMode(mobile ? 'camera' : 'pos');
        }
    }, []);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (modalOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [modalOpen]);

    // Close scanner when parent closes
    useEffect(() => {
        if (!isParentOpen && modalOpen) {
            setModalOpen(false);
        }
    }, [isParentOpen, modalOpen]);

    const handleModeChange = useCallback((mode) => {
        setScannerMode(mode);
        localStorage.setItem('barcodeScannerMode', mode);
    }, []);

    const handleScan = useCallback((code) => {
        // Trigger fade-out animation
        setIsClosing(true);
        // Close after animation completes
        setTimeout(() => {
            setModalOpen(false);
            setIsClosing(false);
            onScan?.(code);
        }, 200); // Match animation duration
    }, [onScan]);

    const openModal = useCallback(() => {
        setModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            setModalOpen(false);
            setIsClosing(false);
        }, 200);
    }, []);

    // Button styling based on variant
    const sizeClasses = {
        xs: "p-1.5",
        sm: "p-2",
        md: "p-2.5",
        lg: "p-3"
    };

    const iconSizeClasses = {
        xs: "w-3 h-3",
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6"
    };

    const TriggerButton = variant === 'icon' ? (
        <button
            type="button"
            onClick={openModal}
            disabled={disabled}
            className={`${sizeClasses[size]} text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            title={t('scanBarcode')}
        >
            <QrCodeIcon className={iconSizeClasses[size]} />
        </button>
    ) : (
        <button
            type="button"
            onClick={openModal}
            disabled={disabled}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 active:scale-95 ${className}`}
        >
            <QrCodeIcon className="w-5 h-5" />
            <span className="hidden sm:inline">{t('scan')}</span>
        </button>
    );

    return (
        <>
            {TriggerButton}

            {/* Scanner Modal */}
            {modalOpen && (
                <div className={`fixed inset-0 z-[99999] flex items-center justify-center p-4 transition-all duration-200 ${isClosing
                    ? 'bg-black/0 backdrop-blur-none opacity-0'
                    : 'bg-black/70 backdrop-blur-sm opacity-100'
                    }`} onClick={closeModal}>

                    <div className={`relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden transition-all duration-200 ${isClosing
                        ? 'scale-95 opacity-0'
                        : 'scale-100 opacity-100'
                        }`} onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-blue-600">
                            <div className="flex items-center gap-2">
                                <QrCodeIcon className="w-5 h-5 text-white" />
                                <span className="text-sm font-semibold text-white">{t('scanBarcode')}</span>
                            </div>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="p-1 rounded-md hover:bg-white/20 transition-colors cursor-pointer"
                            >
                                <XMarkIcon className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Mode Selector */}
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    {t('mode.select')}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleModeChange('camera')}
                                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${scannerMode === 'camera'
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <div className="flex flex-col items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>{t('mode.camera')}</span>
                                        {/* {isMobile && (
                                            <span className="text-[10px] opacity-75">{t('mode.recommendedMobile')}</span>
                                        )} */}
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleModeChange('pos')}
                                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${scannerMode === 'pos'
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <div className="flex flex-col items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                        </svg>
                                        <span>{t('mode.pos')}</span>
                                        {/* {!isMobile && (
                                            <span className="text-[10px] opacity-75">{t('mode.recommendedDesktop')}</span>
                                        )} */}
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Scanner Content */}
                        <div className="p-4">
                            {scannerMode === 'camera' ? (
                                <BarcodeCameraScanner onScan={handleScan} />
                            ) : (
                                <BarcodePOSScanner onScan={handleScan} />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
