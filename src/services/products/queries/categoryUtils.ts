
import { isUuid as isValidUuid } from './utils/validations';
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import { cuisineTypes } from '@/hooks/useProductCategory';

// Correct IDs for special categories
const SPECIAL_CATEGORY_IDS = {
  'alcohol-drinks': '9d157b91-158c-47a6-80c3-7f9cb589e5a9',
  'chocolate-and-biscuit': '3fcebe45-53e7-4801-b94e-0d4eb6be9c4e',
  'cracker-and-chips': '040bcbc9-7fff-4903-8a55-6c4e72113c23',
  'egg-roll-and-chocolate-roll': '619b9828-acf0-48a9-bffc-7a319b91b1d6',
};

// Helper to normalize URL slugs - handles both single and double hyphens
const normalizeSlug = (slug: string): string => {
  return slug.replace(/--+/g, '-'); // Convert any sequence of multiple hyphens to single
};

// Helper to check if a category exists in the list of known categories
export const isKnownCategory = (categoryName: string): boolean => {
  // Normalize the category name first to handle multiple hyphens
  const normalizedName = normalizeSlug(categoryName);
  
  // Special handling for known categories
  if (Object.keys(SPECIAL_CATEGORY_IDS).includes(normalizedName)) {
    return true;
  }
  
  // Use the imported cuisineTypes to ensure consistency
  return cuisineTypes.includes(normalizedName);
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
