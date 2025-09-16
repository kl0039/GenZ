
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import { convertToAppProduct } from "../types";
import { fetchProductCategories } from "./categoryUtils";

export const fetchAllProductsData = async () => {
  const { data: productsData, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('availability', 'Y'); // Only fetch available products
    
  if (productsError) {
    console.error('Error fetching products:', productsError);
    throw productsError;
  }
  
  if (!productsData || productsData.length === 0) {
    console.log('No available products found in database');
    return [];
  }
  
  return productsData;
};

export const fetchProductByIdData = async (id: string) => {
  const { data: productData, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('availability', 'Y') // Only fetch if available
    .single();
    
  if (productError) {
    console.error('Error fetching product:', productError);
    throw productError;
  }
  
  return productData;
};

export const processProductsWithCategories = async (productsData: any[]) => {
  const productIds = productsData.map(prod => prod.id);
  const categoriesByProductId = await fetchProductCategories(productIds);
  
  return productsData.map(product => {
    const productWithCategories = {
      ...product,
      categories: categoriesByProductId[product.id] || []
    };
    return convertToAppProduct(productWithCategories);
  });
};
