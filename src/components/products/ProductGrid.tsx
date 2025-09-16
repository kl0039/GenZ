
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Known category IDs for special handling
const specialCategoryIds = {
  'alcohol': '9d157b91-158c-47a6-80c3-7f9cb589e5a9',
  'chocolate-biscuit': '3fcebe45-53e7-4801-b94e-0d4eb6be9c4e',
  'cracker-chips': '040bcbc9-7fff-4903-8a55-6c4e72113c23',
  'egg-roll': '619b9828-acf0-48a9-bffc-7a319b91b1d6',
};

// Known category slugs
const specialCategorySlugs = {
  'alcohol-drinks': '9d157b91-158c-47a6-80c3-7f9cb589e5a9',
  'chocolate-and-biscuit': '3fcebe45-53e7-4801-b94e-0d4eb6be9c4e', 
  'cracker-and-chips': '040bcbc9-7fff-4903-8a55-6c4e72113c23',
  'egg-roll-and-chocolate-roll': '619b9828-acf0-48a9-bffc-7a319b91b1d6',
};

// Helper to normalize URL slugs - handles both single and double hyphens
const normalizeSlug = (slug: string): string => {
  return slug.replace(/--+/g, '-'); // Convert any sequence of multiple hyphens to single
};

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  error: any;
  searchTerm?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  isLoading, 
  error,
  searchTerm 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const normalizedPath = normalizeSlug(currentPath);
  
  console.log("Current raw path:", currentPath);
  console.log("Normalized path:", normalizedPath);
  
  // Handle product click navigation
  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((skeleton) => (
          <div key={skeleton} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    console.error("Error loading products:", error);
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading products</AlertTitle>
        <AlertDescription>
          Please try again later. Details: {error.message || JSON.stringify(error)}
        </AlertDescription>
      </Alert>
    );
  }

  // Debug: What products do we have?
  console.log("ProductGrid received products:", products ? products.length : 0);
  console.log("Current path:", currentPath);
  console.log("Normalized path:", normalizedPath);
  if (products && products.length > 0) {
    console.log("First product sample:", products[0]);
  }
  
  // Check for specific category using both slug and ID matching (with normalized paths)
  const isAlcoholCategory = normalizedPath.includes('alcohol-drinks') || 
                            Object.values(specialCategoryIds).includes(specialCategorySlugs['alcohol-drinks']) && 
                            normalizedPath.includes(specialCategorySlugs['alcohol-drinks']);
                           
  const isCrackersCategory = normalizedPath.includes('cracker-and-chips') || 
                             Object.values(specialCategoryIds).includes(specialCategorySlugs['cracker-and-chips']) && 
                             normalizedPath.includes(specialCategorySlugs['cracker-and-chips']);
                            
  const isEggRollCategory = normalizedPath.includes('egg-roll-and-chocolate-roll') || 
                            Object.values(specialCategoryIds).includes(specialCategorySlugs['egg-roll-and-chocolate-roll']) && 
                            normalizedPath.includes(specialCategorySlugs['egg-roll-and-chocolate-roll']);
                           
  const isChocolateBiscuitCategory = normalizedPath.includes('chocolate-and-biscuit') || 
                                    Object.values(specialCategoryIds).includes(specialCategorySlugs['chocolate-and-biscuit']) && 
                                    normalizedPath.includes(specialCategorySlugs['chocolate-and-biscuit']);

  if (!products || products.length === 0) {
    let messageTitle = searchTerm 
      ? `No products found matching "${searchTerm}"`
      : "We're working on adding more products to this category";
      
    let messageDesc = "Try adjusting your filters or browse our other categories.";
    
    // Use specific messages for special categories
    if (isAlcoholCategory) {
      messageTitle = "Our alcohol products collection is coming soon!";
      messageDesc = "We're currently updating our selection of alcoholic beverages. Please check back soon or browse our other categories.";
    } else if (isCrackersCategory) {
      messageTitle = "Our Crackers & Chips collection is being refreshed!";
      messageDesc = "We're currently updating our selection. Please check back soon or browse our other categories.";
    } else if (isEggRollCategory) {
      messageTitle = "Our Egg Roll & Chocolate Roll collection is being restocked!"; 
      messageDesc = "We're currently restocking these items. Please check back soon or browse our other categories.";
    } else if (isChocolateBiscuitCategory) {
      messageTitle = "Our Chocolate & Biscuit collection is being updated!";
      messageDesc = "We're currently refreshing our selection of sweet treats. Please check back soon or browse our other categories.";
    }

    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <img 
          src="https://storage.googleapis.com/uxpilot-auth.appspot.com/1becc23d-4498-4829-b732-1b288aacd64f.png" 
          alt="No products found" 
          className="mx-auto h-32 mb-4 opacity-60" 
        />
        <h3 className="text-xl font-medium text-gray-800 mb-2">
          {messageTitle}
        </h3>
        <p className="text-gray-500 mb-4">
          {messageDesc}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product: Product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onProductClick={handleProductClick}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
