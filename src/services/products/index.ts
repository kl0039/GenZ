
// Export type definitions
export * from './types';

// Export productQueries explicitly to avoid naming conflicts
export { 
  fetchProducts,
  fetchProductById, 
  fetchFeaturedProducts,
  fetchProductsByPromotion,
  searchProducts
} from './queries/productQueries';

// Export categoryQueries with specific renaming to avoid conflicts
export { 
  fetchProductsByCategory,
  fetchProductCategories
} from './queries/categoryQueries';

// Export category utilities
export * from './queries/categoryUtils';

// Export utilities (excluding convertToAppProduct to avoid conflict with types)
export {
  fetchAllProductsData,
  fetchProductByIdData,
  safeJsonParse,
  parseNutritionText,
  parseIngredientsText,
  processProductsWithCategories
} from './utils/productProcessing';

// Export all mutations including addProduct
export * from './productMutations';
