
import { Product } from "@/types";
import { 
  fetchProductByIdData, 
  processProductsWithCategories,
  fetchAllProductsData,
  safeJsonParse,
  parseNutritionText
} from "../utils/productProcessing";
import { collectProductImages } from "@/utils/images";
import { supabase } from "@/integrations/supabase/client";

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const productsData = await fetchAllProductsData();
    return await processProductsWithCategories(productsData);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    console.log(`Fetching product details for ID: ${id}`);
    const productData = await fetchProductByIdData(id);
    
    if (!productData) {
      console.log('No available product found with this ID');
      return null;
    }
    
    // Process nutrition information if it exists as text
    if (productData.nutrition && typeof productData.nutrition === 'string' && 
        productData.nutrition.includes(':') && !productData.nutrition.startsWith('{')) {
      try {
        // Convert the nutrition data to a string representation if it's an object
        const nutritionData = parseNutritionText(productData.nutrition);
        // Assign back as a string serialized format 
        productData.nutrition = JSON.stringify(nutritionData);
      } catch (error) {
        console.error('Error parsing nutrition text:', error);
        productData.nutrition = "{}";
      }
    }
    
    const products = await processProductsWithCategories([productData]);
    console.log('Processed available product with categories:', products[0]);
    
    // Get all product images using the collectProductImages utility
    if (products[0]) {
      const productImages = collectProductImages(products[0]);
      console.log('Product images after processing:', productImages);
    }
    
    return products[0];
  } catch (error) {
    console.error('Error in fetchProductById:', error);
    return null;
  }
};

export const fetchFeaturedProducts = async (limit: number = 8): Promise<Product[]> => {
  try {
    const allProducts = await fetchProducts();
    return allProducts
      .sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting featured products:', error);
    return [];
  }
};

export const fetchProductsByPromotion = async (promotionType: 'sale' | 'bundle' | 'freeDelivery', categoryId?: string): Promise<Product[]> => {
  try {
    console.log(`Fetching ${promotionType} products with full processing...`);

    // Fetch all products and filter by the promotion field only
    const allProducts = await fetchProducts();
    const filteredProducts = allProducts.filter(p => p.promotion === promotionType);
    console.log(`${promotionType} products from DB:`, filteredProducts.map(p => ({ id: p.id, name: p.name })));

    // Ensure each product has all necessary fields for ProductCard
    const processedProducts = filteredProducts.map(product => {
      // Ensure the product has all required fields
      const processedProduct = {
        ...product,
        // Make sure we have a valid image - fix: use 'image' property instead of 'images'
        image: product.image || product.image_url_1 || '/placeholder.svg',
        // Ensure we have a valid price
        price: product.price || 0,
        // Ensure we have a valid name
        name: product.name || 'Unnamed Product',
        // Ensure we have a valid description
        description: product.description || '',
        // Ensure we have a valid ID for routing
        id: product.id
      };
      
      console.log(`Processed ${promotionType} product:`, {
        id: processedProduct.id,
        name: processedProduct.name,
        price: processedProduct.price,
        image: processedProduct.image
      });
      
      return processedProduct;
    });

    // For products with 'sale' promotion, get discount info from product_categories
    if (promotionType === 'sale') {
      // Fetch discount data from product_categories table
      const { data: discountData, error } = await supabase
        .from('product_categories')
        .select('product_id, discount_percentage, discounted_price')
        .gt('discount_percentage', 0);

      if (error) {
        console.error('Error fetching discount data:', error);
      } else if (discountData && discountData.length > 0) {
        console.log('Discount data fetched:', discountData);

        // Create a map of product ID to discount info
        const discountMap = discountData.reduce((map, item) => {
          map[item.product_id] = {
            discount: item.discount_percentage,
            discountedPrice: item.discounted_price
          };
          return map;
        }, {} as Record<string, { discount: number, discountedPrice: number }>);

        // Update processed products with discount info
        return processedProducts.map(product => {
          const discountInfo = discountMap[product.id];
          if (discountInfo) {
            return {
              ...product,
              discount: discountInfo.discount,
              price: discountInfo.discountedPrice,
              originalPrice: product.price
            };
          }
          return product;
        });
      }
    }

    return processedProducts;
  } catch (error) {
    console.error(`Error getting ${promotionType} products:`, error);
    return [];
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const allProducts = await fetchProducts();
    const searchTermLower = query.toLowerCase();
    
    return allProducts.filter(
      p => p.name.toLowerCase().includes(searchTermLower) || 
           (p.description && p.description.toLowerCase().includes(searchTermLower))
    );
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};
