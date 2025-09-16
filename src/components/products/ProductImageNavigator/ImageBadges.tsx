
import React from 'react';

interface ImageBadgesProps {
  isNew?: boolean;
  discount?: number;
}

const ImageBadges: React.FC<ImageBadgesProps> = ({ isNew, discount }) => {
  return (
    <>
      {/* New Badge */}
      {isNew && (
        <div className="absolute top-2 left-2 bg-green-600 text-white px-3 py-1 text-xs font-semibold rounded-full">
          NEW
        </div>
      )}
      
      {/* Discount Badge */}
      {discount && discount > 0 && (
        <div className="absolute top-2 right-2 bg-asianred-600 text-white px-3 py-1 text-xs font-semibold rounded-full">
          {discount}% OFF
        </div>
      )}
    </>
  );
};

export default ImageBadges;
