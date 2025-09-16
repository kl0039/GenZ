
import React from 'react';
import ImageNavigator from './ProductImageNavigator/ImageNavigator';

interface ProductImageNavigatorProps {
  // Update the type to allow for a mixed array of strings and objects, or a single array of strings
  images: Array<string | { url?: string | null }> | string[];
  productName: string;
  isNew?: boolean;
  discount?: number;
}

// This is now just a wrapper around the more detailed ImageNavigator component
// to maintain backward compatibility with existing code
const ProductImageNavigator: React.FC<ProductImageNavigatorProps> = ({
  images,
  productName,
  isNew,
  discount
}) => {
  console.log("ProductImageNavigator received images:", images);
  
  return (
    <ImageNavigator
      images={images}
      productName={productName}
      isNew={isNew}
      discount={discount}
    />
  );
};

export default ProductImageNavigator;
