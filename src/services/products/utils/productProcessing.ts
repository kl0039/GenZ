import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import { fetchProductCategories } from "../queries/categoryUtils";
import { collectProductImages } from "@/utils/images";
import { convertGoogleDriveUrl } from "@/utils/images";

export const fetchAllProductsData = async () => {
  console.log('Fetching all products data');
  
  try {
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100); // Increased limit to ensure we get products
      
    if (productsError) {
      console.error('Error fetching products:', productsError);
      throw productsError;
    }
    
    if (!productsData || productsData.length === 0) {
      console.log('No products found in database');
      return [];
    }
    
    console.log(`Fetched ${productsData.length} products from database`);
    console.log('Sample product data:', productsData[0]);
    return productsData;
  } catch (error) {
    console.error('Failed to fetch all products:', error);
    return [];
  }
};

export const fetchProductByIdData = async (id: string) => {
  const { data: productData, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
    
  if (productError) {
    console.error('Error fetching product:', productError);
    throw productError;
  }
  
  // Log the raw product data to debug
  console.log('Raw product data from Supabase:', productData);
  return productData;
};

// Safe JSON parse helper function - only use for actual JSON fields
export const safeJsonParse = (jsonString: string | null | undefined, defaultValue: any = null) => {
  if (!jsonString) return defaultValue;
  
  // Don't try to parse if it doesn't look like JSON
  const trimmed = jsonString.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
    return defaultValue;
  }
  
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    console.log('Invalid JSON string:', jsonString);
    return defaultValue;
  }
};

// Function to extract nutrition information from plain text format
export const parseNutritionText = (text: string): Record<string, any> => {
  if (!text) return {};
  
  console.log('Parsing nutrition text:', text);
  
  const nutritionObj: Record<string, any> = {};
  const lines = text.split('\n').filter(line => line.trim());
  
  lines.forEach(line => {
    // Try to extract key-value pairs from formats like "Energy: 220kJ/52kCal"
    const match = line.match(/([^:]+):\s*(.*)/);
    if (match) {
      const [, key, value] = match;
      const cleanKey = key.trim().toLowerCase().replace(/\s+/g, '_');
      nutritionObj[cleanKey] = value.trim();
    }
  });
  
  console.log('Parsed nutrition object:', nutritionObj);
  return nutritionObj;
};

// Parse ingredient text to extract structured data
export const parseIngredientsText = (text: string): string[] => {
  if (!text) return [];
  
  // If text starts with "Ingredients:" extract the content
  let ingredientText = text;
  if (text.startsWith('Ingredients:')) {
    ingredientText = text.substring('Ingredients:'.length).trim();
  }
  
  // Extract the text before "Allergy Advice:" or "Storage:" if present
  const allergyIndex = ingredientText.indexOf('Allergy Advice:');
  const storageIndex = ingredientText.indexOf('Storage:');
  
  if (allergyIndex > -1) {
    ingredientText = ingredientText.substring(0, allergyIndex).trim();
  } else if (storageIndex > -1) {
    ingredientText = ingredientText.substring(0, storageIndex).trim();
  }
  
  // Split by commas and clean up each ingredient
  return ingredientText.split(',')
    .map(i => i.trim())
    .filter(i => i.length > 0);
};

// Enhanced function to handle products without category relationships
export const processProductsWithCategories = async (productsData: any[]) => {
  if (!productsData || productsData.length === 0) {
    console.log('[processProductsWithCategories] No product data to process');
    return [];
  }

  console.log(`[processProductsWithCategories] Input product count: ${productsData.length}`);
  console.log('[processProductsWithCategories] Input product IDs:', productsData.map(p => p.id));

  try {
    // ONLY skip null/undefined (not filtering by ID)
    const validProducts = productsData.filter(product => product != null && typeof product === 'object');
    if (validProducts.length < productsData.length) {
      console.warn(`[processProductsWithCategories] Filtered out ${productsData.length - validProducts.length} truly invalid products (null/undefined)`);
    }

    const productIds = validProducts.map(prod => prod.id);

    // Skip category fetch entirely if no IDs
    let categoriesByProductId: Record<string, any[]> = {};
    if (productIds.length > 0) {
      categoriesByProductId = await fetchProductCategories(productIds);
      console.log('[processProductsWithCategories] categoriesByProductId:', categoriesByProductId);

      // For products without a row in relationships, fallback to direct category
      const productsWithoutCategories = validProducts.filter(product =>
        !categoriesByProductId[product.id] || categoriesByProductId[product.id].length === 0
      );

      if (productsWithoutCategories.length > 0) {
        const categoryIds = [
          ...new Set(productsWithoutCategories.map(p => p.category_id).filter(Boolean))
        ];

        if (categoryIds.length > 0) {
          const { data: directCategories } = await supabase
            .from('categories')
            .select('*')
            .in('id', categoryIds);

          if (directCategories) {
            const categoryMap = directCategories.reduce((map, cat) => {
              map[cat.id] = cat;
              return map;
            }, {} as Record<string, any>);
            productsWithoutCategories.forEach(product => {
              if (product.category_id && categoryMap[product.category_id]) {
                categoriesByProductId[product.id] = [categoryMap[product.category_id]];
                console.log(`[processProductsWithCategories] Added direct category for product ${product.id}:`, categoryMap[product.category_id]);
              }
            });
          }
        }
      }
    }

    // Build output: allow products even if they lack category or have odd types
    const processedProducts: Product[] = validProducts.map((product) => {
      // Log the product pre-processing for audit
      console.log('[processProductsWithCategories] Processing product:', product);

      // Parse details with fallback
      let details: any = {};
      if (product.details) {
        if (typeof product.details === 'string') {
          const trimmed = product.details.trim();
          if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
            details = safeJsonParse(product.details, null) ?? { description: product.details };
          } else if (product.details.includes('Ingredients:')) {
            details = { ingredients: parseIngredientsText(product.details) };
            if (product.details.includes('Storage:')) {
              const storageMatch = product.details.match(/Storage:(.*?)(?=\n\n|\n[A-Z]|$)/s);
              if (storageMatch && storageMatch[1]) details.storage = storageMatch[1].trim();
            }
            if (product.details.includes('Allergy Advice:')) {
              const allergyMatch = product.details.match(/Allergy Advice:(.*?)(?=\n\n|\n[A-Z]|$)/s);
              if (allergyMatch && allergyMatch[1]) details.allergens = allergyMatch[1].trim();
            }
          } else {
            details = { description: product.details };
          }
        } else if (typeof product.details === 'object') {
          details = product.details;
        }
      }

      // Nutrition processing
      let nutrition = {};
      if (product.nutrition) {
        if (typeof product.nutrition === 'string') {
          const trimmed = product.nutrition.trim();
          if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
            nutrition = safeJsonParse(product.nutrition, null) ?? parseNutritionText(product.nutrition);
          } else {
            nutrition = parseNutritionText(product.nutrition);
          }
        } else if (typeof product.nutrition === 'object') {
          nutrition = product.nutrition;
        }
      }

      // Brands as array
      let brands: string[] = [];
      if (product.brands) {
        if (typeof product.brands === 'string') {
          const trimmed = product.brands.trim();
          if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
            const parsedBrands = safeJsonParse(product.brands, null);
            brands = parsedBrands && Array.isArray(parsedBrands) ? parsedBrands : [product.brands];
          } else {
            brands = [product.brands];
          }
        } else if (Array.isArray(product.brands)) {
          brands = product.brands;
        }
      }

      // FINAL inflated product object
      const p: Product = {
        id: product.id,
        name: product.name || "Unknown Product",
        price: typeof product.price === 'number' ? product.price : Number(product.price) || 0,
        image: product.image_url || product.backup_url || "https://placehold.co/300x300?text=No+Image",
        description: product.description || "",
        categories: categoriesByProductId[product.id] || [],
        stock_quantity: product.stock_quantity || 0,
        category_id: product.category_id,
        created_at: product.created_at,
        updated_at: product.updated_at,
        backup_url: product.backup_url,
        details: details,
        nutrition: nutrition,
        brands: brands,
        tags: brands,
        image_url_1: product.image_url_1 || null,
        image_url_2: product.image_url_2 || null,
        image_url_3: product.image_url_3 || null,
        image_url_4: product.image_url_4 || null,
        image_url: product.image_url,
        promotion: product.promotion,
        availability: product.availability,
      };
      // Extra trace
      console.log('[processProductsWithCategories] Final product:', {
        id: p.id,
        name: p.name,
        promotion: p.promotion,
        categories: p.categories.map((c: any) => c?.name).join(', '),
        availability: p.availability
      });
      return p;
    });

    if (processedProducts.length === 0) {
      console.warn('[processProductsWithCategories] WARNING: NO PRODUCTS RETURNED after processing. Input count was:', productsData.length);
    } else {
      console.log('[processProductsWithCategories] First product sample (after rework):', processedProducts[0]);
    }
    return processedProducts;
  } catch (error) {
    console.error('[processProductsWithCategories] Error:', error);
    // Return as much of the raw data as possible
    return (productsData || []).map(product => ({
      id: product.id,
      name: product.name || "Unknown Product",
      price: typeof product.price === 'number' ? product.price : Number(product.price) || 0,
      image: product.image_url || product.backup_url || "https://placehold.co/300x300?text=No+Image",
      description: product.description || "",
      categories: [],
      stock_quantity: product.stock_quantity || 0,
      category_id: product.category_id,
      image_url_1: product.image_url_1 || null,
      image_url_2: product.image_url_2 || null,
      image_url_3: product.image_url_3 || null,
      image_url_4: product.image_url_4 || null,
      availability: product.availability
    } as Product));
  }
};

export const convertToAppProduct = (productData: any): Product => {
  // Convert Google Drive URLs for all image fields
  const convertedImageUrl = productData.image_url ? convertGoogleDriveUrl(productData.image_url) : null;
  const convertedImage = productData.image ? convertGoogleDriveUrl(productData.image) : null;
  
  // Handle brands safely
  let brands: string[] = [];
  if (productData.brands && typeof productData.brands === 'string') {
    const trimmed = productData.brands.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      const parsed = safeJsonParse(productData.brands, null);
      brands = parsed && Array.isArray(parsed) ? parsed : [productData.brands];
    } else {
      brands = [productData.brands];
    }
  } else if (Array.isArray(productData.brands)) {
    brands = productData.brands;
  }
  
  return {
    id: productData.id,
    name: productData.name || '',
    price: Number(productData.price) || 0,
    // Use image_url as primary, fallback to image field, ensure we have the converted URL
    image: convertedImageUrl || convertedImage || '',
    image_url: convertedImageUrl,
    description: productData.description || '',
    stock_quantity: Number(productData.stock_quantity) || 0,
    category_id: productData.category_id,
    created_at: productData.created_at,
    updated_at: productData.updated_at,
    backup_url: productData.backup_url,
    details: safeJsonParse(productData.details),
    nutrition: safeJsonParse(productData.nutrition),
    // Convert all additional image URLs
    image_url_1: productData.image_url_1 ? convertGoogleDriveUrl(productData.image_url_1) : null,
    image_url_2: productData.image_url_2 ? convertGoogleDriveUrl(productData.image_url_2) : null,
    image_url_3: productData.image_url_3 ? convertGoogleDriveUrl(productData.image_url_3) : null,
    image_url_4: productData.image_url_4 ? convertGoogleDriveUrl(productData.image_url_4) : null,
    promotion: productData.promotion,
    availability: productData.availability,
    brands: brands,
    video_id: productData.video_id,
    discount: undefined,
    originalPrice: undefined,
    new: false,
    category: undefined,
    cuisine_type: undefined,
    tags: brands,
    stock: Number(productData.stock_quantity) || 0,
    rating: undefined,
    reviewCount: undefined,
    featured: false,
    popular: false,
  };
};
