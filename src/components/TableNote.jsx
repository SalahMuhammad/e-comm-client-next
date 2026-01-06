
export default function TableNote({ note }) {
    if (!note) return '-';

    return (
        <div className="relative group w-32">
            <div className="truncate cursor-help text-sm">
                {note}
            </div>
            {note && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs rounded shadow-lg border border-gray-200 dark:border-gray-700 z-50 whitespace-normal break-words pointer-events-none">
                    {note}
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white dark:border-t-gray-800"></div>
                </div>
            )}
        </div>
    );
}
