
import {
  fetchProducts,
  fetchProductById,
  fetchProductsByCategory,
  fetchProductsByPromotion,
  searchProducts,
  fetchFeaturedProducts,
  addProduct,
  updateProductDetails
} from './products/index';

// Re-export everything for backward compatibility
export {
  fetchProducts as getAllProducts,
  fetchProductById as getProductById,
  fetchProductsByCategory as getProductsByCategory,
  fetchProductsByPromotion as getProductsByPromotion,
  searchProducts,
  fetchFeaturedProducts as getFeaturedProducts,
  addProduct,
  updateProductDetails
};
