'use client'
import { useState, useEffect } from 'react'

import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline'

function Gallery({ className = "w-full max-w-4xl mx-auto", images, autoplay = false, autoplayInterval = 5000, onClick = () => { } }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isAutoPlay, setIsAutoPlay] = useState(autoplay)

    useEffect(() => {
        if (!images || images.length === 0 || !isAutoPlay) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length)
        }, autoplayInterval)

        return () => clearInterval(interval)
    }, [images, isAutoPlay, autoplayInterval])

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    // Handle keyboard navigation in modal
    useEffect(() => {
        if (!isModalOpen) return

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeModal()
            if (e.key === 'ArrowLeft') modalPrevious()
            if (e.key === 'ArrowRight') modalNext()
        }

        window.addEventListener('keydown', handleKeyDown)
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden'

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'unset'
        }
    }, [isModalOpen, images.length])

    if (!images || images.length === 0) {
        return null
    }

    return (
        <>
            {/* Main Gallery */}
            <div className={`relative ${className}`}>
                {/* Carousel Container */}
                <div className="relative h-64 md:h-96 lg:h-[12rem] overflow-hidden rounded-sm bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-2xl">
                    <div className="absolute top-2 right-3 z-10 px-3 py-1 rounded-sm bg-black/50 dark:bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
                        {currentIndex + 1} / {images.length}
                    </div>
                    {/* Images */}
                    {images.map((src, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${index === currentIndex
                                ? 'opacity-100 scale-100'
                                : 'opacity-0 scale-105'
                                }`}
                        >
                            <img
                                src={src.img}
                                alt={`Gallery image ${index + 1}`}
                                className="w-full h-full object-cover rounded-sm cursor-pointer hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                            />
                            {/* Gradient overlay for better button visibility */}
                            <div onClick={() => onClick(currentIndex)} className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 dark:from-black/20 dark:to-black/20"></div>
                        </div>
                    ))}
                </div>

                {/* Auto-play Toggle Button */}
                {/* {images.length > 1 && (
                    <button
                        onClick={toggleAutoPlay}
                        className="absolute top-4 right-4 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110 group"
                        aria-label={isAutoPlay ? "Pause autoplay" : "Start autoplay"}
                        title={isAutoPlay ? "Pause autoplay" : "Start autoplay"}
                    >
                        {isAutoPlay ? (
                        <PauseIcon className="w-5 h-5 text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                        ) : (
                        <PlayIcon className="w-5 h-5 text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                        )}
                    </button>
                )} */}

                {/* Navigation Buttons */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110 group"
                            aria-label="Previous image"
                        >
                            <ChevronLeftIcon className="w-6 h-6 text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                        </button>

                        <button
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110 group"
                            aria-label="Next image"
                        >
                            <ChevronRightIcon className="w-6 h-6 text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                        </button>
                    </>
                )}

                {/* Dots Indicator
                {images.length > 1 && (
                <div className="flex justify-center space-x-2 mt-6">
                    {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentIndex
                            ? 'bg-blue-500 dark:bg-blue-400 scale-125'
                            : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                    />
                    ))}
                </div>
                )} */}
            </div>

        </>
    )
}
export default Gallery