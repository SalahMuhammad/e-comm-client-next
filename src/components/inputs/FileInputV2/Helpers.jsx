import {
    DocumentIcon,
    PhotoIcon,
    DocumentTextIcon,
    MusicalNoteIcon,
    VideoCameraIcon,
    ArchiveBoxIcon
} from "@heroicons/react/24/outline";


export const getFileIcon = (file) => {
    const type = file.type || "";
    
    if (type.startsWith('image/')) return <PhotoIcon className="w-4 h-4" />;
    if (type.startsWith('audio/')) return <MusicalNoteIcon className="w-4 h-4" />;
    if (type.startsWith('video/')) return <VideoCameraIcon className="w-4 h-4" />;
    if (type.includes('pdf') || type.includes('document')) return <DocumentTextIcon className="w-4 h-4" />;
    if (type.includes('zip') || type.includes('rar') || type.includes('archive')) return <ArchiveBoxIcon className="w-4 h-4" />;
    return <DocumentIcon className="w-4 h-4" />;
};

export const isAcceptedFileType = (file, accept) => {
    if (!accept || accept === '*/*') return true;
    return accept.split(',').some(type => {
        const t = type.trim();
        if (t.endsWith('/*')) return file.type.startsWith(t.replace('/*', '/'));
        if (t.startsWith('.')) return file.name.toLowerCase().endsWith(t.toLowerCase());
        return file.type === t;
    });
};

export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + ['B', 'KB', 'MB', 'GB'][i];
};

export const getFileTypes = (t) => ({
    all: { label: t("accepted.all"), value: "*/*", icon: <DocumentIcon className="w-8 h-8" /> },
    images: { label: t("accepted.images"), value: "image/*", icon: <PhotoIcon className="w-8 h-8" /> },
    documents: { label: t("accepted.documents"), value: ".pdf,.doc,.docx,.txt,.rtf,.odt", icon: <DocumentTextIcon className="w-4 h-4" /> },
    audio: { label: t("accepted.audio"), value: "audio/*", icon: <MusicalNoteIcon className="w-8 h-8" /> },
    video: { label: t("accepted.videos"), value: "video/*", icon: <VideoCameraIcon className="w-8 h-8" /> },
    archives: { label: t("accepted.archives"), value: ".zip,.rar,.7z,.tar,.gz", icon: <ArchiveBoxIcon className="w-4 h-4" /> },
})
