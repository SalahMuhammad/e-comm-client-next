"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { QrCodeIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

/**
 * POS Device Barcode Scanner Component
 * 
 * Listens for keyboard input from barcode scanner devices.
 * Scanner devices typically send characters rapidly followed by Enter.
 * 
 * @param {Function} onScan - Callback when barcode is scanned
 */
export default function BarcodePOSScanner({ onScan }) {
    const t = useTranslations('barcodeScanner');
    const [status, setStatus] = useState('waiting'); // 'waiting' | 'scanning'
    const [lastScan, setLastScan] = useState(null);

    const bufferRef = useRef('');
    const timestampRef = useRef(Date.now());
    const scanAnimationRef = useRef(null);

    // Configuration
    const MIN_BARCODE_LENGTH = 4;
    const MAX_BARCODE_LENGTH = 128;
    const INPUT_TIMEOUT = 100; // ms - time between rapid keystrokes from scanner

    const handleScan = useCallback((barcode) => {
        if (barcode.length >= MIN_BARCODE_LENGTH && barcode.length <= MAX_BARCODE_LENGTH) {
            setLastScan(barcode);
            setStatus('scanning');

            // Visual feedback
            if (scanAnimationRef.current) {
                clearTimeout(scanAnimationRef.current);
            }

            scanAnimationRef.current = setTimeout(() => {
                setStatus('waiting');
            }, 1000);

            onScan?.(barcode);
        }
        bufferRef.current = '';
    }, [onScan]);

    const handleKeyPress = useCallback((event) => {
        // Ignore if user is typing in an input field
        const target = event.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            return;
        }

        const now = Date.now();
        const char = event.key;

        // If Enter key, process the buffer
        if (char === 'Enter') {
            event.preventDefault();
            if (bufferRef.current.length > 0) {
                handleScan(bufferRef.current);
            }
            return;
        }

        // Reset buffer if too much time has passed (not from scanner)
        if (now - timestampRef.current > INPUT_TIMEOUT) {
            bufferRef.current = '';
        }

        // Add character to buffer if it's a valid character
        if (char.length === 1) {
            bufferRef.current += char;
            timestampRef.current = now;
        }
    }, [handleScan]);

    useEffect(() => {
        window.addEventListener('keypress', handleKeyPress);

        return () => {
            window.removeEventListener('keypress', handleKeyPress);
            if (scanAnimationRef.current) {
                clearTimeout(scanAnimationRef.current);
            }
        };
    }, [handleKeyPress]);

    return (
        <div className="w-full">
            {/* POS Scanner Visual Feedback */}
            <div className="flex flex-col items-center justify-center">
                {/* Scanner Icon/Animation */}
                <div className={`relative mb-6 transition-all duration-300 ${status === 'scanning' ? 'scale-110' : 'scale-100'
                    }`}>
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${status === 'scanning'
                        ? 'bg-green-500 shadow-lg shadow-green-500/50'
                        : 'bg-blue-500 shadow-md'
                        }`}>
                        <QrCodeIcon className="w-12 h-12 text-white" />
                    </div>

                    {/* Pulse animation when waiting */}
                    {status === 'waiting' && (
                        <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20" />
                    )}

                    {/* Success checkmark when scanning */}
                    {status === 'scanning' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <CheckIcon className="w-16 h-16 text-white animate-bounce" strokeWidth={3} />
                        </div>
                    )}
                </div>

                {/* Status Text */}
                <h3 className={`text-xl font-semibold mb-2 transition-colors ${status === 'scanning'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-900 dark:text-white'
                    }`}>
                    {status === 'scanning' ? t('pos.scanning') : t('pos.waiting')}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-xs mb-4">
                    {t('pos.instructions')}
                </p>

                {/* Last Scan Display */}
                {lastScan && (
                    <div className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('pos.lastScan')}</p>
                        <p className="text-sm font-mono font-semibold text-gray-900 dark:text-white">
                            {lastScan}
                        </p>
                    </div>
                )}

                {/* Instructions */}
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 w-full">
                    <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-xs text-blue-900 dark:text-blue-100">
                            <p className="font-semibold mb-1">{t('pos.ready')}</p>
                            <ul className="list-disc list-inside space-y-0.5 text-blue-800 dark:text-blue-200">
                                <li>{t('pos.instructionStep1')}</li>
                                <li>{t('pos.instructionStep2')}</li>
                                <li>{t('pos.instructionStep3')}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
