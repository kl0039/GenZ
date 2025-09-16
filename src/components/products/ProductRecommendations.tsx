
import React from 'react';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

interface ProductRecommendationsProps {
  products: Product[];
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({ products }) => {
  if (!products.length) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">Recommended For You</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={`rec-${product.id}`} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductRecommendations;
