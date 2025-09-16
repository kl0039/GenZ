import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

// Convert Supabase product data to app Product format
const mapProductDtoToProduct = (productData: any): Product => {
  return {
    id: productData.id,
    name: productData.name,
    description: productData.description || '',
    price: Number(productData.price),
    image: productData.image_url || '',
    category_id: productData.category_id,
    stock_quantity: productData.stock_quantity || 0,
    created_at: productData.created_at,
    updated_at: productData.updated_at,
    video_id: productData.video_id,
    categories: [] // Initialize with empty array, can be populated later
  };
};

// Map Product to Supabase format for inserts/updates
const mapProductToDto = (product: Product) => {
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    image_url: product.image,
    category_id: product.category_id,
    stock_quantity: product.stock_quantity,
    video_id: product.video_id
  };
};

// Fetch all products
export const fetchAllProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(item => ({
      ...mapProductDtoToProduct(item),
      category: item.categories?.name
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Create a new product
export const createProduct = async (product: Product): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert(mapProductToDto(product))
      .select('*, categories(name)')
      .single();

    if (error) {
      throw error;
    }

    return {
      ...mapProductDtoToProduct(data),
      category: data.categories?.name
    };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update an existing product
export const updateProduct = async (product: Product): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(mapProductToDto(product))
      .eq('id', product.id)
      .select('*, categories(name)')
      .single();

    if (error) {
      throw error;
    }

    return {
      ...mapProductDtoToProduct(data),
      category: data.categories?.name
    };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Fetch a product by ID
export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return {
      ...mapProductDtoToProduct(data),
      category: data.categories?.name
    };
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
};

// Fetch all categories for product selection
export const fetchCategories = async (): Promise<{ id: string; name: string }[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .order('name');

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};
