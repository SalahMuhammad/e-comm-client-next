import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { formatFileSize, getFileIcon } from "./Helpers";


const FileRow = ({ file, index, error, canDelete, showPreview, onRemove, onPreview, t }) => {
    const isErrorObject = error && typeof error === "object";
    const msg = isErrorObject ? error[String(index)]?.['img'] : null;

    return (
        <div className="relative">
            <div className={`flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800/40 rounded-lg border 
                ${msg ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
            >
                <div className="text-gray-400 shrink-0">{getFileIcon(file)}</div>
                
                {showPreview && file.type?.startsWith("image/") && (
                    <div onClick={() => onPreview(file)} className="relative w-10 h-10 shrink-0 cursor-pointer group">
                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded border dark:border-gray-600" alt="" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded">
                            <PhotoIcon className="w-4 h-4 text-white" />
                        </div>
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${msg ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>{file.name}</p>
                    <p className="text-[10px] text-gray-500 uppercase">{formatFileSize(file.size)}</p>
                </div>

                {canDelete && (
                    <button type="button" onClick={() => onRemove(index)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                )}
            </div>
            {msg && <p className="text-[11px] text-red-500 mt-0.5 ml-1">{msg}</p>}
        </div>
    );
};

export default FileRow
