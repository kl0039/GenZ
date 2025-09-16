
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/types';
import { getPrimaryProductImage, getImageFallback } from '@/utils/images';

interface ProductCardProps {
  product: Product;
  onProductClick?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  const { addItem } = useCart();
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
  };

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product.id);
    }
  };

  const handleImageError = () => {
    console.log('Image failed to load for product:', product.name);
    setImageError(true);
  };

  // Calculate discounted price if applicable
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;
  const originalPrice = hasDiscount ? product.price : (product.originalPrice || null);

  // Check if product is new
  const isNew = product.new || false;

  // Check if product has promotion
  const hasPromotion = product.promotion && product.promotion !== '';

  // Get the primary image with fallback handling
  const primaryImage = imageError ? getImageFallback() : getPrimaryProductImage(product);

  console.log('ProductCard image details:', {
    productName: product.name,
    primaryImage,
    imageError,
    rawProduct: {
      image: product.image,
      image_url: product.image_url,
      image_url_1: product.image_url_1
    }
  });

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full min-h-[440px] max-h-[480px]"
      onClick={handleCardClick}
      style={{ minHeight: 440, maxHeight: 480 }}
    >
      {/* Image + badges */}
      <div className="relative flex-shrink-0 bg-[#f8fafb] flex items-center justify-center h-48 md:h-56">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-auto h-44 md:h-52 object-contain mx-auto"
          onError={handleImageError}
          onLoad={() => console.log('Image loaded successfully for:', product.name)}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {isNew && (
            <Badge className="bg-green-500 text-white">New</Badge>
          )}
          {hasPromotion && (
            <Badge className="bg-red-500 text-white">
              {product.promotion}
            </Badge>
          )}
          {hasDiscount && (
            <Badge className="bg-orange-500 text-white">
              -{product.discount}%
            </Badge>
          )}
        </div>
      </div>

      {/* Card body: flex-grow to fill space, vertical space for bottom buttons */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        {/* Top section: title, category, rating, price */}
        <div>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
          {/* Category */}
          {product.categories && product.categories.length > 0 && (
            <p className="text-sm text-gray-600 mb-2">
              {typeof product.categories[0] === 'string'
                ? product.categories[0]
                : product.categories[0]?.name
              }
            </p>
          )}
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < product.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
            </div>
          )}
          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-bold text-primary">
              £{discountedPrice.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                £{originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        {/* Bottom: Add to Cart button */}
        <div className="flex mt-2">
          <Button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2"
            variant="default"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
