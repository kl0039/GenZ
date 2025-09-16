
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ProductImageBadgesProps {
  isNew?: boolean;
  discount?: number;
}

const ProductImageBadges: React.FC<ProductImageBadgesProps> = ({ isNew, discount }) => {
  if (!isNew && !discount) return null;
  
  return (
    <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
      {isNew && (
        <Badge className="bg-green-500 hover:bg-green-600">New</Badge>
      )}
      
      {discount && discount > 0 && (
        <Badge className="bg-red-500 hover:bg-red-600">
          {discount}% OFF
        </Badge>
      )}
    </div>
  );
};

export default ProductImageBadges;
