"use client";
import { useState, useEffect, useRef } from 'react';

export default function TableNote({ note }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (!note) return '-';

    return (
        <div
            ref={containerRef}
            className="relative group w-32"
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className="truncate cursor-help text-sm">
                {note}
            </div>
            {note && (
                <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs rounded shadow-lg border border-gray-200 dark:border-gray-700 z-50 whitespace-normal break-words pointer-events-none ${isOpen ? 'block' : 'hidden group-hover:block'}`}>
                    {note}
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white dark:border-t-gray-800"></div>
                </div>
            )}
        </div>
    );
}
