"use client";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react';

export default function ImageView({ images, onClose, startIndex = 0 }) {
  const [modalImageIndex, setModalImageIndex] = useState(startIndex)
  useEffect(() => {
    setModalImageIndex(startIndex)
  }, [startIndex])
  const modalPrevious = () => {
    setModalImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }
  
  const modalNext = () => {
    setModalImageIndex((prev) => (prev + 1) % images.length)
  }
  
  const closeModal = () => {
    if (onClose) {
      onClose();
    }
  }
  
  if(images.length == 0) return

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-md">
      <div
        className="absolute inset-0 flex items-center justify-center p-4"
        onClick={closeModal}
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-[10000] flex items-center justify-center w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 text-white hover:scale-110"
          aria-label="Close modal"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        
        {/* Modal Content */}
        <div
          className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center group"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Image */}
          <img
            src={images[modalImageIndex].img}
            alt={`Gallery image ${modalImageIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
          
          {/* Modal Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={modalPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 text-white hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeftIcon className="w-8 h-8" />
              </button>
              <button
                onClick={modalNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 text-white hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRightIcon className="w-8 h-8" />
              </button>
            </>
          )}
          
          {/* Modal Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/70 backdrop-blur-sm text-white text-sm font-medium transition-opacity duration-300 group-hover:opacity-0">
            {modalImageIndex + 1} / {images.length}
          </div>
        </div>
      </div>
    </div>
  )
}