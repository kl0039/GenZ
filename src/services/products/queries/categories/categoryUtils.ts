import { isUuid as isValidUuid } from '../utils/validations';
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import { cuisineTypes } from '@/hooks/useProductCategory';

// Helper to check if a category exists in the list of known categories
export const isKnownCategory = (categoryName: string): boolean => {
  // Use the imported cuisineTypes to ensure consistency
  return cuisineTypes.includes(categoryName);
};

// Fetch products directly linked to a category
export const fetchDirectCategoryProducts = async (categoryId: string): Promise<string[]> => {
  console.log(`Fetching direct products for category: ${categoryId}`);
  const { data, error } = await supabase
    .from('product_categories')
    .select('product_id')
    .eq('category_id', categoryId);

  if (error) {
    console.error('Error fetching direct category products:', error);
    return [];
  }
  
  console.log(`Found ${data?.length || 0} product IDs for category ${categoryId}`);
  return data?.map(pc => pc.product_id) || [];
};

// Get parent category information
export const fetchCategoryInfo = async (categoryId: string) => {
  console.log(`Fetching category info for: ${categoryId}`);
  const { data: categoryInfo, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', categoryId)
    .single();

  if (error) {
    console.error('Error fetching category info:', error);
    return null;
  }
  
  console.log('Category info found:', categoryInfo ? categoryInfo.name : 'None');
  return categoryInfo;
};

// Fetch categories for a list of product IDs
export const fetchProductCategories = async (productIds: string[]): Promise<Record<string, any[]>> => {
  if (!productIds || productIds.length === 0) {
    return {};
  }

  try {
    console.log(`Fetching categories for ${productIds.length} products`);
    
    // Get the product-category relationships
    const { data: productCategoriesData, error: pcError } = await supabase
      .from('product_categories')
      .select('product_id, category_id')
      .in('product_id', productIds);

    if (pcError) {
      console.error('Error fetching product categories:', pcError);
      return {};
    }

    if (!productCategoriesData || productCategoriesData.length === 0) {
      console.log('No product-category relationships found');
      return {};
    }
    
    console.log(`Found ${productCategoriesData.length} product-category relationships`);

    // Get all unique category IDs
    const categoryIds = [...new Set(productCategoriesData.map(pc => pc.category_id))];
    
    // Fetch category details
    const { data: categoriesData, error: catError } = await supabase
      .from('categories')
      .select('*')
      .in('id', categoryIds);

    if (catError) {
      console.error('Error fetching categories:', catError);
      return {};
    }
    
    console.log(`Found ${categoriesData?.length || 0} categories`);

    // Build a map of category id to category details
    const categoryMap = (categoriesData || []).reduce((map, category) => {
      map[category.id] = category;
      return map;
    }, {} as Record<string, any>);

    // Group categories by product ID
    const result: Record<string, any[]> = {};
    productCategoriesData.forEach(pc => {
      if (!result[pc.product_id]) {
        result[pc.product_id] = [];
      }
      const category = categoryMap[pc.category_id];
      if (category) {
        result[pc.product_id].push(category);
      }
    });

    console.log(`Built category map for ${Object.keys(result).length} products`);
    return result;
  } catch (error) {
    console.error('Error in fetchProductCategories:', error);
    return {};
  }
};
