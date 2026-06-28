import { XMarkIcon } from "@heroicons/react/24/outline";


const ImagePreview = ({ file, onClose }) => {
    if (!file) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="relative max-w-4xl w-full max-h-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
                <img src={URL.createObjectURL(file)} className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" alt="" />
                <button onClick={onClose} className="absolute -top-10 right-0 text-white hover:text-red-400"><XMarkIcon className="w-8 h-8" /></button>
                <p className="mt-4 text-white text-sm font-light bg-black/20 px-4 py-1 rounded-full">{file.name}</p>
            </div>
        </div>
    );
};

export default ImagePreview
