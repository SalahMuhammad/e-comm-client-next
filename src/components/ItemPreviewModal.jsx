"use client";
import { useTranslations } from 'next-intl';
import Gallery from '@/app/[locale]/(protected)/(warehouse)/items/list/Gallery';
import { PhotoIcon } from '@heroicons/react/24/outline';

export default function ItemPreviewModal({
    item,
    isOpen,
    onClose,
    onConfirm,
    onImageClick
}) {
    const t = useTranslations('invoice.form');

    if (!isOpen || !item) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleConfirm = () => {
        onConfirm(item);
        onClose();
    };

    // Prepare images array for Gallery component
    const images = item.images || [];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={handleBackdropClick}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full overflow-hidden transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {t('previewItem')}
                    </h3>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Image Gallery or Placeholder */}
                    <div className="flex justify-center">
                        {images.length > 0 ? (
                            <div className="w-full">
                                <Gallery
                                    images={images}
                                    className="w-full"
                                    onClick={(index) => {
                                        if (onImageClick) {
                                            onImageClick(images, index);
                                        }
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                                <PhotoIcon className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                                <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    {t('noImage')}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Item Details */}
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('itemId')}</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {item.value || t('notSet')}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('itemName')}</p>
                            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {item.label}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('unitPrice')}</p>
                            <p className="text-xl font-bold text-green-600 dark:text-green-400">
                                ${item.p4 || '0.00'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md font-medium transition-colors"
                    >
                        {t('cancelPreview')}
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md font-medium transition-colors"
                    >
                        {t('addToInvoice')}
                    </button>
                </div>
            </div>
        </div>
    );
}
