"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
    ArrowUpTrayIcon,
    DocumentIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { getFileTypes, isAcceptedFileType} from "./Helpers";
import FileRow from "./FileRow";
import TypeDropdown from "./TypeDropdown";
import ImagePreview from "./ImagePreview";


export default function FileUploadInput({ error = "", appearance = {}, ...props }) {
    // Style Destructuring
    const {
        textColor           = dTextColor,
        borderColor         = dBorderColor,
        focusColor          = dFocusColor,
        labelColor          = dLabelColor,
        focusLabelColor     = dFocusLabelColor,
        errorColor          = dErrorColor,
        containerCSSClasses = "",
        labelCSSClass       = "",
    } = appearance;

    // Logic Props Destructuring
    const {
        id             = "",
        name           = "",
        placeholder    = "",
        required       = false,
        onChange       = () => { },
        onBlur         = () => { },
        acceptedTypes  = "images", // "all", "images", "documents", "audio", "video", "archives"
        multiple       = false,
        maxSize        = 10 * 1024 * 1024,
        defaultValue   = [],
        showPreview    = false,
        setLoadind     = () => { }, // Keeping original typo for compatibility
        canAdd         = true,
        canDelete      = true,
        ...restInputProps
    } = props;

    const t = useTranslations("inputs.file");
    const labelText = placeholder ?? t("upload");

    // State & Refs
    const [newFiles, setNewFiles] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [existingImageIds, setExistingImageIds] = useState([]);
    const [validationError, setValidationError] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);
    
    const fileInputRef = useRef(null);
    const hasInitialized = useRef(false);
    const hasUserInteracted = useRef(false);
    const hasError = Boolean(error || validationError);

    const allFiles = [...existingImages, ...newFiles];

    // File Type Mapping
    const fileTypes = useMemo(() => getFileTypes(t), [t]); 

    const currentType = Array.isArray(acceptedTypes)
        ? { label: acceptedTypes.map(t => t.label).join(', '), value: acceptedTypes.map(t => t.value).join(','), icon: <DocumentIcon className="w-8 h-8" /> }
        : (fileTypes[acceptedTypes] || fileTypes.all);

    const [selectedType, setSelectedType] = useState(currentType);

    // --- Effects ---
    
    useEffect(() => {
        if (fileInputRef.current) {
            const dataTransfer = new DataTransfer();
            newFiles.forEach(file => dataTransfer.items.add(file));
            fileInputRef.current.files = dataTransfer.files;
        }
    }, [newFiles]);

    useEffect(() => {
        const handleDefaultValue = async () => {
            if (hasInitialized.current) return;
            if (!Array.isArray(defaultValue) || defaultValue.length === 0) {
                setLoadind(false);
                hasInitialized.current = true;
                return;
            }

            setLoadind(true);
            try {
                const fetchedImages = [];
                const extractedIds = [];

                await Promise.all(defaultValue.map(async (obj) => {
                    try {
                        const response = await fetch(obj.img);
                        if (!response.ok) throw new Error();
                        const blob = await response.blob();
                        const fileName = obj.img.split("/").pop();
                        const file = new File([blob], fileName, { type: blob.type });
                        fetchedImages.push(file);
                        extractedIds.push(obj.id || parseInt(obj.img.split('/').find(part => /^\d+$/.test(part))));
                    } catch (err) { /* silent fail */ }
                }));

                const validIds = extractedIds.filter(id => id != null);
                setExistingImages(fetchedImages.filter(Boolean));
                setExistingImageIds(validIds);
                onChange({ newFiles: [], existingIds: validIds, hasChanges: false });
            } finally {
                setLoadind(false);
                hasInitialized.current = true;
            }
        };
        handleDefaultValue();
    }, [defaultValue]);

    // --- Handlers ---
    const handleFileChange = useCallback((selectedFiles) => {
        setValidationError("");
        const fileList = Array.from(selectedFiles);
        const validFiles = [];
        let errorFound = "";

        for (const file of fileList) {
            if (file.size > maxSize) {
                errorFound = t("errors.tooLarge"); // "File exceeds 10MB"
                continue;
            }
            if (!isAcceptedFileType(file, selectedType.value)) {
                errorFound = t("errors.invalidType");
                continue;
            }
            validFiles.push(file);
        }

        if (errorFound) setValidationError(errorFound);

        if (multiple) {
            const uniqueFiles = validFiles.filter(file => 
                !allFiles.some(f => f.name === file.name && f.size === file.size)
            );
            const updated = [...newFiles, ...uniqueFiles];
            setNewFiles(updated);
            onChange({ newFiles: updated, existingIds: existingImageIds, hasChanges: true });
        } else if (validFiles.length > 0) {
            setNewFiles([validFiles[0]]);
            setExistingImages([]);
            setExistingImageIds([]);
            onChange({ newFiles: [validFiles[0]], existingIds: [], hasChanges: true });
        }
    }, [maxSize, multiple, newFiles, existingImageIds, allFiles, selectedType.value, onChange, t]);

    const removeFile = (index) => {
        hasUserInteracted.current = true;
        const totalExisting = existingImages.length;
        if (index < totalExisting) {
            const newIds = existingImageIds.filter((_, i) => i !== index);
            setExistingImages(existingImages.filter((_, i) => i !== index));
            setExistingImageIds(newIds);
            onChange({ newFiles, existingIds: newIds, hasChanges: true });
        } else {
            const updated = newFiles.filter((_, i) => i !== (index - totalExisting));
            setNewFiles(updated);
            onChange({ newFiles: updated, existingIds: existingImageIds, hasChanges: true });
        }
    };

    return (
        <div className={`relative w-full mb-1 ${containerCSSClasses}`}>
            {/* Type Dropdown */}
            {acceptedTypes === "all" && (
                <TypeDropdown 
                    isOpen={isDropdownOpen}
                    setOpen={setIsDropdownOpen}
                    selected={selectedType}
                    onSelect={(type) => { setSelectedType(type); setIsDropdownOpen(false); }}
                    available={Object.values(fileTypes)}
                    colors={{ borderColor, textColor, errorColor, hasError }}
                />
            )}

            {/* Upload Area */}
            {canAdd && (
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileChange(e.dataTransfer.files); }}
                    className={`
                        relative cursor-pointer border-2 border-dashed rounded-lg p-6 transition-all
                        ${isDragging || isFocused ? 'bg-blue-50 dark:bg-blue-900/10' : 'bg-gray-50/50 dark:bg-gray-800/50'}
                        ${hasError ? 'border-red-500' : isFocused || isDragging ? 'border-blue-600' : borderColor}
                        hover:bg-gray-100 dark:hover:bg-gray-700/50
                    `}
                >
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className={`mb-2 ${hasError ? 'text-red-500' : isFocused ? 'text-blue-600' : 'text-gray-400'}`}>
                            {acceptedTypes === "all" ? <ArrowUpTrayIcon className="w-8 h-8" /> : selectedType.icon}
                        </div>
                        <p className={`text-sm font-medium ${textColor}`}>{labelText}</p>
                        <p className="text-xs text-gray-500 mt-1">{t("browse")}</p>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        id={id}
                        name={name}
                        multiple={multiple}
                        required={required}
                        accept={selectedType.value}
                        onChange={(e) => handleFileChange(e.target.files)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={(e) => { setIsFocused(false); onBlur(e); }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        {...restInputProps}
                    />
                </div>
            )}

            {/* Floating Label (Consistency with NumberInput) */}
            <label
                className={`absolute text-xs font-medium duration-300 transform -translate-y-7 scale-75 top-2 -z-10 origin-[0]
                    ${allFiles.length > 0 || isFocused ? 'opacity-100' : 'opacity-0'}
                    ${hasError ? errorColor : isFocused ? focusLabelColor : labelColor} ${labelCSSClass}
                `}
            >
                {selectedType.label}
            </label>

            {/* File List */}
            {allFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                    {allFiles.map((file, idx) => (
                        <FileRow 
                            key={idx} 
                            file={file} 
                            index={idx}
                            error={error}
                            canDelete={canDelete}
                            showPreview={showPreview}
                            onRemove={removeFile}
                            onPreview={setPreviewFile}
                            t={t}
                        />
                    ))}
                </div>
            )}

            {/* Error Message Display */}
            {(error || validationError) && (
                <div className="min-h-[1.25rem] mt-1 animate-in fade-in slide-in-from-top-1">
                    <p className={`text-sm ${errorColor}`}>{error || validationError}</p>
                </div>
            )}

            <ImagePreview file={previewFile} onClose={() => setPreviewFile(null)} />
        </div>
    );
}

// --- Defaults ---
const dTextColor = "text-gray-900 dark:text-white";
const dBorderColor = "border-gray-300 dark:border-gray-600";
const dFocusColor = "focus:border-blue-600 dark:focus:border-blue-500";
const dLabelColor = "text-gray-500 dark:text-gray-400";
const dFocusLabelColor = "text-blue-600 dark:text-blue-500";
const dErrorColor = "text-red-500 dark:text-red-400";
