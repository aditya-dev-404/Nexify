import React from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useState } from 'react';

function ImagesCarousel({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images.length) return null;

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
    <div className="relative w-full md:max-w-[420px] lg:max-w-[480px] md:mx-auto aspect-square overflow-hidden rounded-2xl bg-[var(--text)]">
      {/* Current image */}
      <img
        src={images[currentIndex].url}
        alt={`post-${currentIndex}`}
        className="w-full h-full object-cover"
      />

      {/* Left arrow — hidden on first image */}
      {currentIndex > 0 && (
        <button
          onClick={goToPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-[var(--surface)] hover:text-[var(--primary)] rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)] text-[var(--text-muted)] transition active:scale-[0.96]"
        >
          <FaChevronLeft className="text-xs sm:text-sm" />
        </button>
      )}

      {/* Right arrow — hidden on last image */}
      {currentIndex < images.length - 1 && (
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-[var(--surface)] hover:text-[var(--primary)] rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)] text-[var(--text-muted)] transition active:scale-[0.96]"
        >
          <FaChevronRight className="text-xs sm:text-sm" />
        </button>
      )}

      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition ${
                i === currentIndex ? 'bg-[var(--surface-light)]' : 'bg-[var(--surface-light)]/40'
              }`}
            />
          ))}
        </div>
      )}
</div>
</>
  );
}

export default ImagesCarousel