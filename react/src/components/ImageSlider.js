import React, { useState, useEffect, useCallback } from 'react';
import './ImageSlider.css';

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const hasImages = images && images.length > 0;
  const imageCount = hasImages ? images.length : 0;

  const goToNext = useCallback(() => {
    if (hasImages) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageCount);
    }
  }, [hasImages, imageCount]);

  const goToPrevious = useCallback(() => {
    if (hasImages) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + imageCount) % imageCount);
    }
  }, [hasImages, imageCount]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const openLightbox = () => {
    setIsLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLightboxOpen) {
        if (e.key === 'Escape') {
          closeLightbox();
        } else if (e.key === 'ArrowLeft') {
          goToPrevious();
        } else if (e.key === 'ArrowRight') {
          goToNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, closeLightbox, goToPrevious, goToNext]);

  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      if (touchStartX - touchEndX > 50) {
        goToNext();
      }
      if (touchEndX - touchStartX > 50) {
        goToPrevious();
      }
    };

    const sliderElement = document.querySelector('.image-slider');
    if (sliderElement) {
      sliderElement.addEventListener('touchstart', handleTouchStart);
      sliderElement.addEventListener('touchend', handleTouchEnd);

      return () => {
        sliderElement.removeEventListener('touchstart', handleTouchStart);
        sliderElement.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [goToNext, goToPrevious]);

  if (!hasImages) {
    return (
      <div data-easytag="id1-react/src/components/ImageSlider.js" className="image-slider-placeholder">
        <div data-easytag="id2-react/src/components/ImageSlider.js" className="placeholder-content">
          <svg data-easytag="id3-react/src/components/ImageSlider.js" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <p data-easytag="id4-react/src/components/ImageSlider.js">Нет изображений</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div data-easytag="id5-react/src/components/ImageSlider.js" className="image-slider">
        <div data-easytag="id6-react/src/components/ImageSlider.js" className="slider-main-image">
          <img
            data-easytag="id7-react/src/components/ImageSlider.js"
            src={images[currentIndex].image_url}
            alt={`Изображение ${currentIndex + 1}`}
            onClick={openLightbox}
          />
          {imageCount > 1 && (
            <>
              <button
                data-easytag="id8-react/src/components/ImageSlider.js"
                className="slider-arrow slider-arrow-left"
                onClick={goToPrevious}
                aria-label="Предыдущее изображение"
              >
                ‹
              </button>
              <button
                data-easytag="id9-react/src/components/ImageSlider.js"
                className="slider-arrow slider-arrow-right"
                onClick={goToNext}
                aria-label="Следующее изображение"
              >
                ›
              </button>
            </>
          )}
          <div data-easytag="id10-react/src/components/ImageSlider.js" className="image-counter">
            {currentIndex + 1} / {imageCount}
          </div>
        </div>

        {imageCount > 1 && (
          <div data-easytag="id11-react/src/components/ImageSlider.js" className="slider-thumbnails">
            {images.map((image, index) => (
              <div
                key={image.id}
                data-easytag="id12-react/src/components/ImageSlider.js"
                className={`thumbnail ${index === currentIndex ? 'thumbnail-active' : ''}`}
                onClick={() => goToSlide(index)}
              >
                <img
                  data-easytag="id13-react/src/components/ImageSlider.js"
                  src={image.image_url}
                  alt={`Миниатюра ${index + 1}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {isLightboxOpen && (
        <div data-easytag="id14-react/src/components/ImageSlider.js" className="lightbox" onClick={closeLightbox}>
          <div data-easytag="id15-react/src/components/ImageSlider.js" className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              data-easytag="id16-react/src/components/ImageSlider.js"
              className="lightbox-close"
              onClick={closeLightbox}
              aria-label="Закрыть"
            >
              ✕
            </button>
            <img
              data-easytag="id17-react/src/components/ImageSlider.js"
              src={images[currentIndex].image_url}
              alt={`Изображение ${currentIndex + 1}`}
            />
            {imageCount > 1 && (
              <>
                <button
                  data-easytag="id18-react/src/components/ImageSlider.js"
                  className="lightbox-arrow lightbox-arrow-left"
                  onClick={goToPrevious}
                  aria-label="Предыдущее изображение"
                >
                  ‹
                </button>
                <button
                  data-easytag="id19-react/src/components/ImageSlider.js"
                  className="lightbox-arrow lightbox-arrow-right"
                  onClick={goToNext}
                  aria-label="Следующее изображение"
                >
                  ›
                </button>
              </>
            )}
            <div data-easytag="id20-react/src/components/ImageSlider.js" className="lightbox-counter">
              {currentIndex + 1} / {imageCount}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageSlider;