"use client";

import { useState, useEffect } from 'react';
import { XMarkIcon, UserIcon, KeyIcon } from '@heroicons/react/24/outline'; // Add TrashIcon to imports
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { apiRequest } from '@/utils/api';
// import UserAvatar from './UserAvatar'; // Removed as it is used inside AvatarUpload
import { AvatarUpload } from "@/components/inputs";
import useGenericResponseHandler from '@/components/custom hooks/useGenericResponseHandler';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SettingsModal({
    isOpen,
    onClose,
    userData,
    onUpdate,
    token
}) {
    const t = useTranslations('settings'); // You might need to add translations later
    const handleResponse = useGenericResponseHandler(t);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        avatar: null
    });
    const [isAvatarRemoved, setIsAvatarRemoved] = useState(false);

    // Initialize form data when userData changes
    useEffect(() => {
        if (userData) {
            setFormData({
                first_name: userData.first_name || '',
                last_name: userData.last_name || '',
                email: userData.email || '',
                avatar: null
            });
            setIsAvatarRemoved(false);
        }
    }, [userData, isOpen]);

    // Handle mount animation and body scroll lock
    useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
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

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formPayload = new FormData();
            formPayload.append('first_name', formData.first_name);
            formPayload.append('last_name', formData.last_name);

            if (formData.avatar) {
                formPayload.append('avatar', formData.avatar);
            }
            if (isAvatarRemoved) {
                formPayload.append('remove_avatar', 'true');
            }

            const response = await apiRequest('api/users/user/', {
                method: 'PATCH',
                body: formPayload
            });

            if (handleResponse(response)) return;

            if (response.ok) {
                const updatedUser = response.data;
                toast.success(t('successUpdate'));
                onUpdate(updatedUser); // Update parent state
                onClose();
            }

        } catch (error) {
            console.error(error);
            toast.error(t('errorGeneric'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-all duration-300 ${isMounted ? 'bg-black/60 backdrop-blur-sm opacity-100' : 'bg-black/0 backdrop-blur-none opacity-0'
                }`}
            onClick={handleBackdropClick}
        >
            <div
                className={`w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${isMounted ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
                    }`}
            >
                {/* Header */}
                <div className="relative px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {t('title')}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <form onSubmit={handleSubmit}>
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center mb-8">
                            <AvatarUpload
                                user={userData}
                                onChange={(file) => {
                                    setFormData(prev => ({ ...prev, avatar: file }));
                                    setIsAvatarRemoved(false);
                                }}
                                onRemove={() => {
                                    setFormData(prev => ({ ...prev, avatar: null }));
                                    setIsAvatarRemoved(true);
                                }}
                                text={{
                                    clickToUpload: t('clickToUpload'),
                                    remove: t('removePhoto'),
                                    dragActive: t('clickToUpload') // Using clickToUpload key or valid fallback
                                }}
                            />
                        </div>


                        {/* Fields */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        {t('firstName')}
                                    </label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                        placeholder={t('firstNamePlaceholder')}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        {t('lastName')}
                                    </label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                        placeholder={t('lastNamePlaceholder')}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                    {t('username')}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <UserIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={userData?.username || ''}
                                        disabled
                                        className="bg-gray-100 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Security Section */}
                        <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-6">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <KeyIcon className="w-4 h-4" />
                                {t('title')}
                            </h4>
                            <Link
                                href={`/auth/change-password?callbackUrl=${encodeURIComponent(pathname)}`}
                                onClick={onClose}
                                className="flex items-center justify-between w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group border border-gray-100 dark:border-gray-700"
                            >
                                <div className="flex flex-col items-start">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {t('changePassword')}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {t('changePassword')}
                                    </span>
                                </div>
                                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 shadow-sm transition-colors">
                                    <KeyIcon className="w-5 h-5" />
                                </div>
                            </Link>
                        </div>

                        {/* Buttons */}
                        <div className="mt-8 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 transition-colors"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        {t('saving')}
                                    </>
                                ) : (
                                    t('saveChanges')
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
