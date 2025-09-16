
import React from 'react';
import { Product } from '@/types';
import ProductGrid from './ProductGrid';

interface ProductsSectionProps {
  products: Product[];
  isLoading: boolean;
  error: any;
  searchTerm: string;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ 
  products, 
  isLoading, 
  error, 
  searchTerm 
}) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-4">
            <ProductGrid 
              products={products}
              isLoading={isLoading}
              error={error}
              searchTerm={searchTerm}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
