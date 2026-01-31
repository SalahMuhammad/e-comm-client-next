"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { XMarkIcon, BoltIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

/**
 * Camera-based Barcode Scanner Component
 * 
 * Features:
 * - Camera scanning using html5-qrcode
 * - 45-second idle timeout with tap-to-resume
 * - Torch toggle support
 * - Camera switching (front/back)
 * 
 * @param {Function} onScan - Callback when barcode is scanned
 */
export default function BarcodeCameraScanner({ onScan }) {
    const t = useTranslations('barcodeScanner');
    const [error, setError] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [torchEnabled, setTorchEnabled] = useState(false);
    const [hasTorch, setHasTorch] = useState(false);
    const [cameras, setCameras] = useState([]);
    const [facingMode, setFacingMode] = useState('environment');
    const [isIdle, setIsIdle] = useState(false);

    const scannerRef = useRef(null);
    const containerRef = useRef(null);
    const readerId = useRef(`barcode-reader-${Math.random().toString(36).substr(2, 9)}`);
    const idleTimerRef = useRef(null);
    const lastScanTimeRef = useRef(Date.now());
    const isInitializingRef = useRef(false);

    // Idle timeout:
    const IDLE_TIMEOUT = 30000;

    const resetIdleTimer = useCallback(() => {
        lastScanTimeRef.current = Date.now();
        setIsIdle(false);

        if (idleTimerRef.current) {
            clearTimeout(idleTimerRef.current);
        }

        idleTimerRef.current = setTimeout(() => {
            setIsIdle(true);
            stopScanner();
        }, IDLE_TIMEOUT);
    }, []);

    const startScanner = useCallback(async (mode = facingMode) => {
        if (scanning || !containerRef.current) return;

        try {
            isInitializingRef.current = true;
            setError(null);
            setScanning(true);
            setTorchEnabled(false);
            setHasTorch(false);
            setIsIdle(false);

            const { Html5Qrcode } = await import('html5-qrcode');

            // Check if component was unmounted during initialization
            if (!isInitializingRef.current) {
                return;
            }

            // Detect cameras when starting
            try {
                const devices = await Html5Qrcode.getCameras();
                setCameras(devices || []);
            } catch (e) {
                setCameras([]);
            }

            // Check again after async operation
            if (!isInitializingRef.current) {
                return;
            }

            const scanner = new Html5Qrcode(readerId.current);
            scannerRef.current = scanner;

            await scanner.start(
                { facingMode: mode },
                { fps: 10, qrbox: { width: 220, height: 220 } },
                (decodedText) => {
                    resetIdleTimer();
                    onScan?.(decodedText);
                },
                () => { }
            );

            // Check torch support
            setTimeout(async () => {
                try {
                    const video = document.querySelector(`#${readerId.current} video`);
                    if (video?.srcObject) {
                        const track = video.srcObject.getVideoTracks()[0];
                        const caps = track?.getCapabilities?.();
                        setHasTorch(!!caps?.torch);
                    }
                } catch (e) {
                    setHasTorch(false);
                }
            }, 500);

            // Start idle timer
            resetIdleTimer();
            isInitializingRef.current = false;

        } catch (err) {
            isInitializingRef.current = false;
            setError(err.message || t('cameraError'));
            setScanning(false);
        }
    }, [scanning, onScan, facingMode, t, resetIdleTimer]);

    const stopScanner = useCallback(async () => {
        // Cancel any ongoing initialization
        isInitializingRef.current = false;

        const scanner = scannerRef.current;
        if (scanner) {
            try {
                if (scanner.isScanning) {
                    await scanner.stop();
                }
            } catch (e) {
                // Ignore
            }
            scannerRef.current = null;
        }

        // Force cleanup of any orphaned video streams
        try {
            const video = document.querySelector(`#${readerId.current} video`);
            if (video?.srcObject) {
                const tracks = video.srcObject.getTracks();
                tracks.forEach(track => track.stop());
                video.srcObject = null;
            }
        } catch (e) {
            // Ignore cleanup errors
        }

        setScanning(false);
        setTorchEnabled(false);

        if (idleTimerRef.current) {
            clearTimeout(idleTimerRef.current);
        }
    }, []);

    const toggleTorch = useCallback(async () => {
        try {
            const video = document.querySelector(`#${readerId.current} video`);
            if (!video?.srcObject) return;

            const track = video.srcObject.getVideoTracks()[0];
            if (!track) return;

            const newState = !torchEnabled;
            await track.applyConstraints({ advanced: [{ torch: newState }] });
            setTorchEnabled(newState);
        } catch (e) {
            console.warn("Torch toggle failed:", e);
        }
    }, [torchEnabled]);

    const switchCamera = useCallback(async () => {
        const newMode = facingMode === 'environment' ? 'user' : 'environment';
        setFacingMode(newMode);
        await stopScanner();
        setTimeout(() => startScanner(newMode), 200);
    }, [facingMode, stopScanner, startScanner]);

    const resumeScanning = useCallback(() => {
        startScanner();
    }, [startScanner]);

    // Auto-start on mount
    useEffect(() => {
        startScanner();
        return () => {
            stopScanner();
        };
    }, []);

    return (
        <div className="w-full">
            {/* Scanner Content */}
            <div className="relative">
                {error ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
                            <XMarkIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            {t('cameraError')}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 max-w-xs mb-3">
                            {error}
                        </p>
                        <button
                            onClick={() => {
                                setError(null);
                                setScanning(false);
                                setTimeout(() => startScanner(), 100);
                            }}
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                            {t('retry')}
                        </button>
                    </div>
                ) : (
                    <>
                        <div
                            id={readerId.current}
                            ref={containerRef}
                            className="w-full min-h-[250px] bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden"
                        />

                        {/* Idle Overlay */}
                        {isIdle && (
                            <div
                                className="absolute inset-0 bg-white/60 dark:bg-black/30 hover:bg-dark/80 dark:hover:bg-black/20 backdrop-blur-sm flex items-center justify-center rounded-lg cursor-pointer transition-all duration-200"
                                onClick={resumeScanning}
                            >
                                <div className="text-center px-4">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-900 dark:text-white font-semibold mb-1">{t('camera.idle')}</p>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm">{t('camera.tapToResume')}</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Footer with Controls */}
            {!error && (
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 rounded-b-lg mt-2">
                    {/* Torch & Camera Controls */}
                    {scanning && (hasTorch || cameras.length > 1) && (
                        <div className="flex items-center justify-center gap-3 mb-2">
                            {hasTorch && (
                                <button
                                    type="button"
                                    onClick={toggleTorch}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${torchEnabled
                                        ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/30'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    <BoltIcon className="w-4 h-4" />
                                    {t('torch')}
                                </button>
                            )}
                            {cameras.length > 1 && (
                                <button
                                    type="button"
                                    onClick={switchCamera}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                                >
                                    <ArrowPathIcon className="w-4 h-4" />
                                    {t('switch')}
                                </button>
                            )}
                        </div>
                    )}
                    <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                        {t('positionBarcode')}
                    </p>
                    <p className="text-xs text-center text-gray-500 dark:text-gray-500 mt-1">
                        {t('camera.timeout', { seconds: IDLE_TIMEOUT / 1000 })}
                    </p>
                </div>
            )}

            {/* Custom styles for scanner */}
            <style jsx>{`
                :global(#${readerId.current} video) {
                    border-radius: 0.5rem !important;
                    border: 2px solid rgb(37 99 235) !important;
                    width: 100% !important;
                }
                :global(#${readerId.current}__dashboard_section) {
                    display: none !important;
                }
                :global(#${readerId.current}__header_message) {
                    display: none !important;
                }
                :global(#${readerId.current}__scan_region) {
                    border-radius: 0.5rem !important;
                }
            `}</style>
        </div>
    );
}
