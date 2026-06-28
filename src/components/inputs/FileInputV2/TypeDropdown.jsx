import { ChevronDownIcon } from "@heroicons/react/24/outline";


const TypeDropdown = ({ isOpen, setOpen, selected, onSelect, available, colors }) => (
    <div className="relative mb-2">
        <button
            type="button"
            onClick={() => setOpen(!isOpen)}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm bg-white dark:bg-gray-800 border rounded-lg transition-colors
                ${colors.hasError ? 'border-red-500' : colors.borderColor} ${colors.textColor}`}
        >
            <div className="flex items-center gap-2">
                <span className="opacity-70 scale-75">{selected.icon}</span>
                <span>{selected.label}</span>
            </div>
            <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
            <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl">
                {available.map((type, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => onSelect(type)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                    >
                        <span className="opacity-50 scale-75">{type.icon}</span>
                        <span className={colors.textColor}>{type.label}</span>
                    </button>
                ))}
            </div>
        )}
    </div>
);

export default TypeDropdown
