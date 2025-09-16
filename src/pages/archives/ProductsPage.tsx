import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductSearchBar from '@/components/products/ProductSearchBar';
import ProductBanner from '@/components/products/ProductBanner';
import ProductBreadcrumbs from '@/components/products/ProductBreadcrumbs';
import ProductsSection from '@/components/products/ProductsSection';
import ProductRecommendations from '@/components/products/ProductRecommendations';
import { useProductCategory } from '@/hooks/useProductCategory';
import { useProductFilters } from '@/hooks/useProductFilters';
import { useProductData } from '@/hooks/useProductData';
import { cuisineTypes } from '@/hooks/useProductCategory';
import { toast } from 'sonner';

// Known category names mapping for special handling
const knownCategories = {
  'alcohol-drinks': '9d157b91-158c-47a6-80c3-7f9cb589e5a9',
  'chocolate-and-biscuit': '3fcebe45-53e7-4801-b94e-0d4eb6be9c4e',
  'cracker-and-chips': '040bcbc9-7fff-4903-8a55-6c4e72113c23',
  'egg-roll-and-chocolate-roll': '619b9828-acf0-48a9-bffc-7a319b91b1d6',
};

// Reverse mapping to look up by ID
const knownCategoryIds = Object.entries(knownCategories).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {} as Record<string, string>);

// Helper to normalize URL slugs - handles both single and double hyphens
const normalizeSlug = (slug: string): string => {
  return slug.replace(/--+/g, '-'); // Convert any sequence of multiple hyphens to single
};

const categoryBanners = {
  all: {
    title: "Shop All Asian Products",
    description: "Explore our complete selection of authentic Asian ingredients and kitchenware.",
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/450b942d5c-8cdfea5d8b905bbc88e6.png"
  },
  ingredients: {
    title: "Shop Asian Ingredients",
    description: "Discover authentic ingredients for your Asian cooking journey.",
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/450b942d5c-8cdfea5d8b905bbc88e6.png"
  },
  kitchenware: {
    title: "Shop Asian Kitchenware",
    description: "Essential tools and cookware for authentic Asian cuisine.",
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/450b942d5c-8cdfea5d8b905bbc88e6.png"
  },
  snacks: {
    title: "Shop Asian Snacks & Beverages",
    description: "Authentic treats and refreshments from across Asia.",
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/450b942d5c-8cdfea5d8b905bbc88e6.png"
  }
};

const ProductsPage = () => {
  const { category } = useParams<{ category: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Convert URL-friendly category name to ID if needed
  const getCategoryId = (categoryParam: string | undefined) => {
    if (!categoryParam || categoryParam === 'all') return 'all';
    
    // Normalize slug to handle multiple hyphens
    const normalizedSlug = normalizeSlug(categoryParam);
    console.log(`Normalized category slug: '${normalizedSlug}' (original: '${categoryParam}')`);
    
    // Check if this is a UUID format
    const isUuidFormat = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(normalizedSlug);
    
    if (isUuidFormat) {
      console.log(`Category parameter is a UUID: ${normalizedSlug}`);
      return normalizedSlug;
    }
    
    // Check if it's a known category slug
    if (knownCategories[normalizedSlug] || knownCategories[normalizedSlug as keyof typeof knownCategories]) {
      const categoryId = knownCategories[normalizedSlug as keyof typeof knownCategories];
      console.log(`Found known category ID for slug ${normalizedSlug}: ${categoryId}`);
      return categoryId;
    }
    
    // For other category names, convert to a format that can be processed
    console.log(`Using category name for processing: ${normalizedSlug}`);
    return normalizedSlug;
  };

  // Get the correct category ID to use
  const categoryId = getCategoryId(category);
  console.log(`Using category ID for data fetching: ${categoryId}`);
  
  const { currentCategory, categoryPath } = useProductCategory(categoryId);
  console.log("Current category:", currentCategory?.name);
  console.log("Category path:", categoryPath.map(cat => cat.name).join(' > '));

  const initialFilters = {
    priceRange: [0, 100] as [number, number],
    inStock: false,
    sortBy: 'popularity',
    categories: [] as string[],
    cuisines: [] as string[]
  };
  
  const { 
    filters,
    handleFilterChange,
    handleCategoryChange, 
    handleCuisineChange,
    handlePriceRangeChange
  } = useProductFilters(initialFilters);

  // Reset and set up filters when category changes
  useEffect(() => {
    if (!category) return;
    
    // Normalize the category slug to handle multiple hyphens
    const normalizedCategory = normalizeSlug(category);
    
    // Clear previous filters when category changes
    handleFilterChange('categories', []);
    handleFilterChange('cuisines', []);
    
    // Skip additional filtering for 'all' category
    if (normalizedCategory === 'all') return;
    
    console.log(`Setting up filters for category: ${normalizedCategory}`);
    
    // Handle UUID format categories (direct ID filtering)
    const isUuidFormat = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(normalizedCategory);
    
    if (isUuidFormat) {
      console.log(`Adding UUID category filter: ${normalizedCategory}`);
      handleFilterChange('categories', [normalizedCategory]);
      
      // If this is a known special category ID, apply additional handling
      const knownSlug = knownCategoryIds[normalizedCategory];
      if (knownSlug) {
        console.log(`Applied special category handling for ID: ${normalizedCategory} (${knownSlug})`);
      }
      return;
    }
    
    // Handle known category slugs
    if (knownCategories[normalizedCategory as keyof typeof knownCategories]) {
      const categoryId = knownCategories[normalizedCategory as keyof typeof knownCategories];
      console.log(`Adding known category ID filter: ${categoryId}`);
      handleFilterChange('categories', [categoryId]);
      return;
    }
    
    // For other categories, use the category name for filtering
    console.log(`Adding category name filter: ${normalizedCategory}`);
    handleFilterChange('categories', [normalizedCategory]);
    
    // Check if this is a cuisine type (separate handling)
    if (cuisineTypes.includes(normalizedCategory)) {
      console.log(`Setting cuisine filter for: ${normalizedCategory}`);
      handleFilterChange('cuisines', [normalizedCategory]);
    }
  }, [category, categoryId, handleFilterChange]);

  const categoryKey = category || 'all';
  const categoryTitle = currentCategory ? currentCategory.name : 'All Products';
  const banner = categoryBanners[categoryKey as keyof typeof categoryBanners] || categoryBanners.all;

  // --- DEBUG LOG: These should show the ACTUAL props handed to data hook ---
  console.log('[ProductsPage] categoryId:', categoryId);
  console.log('[ProductsPage] filters:', filters);
  console.log('[ProductsPage] searchTerm:', searchTerm);

  const { data: products = [], isLoading, error } = useProductData({ 
    category: categoryId, 
    filters, 
    searchTerm 
  });

  // --- DEBUG LOG: What products are being handed down to ProductSection?
  console.log('[ProductsPage] Products for render:', {
    count: products.length,
    sample: products[0],
    searchTerm,
    filters,
    categoryId
  });

  // Show feedback if there are no products but we've attempted to load
  useEffect(() => {
    if (!isLoading && products.length === 0 && !error) {
      console.log('No products found for the current filters');
      
      // Check if we're on a specific category
      if (category && category !== 'all') {
        // Get the category name for display
        const categoryName = currentCategory?.name || 'this category';
        
        // Special handling for known categories
        const isUuidFormat = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(category);
        let specialCategoryId = category;
        
        if (!isUuidFormat && knownCategories[normalizeSlug(category) as keyof typeof knownCategories]) {
          specialCategoryId = knownCategories[normalizeSlug(category) as keyof typeof knownCategories];
        }
        
        if (specialCategoryId === knownCategories['alcohol-drinks']) {
          toast.info("We're currently updating our alcohol products selection. Please check back soon.");
        } else if (specialCategoryId === knownCategories['cracker-and-chips']) {
          toast.info("Our Cracker & Chips selection is being refreshed. Please check back soon.");
        } else if (specialCategoryId === knownCategories['egg-roll-and-chocolate-roll']) {
          toast.info("Our Egg Roll & Chocolate Roll selection is being restocked. Please check back soon.");
        } else {
          toast.info(`No products found for ${categoryName}. Try other categories or adjust your filters.`);
        }
      }
    }
  }, [products, isLoading, error, category, categoryId, currentCategory]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <ProductBanner category={currentCategory} bannerData={banner} />

      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <ProductBreadcrumbs 
            currentCategory={currentCategory} 
            categoryPath={categoryPath}
          />
          <ProductSearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={{
              sortBy: filters.sortBy,
              cuisines: filters.cuisines
            }}
            onFilterChange={handleFilterChange}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            categoryTitle={currentCategory ? currentCategory.name : 'All Products'}
          />
        </div>
      </section>
      

      <ProductsSection 
        products={products}
        isLoading={isLoading}
        error={error}
        searchTerm={searchTerm}
      />
      
      <ProductRecommendations products={products} />
      
      <Footer />
    </div>
  );
};

export default ProductsPage;
