
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductImageBadges from './ProductImageBadges';
import ThumbnailCarousel from './ThumbnailCarousel';
import { processProductImages } from './utils';

interface ImageNavigatorProps {
  images: Array<string | { url?: string | null }>;
  productName: string;
  isNew?: boolean;
  discount?: number;
}

const ImageNavigator: React.FC<ImageNavigatorProps> = ({
  images,
  productName,
  isNew,
  discount
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Use the processProductImages utility to ensure we have valid image URLs
  const processedImages = processProductImages(images);
  
  // Ensure we have at least one image or use placeholder
  const hasImages = processedImages.length > 0;
  const currentImage = hasImages ? processedImages[currentImageIndex] : 'https://placehold.co/300x300?text=No+Image'; 
  
  // Log image details for debugging
  console.log("ImageNavigator processedImages:", processedImages);
  console.log("Current image index:", currentImageIndex);
  console.log("Current image URL:", currentImage);
  
  // Reset current index if it becomes invalid after images change
  useEffect(() => {
    if (currentImageIndex >= processedImages.length) {
      setCurrentImageIndex(0);
    }
  }, [processedImages, currentImageIndex]);
  
  const handlePrevious = () => {
    setCurrentImageIndex(prevIndex => 
      prevIndex > 0 ? prevIndex - 1 : processedImages.length - 1
    );
  };
  
  const handleNext = () => {
    setCurrentImageIndex(prevIndex => 
      prevIndex < processedImages.length - 1 ? prevIndex + 1 : 0
    );
  };
  
  const handleSelectImage = (index: number) => {
    setCurrentImageIndex(index);
  };
  
  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Main image display */}
      <div className="relative w-full h-80 md:h-96 bg-gray-100">
        <img
          src={currentImage}
          alt={productName}
          className="w-full h-full object-contain"
          onError={(e) => {
            console.error("Error loading main image:", currentImage);
            (e.target as HTMLImageElement).src = "https://placehold.co/300x300?text=No+Image";
          }}
        />
        
        {/* Navigation arrows - only show if more than one unique image */}
        {processedImages.length > 1 && (
          <>
            <Button 
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 hover:bg-white shadow-md"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous image</span>
            </Button>
            <Button 
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 hover:bg-white shadow-md"
              onClick={handleNext}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next image</span>
            </Button>
          </>
        )}
        
        {/* Badges for "New" or discounts */}
        <ProductImageBadges isNew={isNew} discount={discount} />
      </div>
      
      {/* Image thumbnails - only show if we have multiple unique images */}
      <ThumbnailCarousel 
        images={processedImages}
        productName={productName}
        currentIndex={currentImageIndex}
        onSelect={handleSelectImage}
      />
    </div>
  );
};

export default ImageNavigator;
