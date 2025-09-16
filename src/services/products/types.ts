import { Product } from "@/types";

// Define database field constraints
export const DB_CONSTRAINTS = {
  NAME_MAX_LENGTH: 500,
  DESCRIPTION_MAX_LENGTH: 10000,
  BRANDS_MAX_LENGTH: 255
};

// Define the Supabase product structure
export interface SupabaseProduct {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  backup_url?: string;
  price: number;
  stock_quantity: number;
  category_id: string;
  brands?: string;
  promotion?: string;
  video_id?: string;
  details?: string;
  nutrition?: string;
  image_url_1?: string | null;
  image_url_2?: string | null;
  image_url_3?: string | null;
  image_url_4?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Convert from Supabase to app format
export const convertToAppProduct = (dbProduct: SupabaseProduct): Product => {
  // Log the conversion for debugging
  console.log("Converting DB product to app product:", dbProduct);
  
  // Handle brands field - treat as plain text and convert to array
  let brands: string[] = [];
  if (dbProduct.brands && typeof dbProduct.brands === 'string') {
    // If it looks like JSON, try to parse it, otherwise treat as plain text
    if (dbProduct.brands.trim().startsWith('[') || dbProduct.brands.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(dbProduct.brands);
        brands = Array.isArray(parsed) ? parsed : [dbProduct.brands];
      } catch (e) {
        console.log("Brands field is not JSON, treating as plain text:", dbProduct.brands);
        brands = [dbProduct.brands];
      }
    } else {
      // Treat as plain text
      brands = [dbProduct.brands];
    }
  }
  
  // Handle details field - keep as object but don't force JSON parsing
  let details: any = {};
  if (dbProduct.details && typeof dbProduct.details === 'string') {
    // Only try JSON parsing if it looks like JSON
    if (dbProduct.details.trim().startsWith('{') || dbProduct.details.trim().startsWith('[')) {
      try {
        details = JSON.parse(dbProduct.details);
      } catch (e) {
        console.log("Details field is not JSON, treating as plain text:", dbProduct.details);
        details = { description: dbProduct.details };
      }
    } else {
      // Treat as plain text description
      details = { description: dbProduct.details };
    }
  }
  
  // Handle nutrition field - keep as object but don't force JSON parsing
  let nutrition: any = {};
  if (dbProduct.nutrition && typeof dbProduct.nutrition === 'string') {
    // Only try JSON parsing if it looks like JSON
    if (dbProduct.nutrition.trim().startsWith('{') || dbProduct.nutrition.trim().startsWith('[')) {
      try {
        nutrition = JSON.parse(dbProduct.nutrition);
      } catch (e) {
        console.log("Nutrition field is not JSON, treating as plain text:", dbProduct.nutrition);
        nutrition = { info: dbProduct.nutrition };
      }
    } else {
      // Treat as plain text nutrition info
      nutrition = { info: dbProduct.nutrition };
    }
  }
  
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description || '',
    image: dbProduct.image_url || '',
    backup_url: dbProduct.backup_url,
    price: dbProduct.price,
    stock_quantity: dbProduct.stock_quantity,
    category_id: dbProduct.category_id,
    tags: brands,
    brands: brands,
    image_url_1: dbProduct.image_url_1,
    image_url_2: dbProduct.image_url_2,
    image_url_3: dbProduct.image_url_3,
    image_url_4: dbProduct.image_url_4,
    promotion: dbProduct.promotion as any,
    video_id: dbProduct.video_id,
    details: details,
    nutrition: nutrition,
    created_at: dbProduct.created_at,
    updated_at: dbProduct.updated_at,
    categories: [] // Initialize with empty array
  };
};

// Validate product data before conversion
export const validateProductData = (product: Product): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check name length
  if (product.name && product.name.length > DB_CONSTRAINTS.NAME_MAX_LENGTH) {
    errors.push(`Product name is too long (maximum ${DB_CONSTRAINTS.NAME_MAX_LENGTH} characters)`);
  }
  
  // Check description length
  if (product.description && product.description.length > DB_CONSTRAINTS.DESCRIPTION_MAX_LENGTH) {
    errors.push(`Product description is too long (maximum ${DB_CONSTRAINTS.DESCRIPTION_MAX_LENGTH} characters)`);
  }

  // Check brands length if it's a string
  if (product.brands && Array.isArray(product.brands)) {
    const brandsString = JSON.stringify(product.brands);
    if (brandsString.length > DB_CONSTRAINTS.BRANDS_MAX_LENGTH) {
      errors.push(`Brands data is too long (maximum ${DB_CONSTRAINTS.BRANDS_MAX_LENGTH} characters)`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Convert from app to Supabase format
export const convertToDbProduct = (appProduct: Product): SupabaseProduct => {
  // Log the conversion for debugging
  console.log("Converting app product to DB product:", appProduct);
  
  // Only include fields that exist in the database schema
  const result: SupabaseProduct = {
    id: appProduct.id || '',  // Empty string ID will be handled in addProduct function
    name: appProduct.name.substring(0, DB_CONSTRAINTS.NAME_MAX_LENGTH), // Ensure name isn't too long
    description: appProduct.description ? appProduct.description.substring(0, DB_CONSTRAINTS.DESCRIPTION_MAX_LENGTH) : '', // Ensure description isn't too long
    image_url: appProduct.image || '',
    backup_url: appProduct.backup_url,
    price: appProduct.price,
    stock_quantity: appProduct.stock_quantity,
    category_id: appProduct.category_id || '',
    brands: appProduct.brands ? JSON.stringify(appProduct.brands) : null,
    promotion: appProduct.promotion,
    video_id: appProduct.video_id,
    details: appProduct.details ? JSON.stringify(appProduct.details) : null,
    nutrition: appProduct.nutrition ? JSON.stringify(appProduct.nutrition) : null,
    image_url_1: appProduct.image_url_1,
    image_url_2: appProduct.image_url_2,
    image_url_3: appProduct.image_url_3,
    image_url_4: appProduct.image_url_4,
    created_at: appProduct.created_at,
    updated_at: appProduct.updated_at
  };
  
  return result;
};
