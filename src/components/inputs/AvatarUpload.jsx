"use client";

import { useState, useRef, useEffect } from 'react';
import { CameraIcon, TrashIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import UserAvatar from '@/components/UserAvatar';

export default function AvatarUpload({
    user, // { username, avatar }
    name = "avatar",
    removeName = "remove_avatar",
    text = {
        clickToUpload: "Click or drag to upload",
        remove: "Remove photo",
        dragActive: "Drop image here"
    },
    onChange, // (file) => void
    onRemove, // () => void
    className = ""
}) {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isRemoved, setIsRemoved] = useState(false);
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef(null);

    // If user changes externally (e.g. form reset), reset local state
    useEffect(() => {
        if (!previewUrl && !isRemoved) {
            // Reset state if needed when user prop changes specifically? 
            // actually we just rely on parent to remount or we keep internal state consistent
        }
    }, [user]);

    const handleFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setIsRemoved(false);
            if (onChange) onChange(file);

            // Should we update the input manually if it came from drop?
            // For standard HTML form submission to work with dropped files, 
            // we need to set the input files property.
            if (fileInputRef.current) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInputRef.current.files = dataTransfer.files;
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        handleFile(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragActive(true);
        } else if (e.type === "dragleave") {
            setIsDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleRemove = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setPreviewUrl(null);
        setIsRemoved(true);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (onChange) onChange(null);
        if (onRemove) onRemove();
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const showPreview = previewUrl || (!isRemoved && user?.avatar);

    return (
        <div className={`flex flex-col items-center ${className}`}>
            <div
                className={`relative group cursor-pointer transition-all duration-200 ease-in-out
                    ${isDragActive ? 'scale-105' : ''}`}
                onClick={handleClick}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {/* Avatar Container */}
                <div className={`w-28 h-28 rounded-full overflow-hidden border-4 transition-colors relative
                    ${isDragActive
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-100 dark:border-gray-700'
                    }`}>

                    {showPreview ? (
                        previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <UserAvatar
                                username={user?.username}
                                imageUrl={user?.avatar}
                                className={`w-full h-full text-4xl`}
                            />
                        )
                    ) : (
                        <UserAvatar
                            username={user?.username || "?"}
                            className={`w-full h-full text-4xl opacity-50`}
                        />
                    )}

                    {/* Overlay */}
                    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-200
                        ${isDragActive ? 'bg-blue-500/20 opacity-100' : 'bg-black/40 opacity-0 group-hover:opacity-100'}`}>
                        {isDragActive ? (
                            <ArrowUpTrayIcon className="w-8 h-8 text-blue-500 font-bold" />
                        ) : (
                            <CameraIcon className="w-8 h-8 text-white" />
                        )}
                    </div>
                </div>

                {/* Remove Button */}
                {showPreview && (
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute 0 bottom-0 right-0 bg-white dark:bg-gray-800 text-red-500 border border-gray-200 dark:border-gray-600 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm z-20 group/remove"
                        title={text.remove}
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Hidden Inputs */}
            <input
                type="file"
                name={name}
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />
            {isRemoved && (
                <input type="hidden" name={removeName} value="true" />
            )}

            {/* Helper Text */}
            <p className={`mt-3 text-sm transition-colors ${isDragActive ? 'text-blue-500 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                {isDragActive ? text.dragActive : text.clickToUpload}
            </p>
        </div>
    );
}
