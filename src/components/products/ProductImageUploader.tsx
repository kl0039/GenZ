
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X, ChevronLeft, ChevronRight, Upload, Trash } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ProductImageUploaderProps {
  mainImage: string;
  onMainImageChange: (url: string) => void;
  imageUrl1?: string;
  imageUrl2?: string;
  imageUrl3?: string;
  imageUrl4?: string;
  onImageUrl1Change?: (url: string) => void;
  onImageUrl2Change?: (url: string) => void;
  onImageUrl3Change?: (url: string) => void;
  onImageUrl4Change?: (url: string) => void;
  maxImages?: number;
}

const ProductImageUploader: React.FC<ProductImageUploaderProps> = ({
  mainImage,
  imageUrl1 = '',
  imageUrl2 = '',
  imageUrl3 = '',
  imageUrl4 = '',
  onMainImageChange,
  onImageUrl1Change = () => {},
  onImageUrl2Change = () => {},
  onImageUrl3Change = () => {},
  onImageUrl4Change = () => {},
  maxImages = 5 // Main image + 4 additional images
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Collect all valid images into an array
  const allImages = [mainImage, imageUrl1, imageUrl2, imageUrl3, imageUrl4].filter(Boolean);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    // Convert the selected file to a base64 string
    const file = files[0];
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const result = reader.result as string;
      
      // Determine which image field to update
      if (!mainImage) {
        onMainImageChange(result);
      } else if (!imageUrl1) {
        onImageUrl1Change(result);
      } else if (!imageUrl2) {
        onImageUrl2Change(result);
      } else if (!imageUrl3) {
        onImageUrl3Change(result);
      } else if (!imageUrl4) {
        onImageUrl4Change(result);
      } else {
        alert(`Maximum of ${maxImages} images allowed`);
      }
      
      setIsUploading(false);
      // Reset the input so the same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    
    reader.onerror = () => {
      alert('Error reading file');
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    
    reader.readAsDataURL(file);
  };

  const handleSetMainImage = (index: number) => {
    // Skip if already main image (index 0)
    if (index === 0) return;

    // Get the image that should be the new main image
    const newMainImage = allImages[index];
    
    // Update all image fields based on the reordering
    if (index === 1) {
      onMainImageChange(imageUrl1);
      onImageUrl1Change(mainImage);
    } else if (index === 2) {
      onMainImageChange(imageUrl2);
      onImageUrl1Change(mainImage);
      onImageUrl2Change(imageUrl1);
    } else if (index === 3) {
      onMainImageChange(imageUrl3);
      onImageUrl1Change(mainImage);
      onImageUrl2Change(imageUrl1);
      onImageUrl3Change(imageUrl2);
    } else if (index === 4) {
      onMainImageChange(imageUrl4);
      onImageUrl1Change(mainImage);
      onImageUrl2Change(imageUrl1);
      onImageUrl3Change(imageUrl2);
      onImageUrl4Change(imageUrl3);
    }
    
    setCurrentIndex(0); // Reset to show the new main image
  };
  
  const handleRemoveImage = (index: number) => {
    if (index === 0) {
      // Removing the main image - shift everything up
      onMainImageChange(imageUrl1);
      onImageUrl1Change(imageUrl2);
      onImageUrl2Change(imageUrl3);
      onImageUrl3Change(imageUrl4);
      onImageUrl4Change('');
    } else if (index === 1) {
      // Removing image_url_1
      onImageUrl1Change(imageUrl2);
      onImageUrl2Change(imageUrl3);
      onImageUrl3Change(imageUrl4);
      onImageUrl4Change('');
    } else if (index === 2) {
      // Removing image_url_2
      onImageUrl2Change(imageUrl3);
      onImageUrl3Change(imageUrl4);
      onImageUrl4Change('');
    } else if (index === 3) {
      // Removing image_url_3
      onImageUrl3Change(imageUrl4);
      onImageUrl4Change('');
    } else if (index === 4) {
      // Removing image_url_4
      onImageUrl4Change('');
    }
    
    // Update current index if needed
    if (currentIndex >= allImages.length - 1) {
      setCurrentIndex(Math.max(0, allImages.length - 2));
    }
  };
  
  const handlePrevImage = () => {
    setCurrentIndex(prevIndex => 
      prevIndex > 0 ? prevIndex - 1 : allImages.length - 1
    );
  };
  
  const handleNextImage = () => {
    setCurrentIndex(prevIndex => 
      prevIndex < allImages.length - 1 ? prevIndex + 1 : 0
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="border rounded-md p-4">
        <div className="relative">
          <AspectRatio ratio={1} className="bg-gray-100 flex items-center justify-center">
            {allImages.length > 0 ? (
              <img 
                src={allImages[currentIndex]} 
                alt="Product" 
                className="max-h-full max-w-full object-contain" 
              />
            ) : (
              <div className="text-gray-400 flex flex-col items-center">
                <Upload className="h-12 w-12 mb-2 opacity-50" />
                <span>No image selected</span>
                <span className="text-xs mt-1">Click 'Add Image' below</span>
              </div>
            )}
          </AspectRatio>
          
          {allImages.length > 1 && (
            <>
              <button 
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-60 rounded-full p-1"
                aria-label="Previous image"
                type="button"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-60 rounded-full p-1"
                aria-label="Next image"
                type="button"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              
              <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-md text-xs">
                {currentIndex + 1} / {allImages.length}
              </div>
            </>
          )}
        </div>
        
        {/* Thumbnail Preview */}
        {allImages.length > 0 && (
          <div className="flex gap-2 mt-3 overflow-x-auto py-2">
            {allImages.map((image, idx) => (
              <div 
                key={idx} 
                className={`relative cursor-pointer border-2 rounded flex-shrink-0 w-16 h-16 ${
                  idx === currentIndex ? 'border-primary' : 'border-transparent hover:border-gray-300'
                }`}
                onClick={() => setCurrentIndex(idx)}
              >
                <img 
                  src={image} 
                  alt={`Thumbnail ${idx + 1}`} 
                  className="w-full h-full object-contain p-1" 
                />
                
                <div className="absolute -top-2 -right-2 flex space-x-1">
                  {idx !== 0 && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetMainImage(idx);
                      }}
                      className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      title="Set as main image"
                      type="button"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  )}
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(idx);
                    }}
                    className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    title="Remove image"
                    type="button"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
        />
        <Button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || allImages.length >= maxImages}
          type="button"
          variant="outline"
          className="w-full"
        >
          {isUploading ? (
            <span className="flex items-center">
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
              Uploading...
            </span>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Add Image {allImages.length > 0 ? `(${allImages.length}/${maxImages})` : ''}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductImageUploader;
