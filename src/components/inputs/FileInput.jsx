"use client";
import { useState, useRef, useEffect } from "react";
import {
    ArrowUpTrayIcon,
    DocumentIcon,
    XMarkIcon,
    ChevronDownIcon,
    PhotoIcon,
    DocumentTextIcon,
    MusicalNoteIcon,
    VideoCameraIcon,
    ArchiveBoxIcon
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

export default function FileUploadInput({
    className = "",
    name = "",
    id = "",
    placeholder,
    required = false,
    onChange = () => { },
    onBlur = () => { },
    error = "",
    acceptedTypes = "images", // "all", "images", "documents", "audio", "video", "archives"
    multiple = false,
    maxSize = 10 * 1024 * 1024, // 10MB default
    // state,
    defaultValue = [],
    showPreview = false,
    setLoadind = (e) => { },
    ...props
}) {

    const t = useTranslations("inputs.file")
    if (placeholder === undefined) {
        placeholder = t("upload");
    }

    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const fileInputRef = useRef(null);
    const hasError = Boolean(error);
    console.log('current input files: ', fileInputRef.current?.files)
    useEffect(() => {
        const handleDefaultValue = async () => {
            if (!Array.isArray(defaultValue) || defaultValue.length === 0) {
                setFiles([]);
                onChange([]);
                setLoadind(false);
                return;
            }

            setFiles([]);
            setLoadind(true);

            try {
                const fetchedFiles = await Promise.all(
                    defaultValue.map(async (obj) => {
                        try {
                            const response = await fetch(obj.img); // obj.img image url
                            if (!response.ok) throw new Error("Failed to fetch");
                            const blob = await response.blob();
                            const fileName = obj.img.split("/").pop();
                            return new File([blob], fileName, { type: blob.type });
                        } catch (err) {
                            return null;
                        }
                    })
                );

                const validFiles = fetchedFiles.filter((file) => file !== null);
                setInputFiles(validFiles, fileInputRef)
                setFiles(validFiles);
                onChange(validFiles);
            } catch (e) {
                setFiles([]);
                onChange([]);
            } finally {
                setLoadind(false);
            }
        };

        handleDefaultValue();
    }, [defaultValue]);

    const isAcceptedFileType = (file, accept) => {
        if (!accept || accept === '*/*') return true;
        const accepted = accept.split(',').map(type => type.trim());
        return accepted.some(type => {
            if (type.endsWith('/*')) {
                // Wildcard type (e.g., image/*)
                return file.type.startsWith(type.replace('/*', '/'));
            }
            // File extension (e.g., .pdf)
            if (type.startsWith('.')) {
                return file.name.toLowerCase().endsWith(type.toLowerCase());
            }
            // MIME type (e.g., application/pdf)
            return file.type === type;
        });
    };


    // File type categories
    const fileTypes = {
        all: { label: t("accepted.all"), value: "*/*", icon: <DocumentIcon className="w-8 h-8" /> },
        images: { label: t("accepted.images"), value: "image/*", icon: <PhotoIcon className="w-8 h-8" /> },
        documents: { label: t("accepted.documents"), value: ".pdf,.doc,.docx,.txt,.rtf,.odt", icon: <DocumentTextIcon className="w-4 h-4" /> },
        audio: { label: t("accepted.audio"), value: "audio/*", icon: <MusicalNoteIcon className="w-8 h-8" /> },
        video: { label: t("accepted.videos"), value: "video/*", icon: <VideoCameraIcon className="w-8 h-8" /> },
        archives: { label: t("accepted.archives"), value: ".zip,.rar,.7z,.tar,.gz", icon: <ArchiveBoxIcon className="w-4 h-4" /> },
    };

    // Get current file type based on acceptedTypes prop
    const currentType = fileTypes[acceptedTypes] || fileTypes.all;

    // Available types for dropdown (when acceptedTypes is "all")
    const availableTypes = Object.values(fileTypes);

    const [selectedType, setSelectedType] = useState(currentType);

    // Get file icon based on type
    const getFileIcon = (file) => {
        if (file.type.startsWith('image/')) return <PhotoIcon className="w-4 h-4" />;
        if (file.type.startsWith('audio/')) return <MusicalNoteIcon className="w-4 h-4" />;
        if (file.type.startsWith('video/')) return <VideoCameraIcon className="w-4 h-4" />;
        if (file.type.includes('pdf') || file.type.includes('document')) return <DocumentTextIcon className="w-4 h-4" />;
        if (file.type.includes('zip') || file.type.includes('rar') || file.type.includes('archive')) return <ArchiveBoxIcon className="w-4 h-4" />;
        return <DocumentIcon className="w-4 h-4" />;
    };

    const handleFileChange = (selectedFiles) => {
        const fileList = Array.from(selectedFiles);
        const validFiles = fileList.filter(file => {
            if (file.size > maxSize) return false;
            if (!isAcceptedFileType(file, selectedType.value)) return false;
            return true;
        });

        if (multiple) {
            const uniqueFiles = validFiles.filter(file => !files.some(f => f.name === file.name));
            setFiles(prev => {
                setInputFiles([...prev, ...uniqueFiles], fileInputRef)
                return [...prev, ...uniqueFiles]
            });
            onChange([...files, ...uniqueFiles]);
        } else {
            setFiles(validFiles);
            onChange(validFiles);
        }
    };


    // Handle drag events
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = e.dataTransfer.files;
        handleFileChange(droppedFiles);
    };

    // Remove file
    const removeFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index);

        setInputFiles(newFiles, fileInputRef)

        setFiles(newFiles);
        onChange(newFiles);
    };

    // Handle file type selection
    const handleTypeSelect = (type) => {
        setSelectedType(type);
        setIsDropdownOpen(false);
        if (fileInputRef.current) {
            fileInputRef.current.accept = type.value;
        }
    };

    // Determine colors based on state
    let borderColorClass = "border-gray-300 dark:border-gray-600";
    let iconColorClass = "text-gray-400 dark:text-gray-300";
    let labelColorClass = "text-gray-500 dark:text-gray-400";

    if (hasError && typeof error == "string") {
        borderColorClass = "border-red-500 dark:border-red-400";
        iconColorClass = "text-red-500 dark:text-red-400";
        labelColorClass = "text-red-500 dark:text-red-400";
    } else if (isFocused || isDragging) {
        borderColorClass = "border-blue-600 dark:border-blue-500";
        iconColorClass = "text-blue-600 dark:text-blue-500";
        labelColorClass = "text-blue-600 dark:text-blue-500";
    }

    const [previewFile, setPreviewFile] = useState(null);

    return (
        <div className={`relative w-full mb-5 ${className}`}>
            {/* File Type Dropdown - Only show if acceptedTypes is "all" */}
            {acceptedTypes === "all" && (
                <div className="relative mb-2">
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm bg-white dark:bg-gray-800 border rounded-lg ${borderColorClass} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
                    >
                        <div className="flex items-center gap-2">
                            <span className={iconColorClass}>{selectedType.icon}</span>
                            <span className="text-gray-900 dark:text-white">{selectedType.label}</span>
                        </div>
                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''} ${iconColorClass}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                            {availableTypes.map((type, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleTypeSelect(type)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
                                >
                                    <span className="text-gray-400 dark:text-gray-300">{type.icon}</span>
                                    <span className="text-gray-900 dark:text-white">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Upload Area */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          relative cursor-pointer border-2 border-dashed rounded-lg p-6 transition-all
          ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : borderColorClass}
          ${isFocused ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-800'}
          hover:bg-gray-100 dark:hover:bg-gray-700
        `}
            >
                {/* Upload Icon - Use the icon based on selected type */}
                <div className={`flex flex-col items-center justify-center ${iconColorClass}`}>
                    <div className="mb-3">
                        {acceptedTypes === "all" ? (
                            <ArrowUpTrayIcon className="w-8 h-8" />
                        ) : (
                            <div className="flex items-center gap-2">
                                {/* <ArrowUpTrayIcon className="w-6 h-6" />
                <span className="text-2xl">{currentType.icon}</span> */}
                                {currentType.icon}
                            </div>
                        )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {placeholder}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t("browse")}
                    </p>
                    {acceptedTypes !== "all" && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {currentType.label} {t("only")}
                        </p>
                    )}
                </div>

                {/* Hidden File Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    name={name}
                    id={id}
                    accept={selectedType.value}
                    multiple={multiple}
                    required={required}
                    onChange={(e) => handleFileChange(e.target.files)}
                    onBlur={(e) => {
                        setIsFocused(false);
                        onBlur(e);
                    }}
                    onFocus={() => setIsFocused(true)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    {...props}
                />
            </div>

            {/* Selected Files */}
            {files.length > 0 && (
                <div className="mt-3 space-y-2">
                    {files.map((file, index) => {
                        const isErrorObject = error && typeof error === "object"
                        const errorMessages = isErrorObject ? error[String(index)] : null;

                        return (
                            <div
                                key={index}
                                className={`relative ${hasError && "pb-6"} transition-[padding] duration-[200ms]`}
                            >

                                <div
                                    className={`flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 
                          ${errorMessages && "border-red-500 dark:border-red-400"}`}
                                >
                                    <div className="text-gray-400 dark:text-gray-300">
                                        {getFileIcon(file)}
                                    </div>
                                    {showPreview && file.type.startsWith("image/") && (
                                        <button
                                            type="button"
                                            onClick={() => setPreviewFile(file)}
                                            className="relative group w-[80px] h-[80px]"
                                        >
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={file.name}
                                                className="rounded border border-gray-300 dark:border-gray-600 w-full h-full object-cover group-hover:opacity-80 transition"
                                            />
                                            <div className="rounded absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                                                <p className="text-xs text-white text-center px-1">{t("preview")}</p>
                                            </div>
                                        </button>
                                    )}

                                    {/* file name & file size */}
                                    <FileInfo file={file} errorMessages={errorMessages} />
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                    >
                                        <XMarkIcon className="w-4 h-4" />
                                    </button>

                                </div>
                                {errorMessages && (
                                    <p className="absolute bottom-0 text-sm text-red-600 dark:text-red-400">{errorMessages}</p>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Floating Label */}
            <label
                htmlFor={id}
                className={`
          absolute text-xs font-medium duration-300 transform -translate-y-8 scale-75 top-2 -z-10 origin-[0]
          ${files.length > 0 || isFocused ? 'opacity-100' : 'opacity-0'}
          ${labelColorClass}
        `}
            >
                {selectedType.label}
            </label>

            {/* Error Text */}
            <div className={`${(hasError && typeof error == "string") && "min-h-[1.25rem] mt-1"} transition-all duration-[200ms]`}>
                {(hasError && typeof error == "string") && (
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
            </div>

            <ImagePreview setPreviewFile={setPreviewFile} file={previewFile} />

        </div>
    );
}


const ImagePreview = ({ setPreviewFile, file }) => (
    file && (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={() => setPreviewFile(null)} // close when clicking outside
        >
            <div
                className="relative bg-white dark:bg-gray-900 p-4 rounded-xl shadow-2xl max-w-[90vw] max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()} // prevent modal from closing when clicking inside
            >
                {/* Image with filename overlay */}
                <div className="relative z-0">
                    <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="max-w-full max-h-[75vh] rounded-lg object-contain"
                    />

                    <div className="absolute bottom-2 left-2 right-2 px-3 py-1 text-xs text-white bg-black/50 backdrop-blur-sm rounded shadow-inner text-center">
                        {file.name}
                    </div>
                </div>

                {/* Close button */}
                <button
                    onClick={() => setPreviewFile(null)}
                    className="absolute top-3 right-3 z-10 text-gray-400 hover:text-red-500 transition"
                    title="Close"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    )
)

const FileInfo = ({ file, errorMessages }) => {
    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${errorMessages ? "text-red-500 dark:text-red-400" : "text-gray-900 dark:text-white"}`}>
                {file.name}
            </p>
            <p className={`text-xs text-gray-500 dark:text-gray-400`}>
                {formatFileSize(file.size)}
            </p>
        </div>
    )
}

const setInputFiles = (files, fileInputRef) => {
    const dataTransfer = new DataTransfer();
    files.forEach(file => dataTransfer.items.add(file));
    fileInputRef.current.files = dataTransfer.files;
}
