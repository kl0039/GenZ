
import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { fetchProductsByPromotion } from '@/services/products/index';

interface RecommendedProductsProps {
  limit?: number;
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ limit = 4 }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      setLoading(true);
      try {
        // Fetch products from all three promotion categories
        const [saleProducts, bundleProducts, freeDeliveryProducts] = await Promise.all([
          fetchProductsByPromotion('sale'),
          fetchProductsByPromotion('bundle'),
          fetchProductsByPromotion('freeDelivery')
        ]);

        // Combine and shuffle products from all categories
        const combinedProducts = [...saleProducts, ...bundleProducts, ...freeDeliveryProducts];
        const shuffledProducts = combinedProducts
          .sort(() => 0.5 - Math.random())
          .slice(0, limit);
        
        setProducts(shuffledProducts);
      } catch (error) {
        console.error('Error fetching recommended products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedProducts();
  }, [limit]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(limit)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={`rec-${product.id}`} product={product} />
      ))}
    </div>
  );
};

export default RecommendedProducts;
