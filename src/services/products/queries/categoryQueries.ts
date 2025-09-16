
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductFilters } from "@/types";
import { convertToAppProduct } from "../types";
import { fetchProductCategories } from "./categoryUtils";

// Get all child category IDs for a parent category
const getChildCategoryIds = async (parentCategoryId: string): Promise<string[]> => {
  console.log(`Getting child categories for parent: ${parentCategoryId}`);
  
  const { data: childCategories, error } = await supabase
    .from('categories')
    .select('id')
    .eq('parent_id', parentCategoryId);
  
  if (error) {
    console.error('Error fetching child categories:', error);
    return [];
  }
  
  const childIds = childCategories?.map(cat => cat.id) || [];
  console.log(`Found ${childIds.length} child categories for parent ${parentCategoryId}`);
  
  return childIds;
};

// Enhanced category filtering function that handles both junction table and direct category_id
const applyCategoryFilters = async (query: any, categoryIdentifier: string, options: ProductFilters) => {
  if (categoryIdentifier && categoryIdentifier !== 'all') {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryIdentifier);
    
    if (isUuid) {
      console.log(`Filtering by UUID category: ${categoryIdentifier}`);
      
      // Get child categories for this parent category
      const childCategoryIds = await getChildCategoryIds(categoryIdentifier);
      const allCategoryIds = [categoryIdentifier, ...childCategoryIds];
      
      console.log(`Using category IDs (parent + children): ${allCategoryIds.join(', ')}`);
      
      // First try to get products via product_categories junction table
      const { data: productCategories } = await supabase
        .from('product_categories')
        .select('product_id')
        .in('category_id', allCategoryIds);
      
      if (productCategories && productCategories.length > 0) {
        // Use junction table results if available
        const productIds = productCategories.map(pc => pc.product_id);
        console.log(`Found ${productIds.length} products via junction table for categories ${allCategoryIds.join(', ')}`);
        query = query.in('id', productIds);
      } else {
        // Fallback to direct category_id filtering
        console.log(`No junction table entries found, using direct category_id filter for ${allCategoryIds.join(', ')}`);
        query = query.in('category_id', allCategoryIds);
      }
    } else {
      console.log(`Filtering by text-based category: ${categoryIdentifier}`);
      
      // Enhanced search variations for text-based categories
      const searchVariations = [
        // Handle double hyphens as "and" or "&" replacements
        categoryIdentifier.replace(/--/g, ' & '), // "pickled--preserved" -> "pickled & preserved"
        categoryIdentifier.replace(/--/g, ' and '), // "pickled--preserved" -> "pickled and preserved"
        categoryIdentifier.replace(/-and-/g, ' & '), // "pickled-and-preserved" -> "pickled & preserved"
        categoryIdentifier.replace(/-and-/g, ' and '), // Keep "and" version
        categoryIdentifier.replace(/-/g, ' '), // "pickled-preserved" -> "pickled preserved"
        categoryIdentifier.replace(/-/g, ' & '), // "pickled-preserved" -> "pickled & preserved"
        categoryIdentifier, // keep original
      ];
      
      console.log(`Searching for categories with variations:`, searchVariations);
      
      // Build a comprehensive OR query for category name matching
      const searchConditions = searchVariations.map(variation => 
        `name.ilike.%${variation}%`
      ).join(',');
      
      const { data: categories } = await supabase
        .from('categories')
        .select('id, name')
        .or(searchConditions);
      
      console.log(`Found ${categories?.length || 0} matching categories for "${categoryIdentifier}":`, categories?.map(c => c.name));
      
      if (categories && categories.length > 0) {
        const categoryIds = categories.map(cat => cat.id);
        
        // For each found category, also get its children
        const allCategoryIds = [...categoryIds];
        for (const categoryId of categoryIds) {
          const childIds = await getChildCategoryIds(categoryId);
          allCategoryIds.push(...childIds);
        }
        
        // Remove duplicates
        const uniqueCategoryIds = [...new Set(allCategoryIds)];
        console.log(`Using all category IDs (including children): ${uniqueCategoryIds.join(', ')}`);
        
        // Try junction table first
        const { data: productCategories } = await supabase
          .from('product_categories')
          .select('product_id')
          .in('category_id', uniqueCategoryIds);
        
        if (productCategories && productCategories.length > 0) {
          const productIds = productCategories.map(pc => pc.product_id);
          console.log(`Found ${productIds.length} products via junction table for categories: ${categories.map(c => c.name).join(', ')}`);
          query = query.in('id', productIds);
        } else {
          // Fallback to direct category filtering
          console.log(`No junction table entries, using direct category_id filter for categories: ${categories.map(c => c.name).join(', ')}`);
          query = query.in('category_id', uniqueCategoryIds);
        }
      } else {
        // If category not found, return empty result
        console.log(`No categories found matching "${categoryIdentifier}", returning empty result`);
        query = query.eq('id', '00000000-0000-0000-0000-000000000000');
      }
    }
  }
  
  return query;
};

// Simple sorting function
const applyCategorySorting = (products: Product[], options: ProductFilters): Product[] => {
  const sortBy = options.sortBy || 'popularity';
  
  switch (sortBy) {
    case 'price-low':
      return [...products].sort((a, b) => a.price - b.price);
    case 'price-high':
      return [...products].sort((a, b) => b.price - a.price);
    case 'name':
      return [...products].sort((a, b) => a.name.localeCompare(b.name));
    default:
      return products;
  }
};

export const fetchProductsByCategory = async (
  categoryIdentifier: string = 'all',
  options: ProductFilters = {
    priceRange: [0, 100],
    inStock: false,
    sortBy: 'popularity',
    categories: [],
    cuisines: []
  }
): Promise<Product[]> => {
  try {
    console.log(`Fetching products for category: ${categoryIdentifier}`);
    
    let query = supabase
      .from('products')
      .select('*')
      .eq('availability', 'Y'); // Only fetch available products

    // Apply category filtering
    const filteredQuery = await applyCategoryFilters(query, categoryIdentifier, options);
    
    const { data: productsData, error: productsError } = await filteredQuery;
    
    if (productsError) {
      console.error('Error fetching products by category:', productsError);
      throw productsError;
    }

    if (!productsData || productsData.length === 0) {
      console.log(`No available products found for category: ${categoryIdentifier}`);
      return [];
    }

    console.log(`Found ${productsData.length} available products for category: ${categoryIdentifier}`);

    // Get categories for all products (this will now handle missing category relationships)
    const productIds = productsData.map(product => product.id);
    const categoriesByProductId = await fetchProductCategories(productIds);

    // Convert to app format and add categories
    let products = productsData.map(product => {
      const productWithCategories = {
        ...product,
        categories: categoriesByProductId[product.id] || []
      };
      return convertToAppProduct(productWithCategories);
    });

    // Apply sorting
    products = applyCategorySorting(products, options);

    console.log(`Returning ${products.length} processed available products`);
    return products;
  } catch (error) {
    console.error('Error in fetchProductsByCategory:', error);
    return [];
  }
};

// Export the fetchProductCategories function from categoryUtils
export { fetchProductCategories } from './categoryUtils';
