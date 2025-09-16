
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageControlsProps {
  onPrev: () => void;
  onNext: () => void;
}

const ImageControls: React.FC<ImageControlsProps> = ({ onPrev, onNext }) => {
  return (
    <>
      <button 
        onClick={onPrev}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-60 rounded-full p-1 hover:bg-opacity-90 transition-colors z-10"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button 
        onClick={onNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-60 rounded-full p-1 hover:bg-opacity-90 transition-colors z-10"
        aria-label="Next image"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </>
  );
};

export default ImageControls;
