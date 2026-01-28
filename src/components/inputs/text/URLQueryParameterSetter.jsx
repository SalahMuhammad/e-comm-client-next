'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'use-intl'

function URLQueryParameterSetter({ paramOptions, placeholder, allText }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const t = useTranslations()
    const [selectedParam, setSelectedParam] = useState(paramOptions[0]?.value || '')
    const [query, setQuery] = useState(searchParams.get(selectedParam) || '')
    const [isOpen, setIsOpen] = useState(false)
    const [isSelectOpen, setIsSelectOpen] = useState(false)

    const translatedAllText = allText ?? t('global.all')
    const translatedPlaceholder = placeholder ?? t('global.searchPlaceholder')

    const handleParamChange = (value) => {
        // Clear all other search parameters when switching
        const params = new URLSearchParams(Array.from(searchParams.entries()))

        // Remove all search-related parameters
        paramOptions.forEach(option => {
            if (option.value !== value) {
                params.delete(option.value)
            }
        })

        // Get the new value from URL if it exists
        const newQuery = searchParams.get(value) || ''
        setQuery(newQuery)

        // If the new parameter has a value, keep it, otherwise remove offset
        if (!newQuery) {
            params.delete('offset')
        }

        setSelectedParam(value)
        setIsOpen(false)

        // Update URL immediately to clear other search params
        router.replace(`?${params.toString()}`, { scroll: false })
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

    // Close select dropdown on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isSelectOpen) {
                setIsSelectOpen(false)
            }
        }

        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [isSelectOpen])

    const selectedOption = paramOptions.find(opt => opt.value === selectedParam)
    const inputType = selectedOption?.inputType || 'text' // Default to text for backward compatibility

    // Render the appropriate input based on inputType
    const renderInput = () => {
        if (inputType === 'date') {
            return (
                <input
                    type="date"
                    className="flex-1 pl-10 sm:pl-12 pr-8 sm:pr-10 py-3 sm:py-4 text-sm text-gray-900 dark:text-white bg-transparent border-0 rounded-l-xl focus:outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-200"
                    value={query}
                    onChange={handleQueryChange}
                />
            )
        } else if (inputType === 'select') {
            const selectedOption_value = selectedOption?.selectOptions?.find(opt => opt.value === searchParams.get(selectedParam))
            const displayValue = selectedOption_value?.label || ''

            return (
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value)
                            setIsSelectOpen(true)
                        }}
                        onFocus={() => setIsSelectOpen(true)}
                        placeholder={displayValue || translatedPlaceholder}
                        className="w-full pl-10 sm:pl-12 pr-8 sm:pr-10 py-3 sm:py-4 text-sm text-gray-900 dark:text-white bg-transparent border-0 rounded-l-xl focus:outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-200"
                    />

                    {isSelectOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-[9998]"
                                onClick={() => setIsSelectOpen(false)}
                            />
                            <div className="absolute left-0 top-full mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden z-[9999] max-h-60 overflow-y-auto">
                                <div className="p-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setQuery('')
                                            const params = new URLSearchParams(Array.from(searchParams.entries()))
                                            params.delete(selectedParam)
                                            params.delete('offset')
                                            router.replace(`?${params.toString()}`, { scroll: false })
                                            setIsSelectOpen(false)
                                        }}
                                        className={`w-full text-left px-3 py-2.5 text-sm rounded-md transition-all duration-200 ${!query
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        {translatedAllText}
                                    </button>
                                    {selectedOption?.selectOptions
                                        ?.filter(option => option.label.toLowerCase().includes(query.toLowerCase()))
                                        ?.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => {
                                                    setQuery('')
                                                    const params = new URLSearchParams(Array.from(searchParams.entries()))
                                                    params.set(selectedParam, option.value)
                                                    params.delete('offset')
                                                    router.replace(`?${params.toString()}`, { scroll: false })
                                                    setIsSelectOpen(false)
                                                }}
                                                className={`w-full text-left px-3 py-2.5 text-sm rounded-md transition-all duration-200 ${searchParams.get(selectedParam) === option.value
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>{option.label}</span>
                                                    {searchParams.get(selectedParam) === option.value && (
                                                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )
        } else {
            // Default text input
            return (
                <input
                    type="text"
                    className="flex-1 pl-10 sm:pl-12 pr-8 sm:pr-10 py-3 sm:py-4 text-sm text-gray-900 dark:text-white bg-transparent border-0 rounded-l-xl focus:outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-200"
                    placeholder={translatedPlaceholder}
                    value={query}
                    onChange={handleQueryChange}
                />
            )
        }
    }

    return (
        <form onSubmit={(e) => e.preventDefault()} className='pb-4'>
            <div className="relative">
                <div className="relative flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 focus-within:shadow-lg">

                    <div className="absolute left-3 sm:left-4 flex items-center pointer-events-none z-10">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {renderInput()}

                    {query && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery('')
                                const params = new URLSearchParams(Array.from(searchParams.entries()))
                                params.delete(selectedParam)
                                params.delete('offset')
                                router.replace(`?${params.toString()}`, { scroll: false })
                            }}
                            className="absolute right-20 sm:right-32 top-1/2 transform -translate-y-1/2 p-1 sm:p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                        >
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}

                    <div className="h-6 sm:h-8 w-px bg-gray-200 dark:bg-gray-600"></div>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                setIsSelectOpen(false)
                                setIsOpen(!isOpen)
                            }}
                            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-r-xl transition-all duration-200 min-w-[80px] sm:min-w-[120px] relative"
                        >
                            <span className="truncate max-w-[60px] sm:max-w-none w-[80%]">{selectedOption?.label}</span>
                            <svg
                                className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''} absolute right-3 top-1/2 -translate-y-1/2 `}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsOpen(false)}
                                />

                                <div className="absolute right-0 top-full mt-2 z-20 w-48 sm:w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden">
                                    <div className="p-1">
                                        {paramOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => handleParamChange(option.value)}
                                                className={`w-full text-left px-3 py-2.5 text-sm rounded-md transition-all duration-200 ${selectedParam === option.value
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>{option.label}</span>
                                                    {selectedParam === option.value && (
                                                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                    Searching by: <span className="font-medium text-gray-700 dark:text-gray-300">{selectedOption?.label}</span>
                </div> */}
            </div>
        </form>
    )
}

export default URLQueryParameterSetter