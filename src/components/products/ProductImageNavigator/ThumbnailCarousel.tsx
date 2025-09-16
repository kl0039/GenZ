
import React from 'react';

interface ThumbnailCarouselProps {
  images: string[];
  productName: string;
  currentIndex: number;
  onSelect: (index: number) => void;
}

const ThumbnailCarousel: React.FC<ThumbnailCarouselProps> = ({ 
  images, 
  productName, 
  currentIndex, 
  onSelect 
}) => {
  // Only render if we have more than one unique image
  const uniqueImagesCount = new Set(images).size;
  if (uniqueImagesCount <= 1) return null;
  
  console.log("Rendering carousel with images:", images);
  
  return (
    <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
      <div className="flex overflow-x-auto space-x-2 py-2 scrollbar-hide">
        {images.map((imgSrc, idx) => (
          <div 
            key={idx} 
            className={`cursor-pointer border-2 rounded flex-shrink-0 w-16 h-16 ${
              idx === currentIndex ? 'border-primary ring-1 ring-primary' : 'border-transparent hover:border-gray-300'
            }`}
            onClick={() => onSelect(idx)}
          >
            <img 
              src={imgSrc} 
              alt={`${productName} thumbnail ${idx + 1}`} 
              className="w-full h-full object-contain p-1" 
              onError={(e) => {
                console.log(`Error loading thumbnail image ${idx}:`, imgSrc);
                (e.target as HTMLImageElement).src = "https://placehold.co/300x300?text=Thumb";
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Image counter */}
      <div className="text-center text-xs text-gray-500 mt-2">
        <span className="font-medium">{currentIndex + 1}</span> / {images.length} {uniqueImagesCount < images.length ? `(${uniqueImagesCount} unique)` : ''}
      </div>
    </div>
  );
};

export default ThumbnailCarousel;
