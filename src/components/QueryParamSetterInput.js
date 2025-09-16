'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function SearchInput({ paramOptions, placeholder = 'Search ...' }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [selectedParam, setSelectedParam] = useState(paramOptions[0]?.value || '')
    const [query, setQuery] = useState(searchParams.get(selectedParam) || '')
    const [isOpen, setIsOpen] = useState(false)

    const handleParamChange = (value) => {
        setSelectedParam(value)
        setQuery(searchParams.get(value) || '')
        setIsOpen(false)
    }

    const handleQueryChange = (e) => {
        const value = e.target.value
        setQuery(value)
        const params = new URLSearchParams(Array.from(searchParams.entries()))
        if (value) {
            params.set(selectedParam, value)
        } else {
            params.delete(selectedParam)
        }
        params.delete('offset')
        router.replace(`?${params.toString()}`, { scroll: false })
    }

    return (
        <form onSubmit={(e) => e.preventDefault()} className='pb-4'>
            <div className="flex flex-col gap-3 relative">
                {/* Search Label and Dropdown Trigger */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Search by:
                    </span>
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <span>{paramOptions.find(opt => opt.value === selectedParam)?.label}</span>
                        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute top-8 left-0 z-10 w-48 bg-white rounded-md shadow-lg dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                            <div className="py-1">
                                {paramOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handleParamChange(option.value)}
                                        className={`${
                                            selectedParam === option.value 
                                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
                                                : 'text-gray-700 dark:text-gray-200'
                                        } group flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Search Input */}
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input
                        type="search"
                        id="default-search"
                        className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder={placeholder}
                        value={query}
                        onChange={handleQueryChange}
                    />
                </div>
            </div>
        </form>
    )
}

export default SearchInput