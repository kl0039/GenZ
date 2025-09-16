
import React from 'react';

interface ImageCounterProps {
  currentIndex: number;
  totalImages: number;
}

const ImageCounter: React.FC<ImageCounterProps> = ({ currentIndex, totalImages }) => {
  return (
    <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-md text-xs">
      {currentIndex + 1} / {totalImages}
    </div>
  );
};

export default ImageCounter;
