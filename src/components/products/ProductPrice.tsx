
import React from "react";

interface ProductPriceProps {
  product: any;
}

const ProductPrice: React.FC<ProductPriceProps> = ({ product }) => (
  <div>
    <div className="text-sm text-gray-500">Price</div>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold text-asianred-600">
        £{product.price.toFixed(2)}
      </span>
      {product.originalPrice && (
        <span className="line-through text-gray-400">
          £{product.originalPrice.toFixed(2)}
        </span>
      )}
    </div>
  </div>
);

export default ProductPrice;
