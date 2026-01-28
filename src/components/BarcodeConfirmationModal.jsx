"use client";

import { useState, useEffect } from 'react';
import { XMarkIcon, CheckIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import Gallery from '@/app/[locale]/(protected)/(warehouse)/items/list/Gallery';
import ImageView from '@/components/ImageView';

export default function BarcodeConfirmationModal({
    item,
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
    error = null,
    confirmButtonText = 'addItem' // Dynamic button text, defaults to 'addToInvoice'
}) {
    const t = useTranslations('barcodeScanner.confirmation');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [viewImages, setViewImages] = useState([]);
    const [viewStartIndex, setViewStartIndex] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            // Small delay before mounting animation for smoother transition
            setTimeout(() => setIsMounted(true), 50);

            return () => {
                document.body.style.overflow = originalOverflow;
                setIsMounted(false);
            };
        } else {
            setIsMounted(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (item && onConfirm) {
            onConfirm(item);
        }
    };

    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
    };

    const handleGalleryClick = (index) => {
        if (item?.images && item.images.length > 0) {
            setViewImages(item.images);
            setViewStartIndex(index);
        }
    };

    const handleImageViewClose = () => {
        setViewImages([]);
        setViewStartIndex(0);
    };

    return (
        <>
            <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isMounted
                ? 'bg-black/70 backdrop-blur-sm opacity-100'
                : 'bg-black/0 backdrop-blur-none opacity-0'
                }`} onClick={onClose}>
                <div className={`relative w-full ${item && !isLoading && !error ? ' max-w-md' : 'max-w-xs'} bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto transition-all duration-300 ${isMounted
                    ? 'scale-100 opacity-100 translate-y-0'
                    : 'scale-95 opacity-0 translate-y-4'
                    }`} onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-blue-600">
                        <h3 className="text-lg font-semibold text-white">
                            {isLoading ? t('loading') : error ? t('error') : t('confirmItem')}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                        >
                            <XMarkIcon className="w-6 h-6 text-white" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                <p className="mt-4 text-gray-600 dark:text-gray-400">{t('searchingItem')}</p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && !isLoading && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                                    <XMarkIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                                </div>
                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    {t('itemNotFound')}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Item Details */}
                        {item && !isLoading && !error && (
                            <div className="space-y-2">
                                {/* Images */}
                                {item.images && item.images.length > 0 ? (
                                    <div className="w-[70%] max-w-md mx-auto">
                                        <Gallery
                                            images={item.images}
                                            className="w-full"
                                            autoplay={false}
                                            onClick={handleGalleryClick}
                                        />
                                    </div>
                                ) : (
                                    <div className="aspect-square w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                                        <PhotoIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                                    </div>
                                )}

                                {/* Item Info */}
                                <div className="space-y-2">
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1.5">
                                            {item.label || item.name}
                                        </h4>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('itemId')}</p>
                                                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                                    {item.value || item.id || 'N/A'}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('price')}</p>
                                                <p className="text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                                    ${item.p4 || item.price4 || '0.00'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    {item && !isLoading && !error && (
                        <div className="sticky bottom-0 flex gap-3 px-3 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                            >
                                <CheckIcon className="w-5 h-5" />
                                {t(confirmButtonText)}
                            </button>
                        </div>
                    )}

                    {/* Error State Footer */}
                    {error && !isLoading && (
                        <div className="sticky bottom-0 px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-lg transition-all duration-300 cursor-pointer"
                            >
                                {t('close')}
                            </button>
                        </div>
                    )}

                </div>
            </div>

            {/* Image Viewer Modal - rendered outside to prevent event propagation */}
            <ImageView
                images={viewImages}
                onClose={handleImageViewClose}
                startIndex={viewStartIndex}
            />
        </>
    );
}
