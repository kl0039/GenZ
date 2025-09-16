
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import { convertToDbProduct, convertToAppProduct, validateProductData } from "./types";

// Function to update product details
export const updateProductDetails = async (productId: string, product: Product): Promise<Product | null> => {
  try {
    console.log("Updating product with data:", product);
    
    // Validate product data before conversion
    const validation = validateProductData(product);
    if (!validation.valid) {
      console.error("Product validation failed:", validation.errors);
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    // Convert to database format
    const dbProduct = convertToDbProduct(product);
    
    console.log("Sending to database:", dbProduct);

    const { data, error } = await supabase
      .from('products')
      .update(dbProduct)
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }

    if (!data) {
      console.log('No data found for ID:', productId);
      return null;
    }

    console.log("Product updated successfully:", data);
    
    // Convert back to app format
    return convertToAppProduct(data);
  } catch (error) {
    console.error('Error in updateProductDetails:', error);
    throw error;
  }
};

export const addProduct = async (product: Product): Promise<Product | null> => {
  try {
    console.log("Adding product with data:", product);
    
    // Validate product data before conversion
    const validation = validateProductData(product);
    if (!validation.valid) {
      console.error("Product validation failed:", validation.errors);
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    // Convert to database format
    const dbProduct = convertToDbProduct(product);
    
    // Remove the temporary ID for new products
    const { id, ...productDataWithoutId } = dbProduct;
    
    console.log("Sending to database:", productDataWithoutId);
    
    const { data, error } = await supabase
      .from('products')
      .insert([productDataWithoutId])
      .select()
      .single();

    if (error) {
      console.error('Error adding product:', error);
      throw error;
    }

    if (!data) {
      console.error('No data returned from insert operation');
      return null;
    }

    console.log("Product added successfully:", data);
    
    // Convert back to app format and include categories
    const result = convertToAppProduct(data);
    result.categories = product.categories || [];
    
    return result;
  } catch (error) {
    console.error('Error in addProduct:', error);
    throw error;
  }
};

// Function to delete a product by ID
export const deleteProduct = async (productId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }

    console.log("Product deleted successfully:", productId);
    return true;
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    return false;
  }
};
