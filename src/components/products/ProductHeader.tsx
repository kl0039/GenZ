
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Category } from '@/types';

interface ProductHeaderProps {
  product: any;
  isFavorite: boolean;
  categoryPath: Category[];
  currentCategory: Category | null;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
  product,
  isFavorite,
  categoryPath,
  currentCategory,
}) => (
  <div>
    {/* Product Categories */}
    <div className="flex flex-wrap gap-2 mb-2">
      {product.categories && product.categories.length > 0 ? (
        product.categories.map((category: Category) => (
          <Badge key={category.id} variant="secondary" className="text-xs">
            {category.name}
          </Badge>
        ))
      ) : (
        product.category && (
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
        )
      )}

      {/* Brand Badge if available */}
      {product.brands && product.brands.length > 0 && (
        <Badge variant="outline" className="text-xs font-semibold">
          {product.brands[0]}
        </Badge>
      )}
    </div>

    <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>

    {/* Stock Status */}
    <div className="mt-2 flex items-center gap-2">
      <span className={`w-3 h-3 rounded-full ${product.stock_quantity > 0 ? 'bg-green-600' : 'bg-red-500'}`}></span>
      <span className="text-sm text-gray-600">
        {product.stock_quantity > 20 
          ? 'In Stock'
          : product.stock_quantity > 0 
            ? `Only ${product.stock_quantity} left`
            : 'Out of Stock'
        }
        {product.stock_quantity > 20 && <span className="ml-2 font-medium">20+</span>}
      </span>
    </div>

    {/* Points Section */}
    <div className="mt-4 bg-gray-50 p-3 rounded-lg border">
      <p className="text-sm text-gray-600">
        Get up to 6 point(s) for purchase! Login to see actual value.
      </p>
    </div>
  </div>
);

export default ProductHeader;
