import { supabase } from '@/integrations/supabase/client';
import { logAdminAction } from './adminAuth';
import { Product } from '@/types';

export interface ProductSearchFilters {
  category?: string;
  availability?: 'Y' | 'N';
  lowStock?: boolean;
  search?: string;
}

export interface BulkProductUpdate {
  productIds: string[];
  updates: Partial<Product>;
}

export interface ProductStatistics {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  categoryBreakdown: Record<string, number>;
  topCategories: Array<{ name: string; count: number }>;
}

/**
 * Search and filter products with advanced options
 */
export const searchProducts = async (filters: ProductSearchFilters = {}): Promise<Product[]> => {
  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        categories:category_id (name)
      `);

    // Apply filters
    if (filters.category) {
      query = query.eq('category_id', filters.category);
    }

    if (filters.availability) {
      query = query.eq('availability', filters.availability);
    }

    if (filters.lowStock) {
      query = query.lt('stock_quantity', 10);
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%, description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    await logAdminAction('search_products', 'products', undefined, undefined, filters);

    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      price: Number(item.price),
      image: item.image_url || '',
      category_id: item.category_id,
      stock_quantity: item.stock_quantity || 0,
      availability: item.availability,
      created_at: item.created_at,
      updated_at: item.updated_at,
      video_id: item.video_id,
      categories: [],
      category: item.categories?.name
    }));
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

/**
 * Bulk update multiple products
 */
export const bulkUpdateProducts = async (bulkUpdate: BulkProductUpdate): Promise<void> => {
  try {
    const updateData: any = {};
    
    if (bulkUpdate.updates.price !== undefined) {
      updateData.price = bulkUpdate.updates.price;
    }
    if (bulkUpdate.updates.availability !== undefined) {
      updateData.availability = bulkUpdate.updates.availability;
    }
    if (bulkUpdate.updates.stock_quantity !== undefined) {
      updateData.stock_quantity = bulkUpdate.updates.stock_quantity;
    }
    if (bulkUpdate.updates.category_id !== undefined) {
      updateData.category_id = bulkUpdate.updates.category_id;
    }

    const { error } = await supabase
      .from('products')
      .update(updateData)
      .in('id', bulkUpdate.productIds);

    if (error) throw error;

    await logAdminAction(
      'bulk_update_products',
      'products',
      bulkUpdate.productIds.join(','),
      undefined,
      { count: bulkUpdate.productIds.length, updates: updateData }
    );
  } catch (error) {
    console.error('Error bulk updating products:', error);
    throw error;
  }
};

/**
 * Export products to CSV format
 */
export const exportProductsToCSV = async (filters: ProductSearchFilters = {}): Promise<string> => {
  try {
    const products = await searchProducts(filters);

    const headers = [
      'Product ID',
      'Name',
      'Description',
      'Price',
      'Stock',
      'Availability',
      'Category',
      'Created At'
    ];

    const csvContent = [
      headers.join(','),
      ...products.map(product => [
        product.id.substring(0, 8),
        `"${product.name}"`,
        `"${product.description}"`,
        product.price,
        product.stock_quantity,
        product.availability === 'Y' ? 'Available' : 'Unavailable',
        `"${product.category || 'Uncategorized'}"`,
        new Date(product.created_at || '').toLocaleDateString()
      ].join(','))
    ].join('\n');

    await logAdminAction('export_products', 'products', undefined, undefined, { count: products.length });

    return csvContent;
  } catch (error) {
    console.error('Error exporting products:', error);
    throw error;
  }
};

/**
 * Get product statistics
 */
export const getProductStatistics = async (): Promise<ProductStatistics> => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        categories:category_id (name)
      `);

    if (error) throw error;

    const stats: ProductStatistics = {
      totalProducts: products?.length || 0,
      lowStockCount: 0,
      outOfStockCount: 0,
      categoryBreakdown: {},
      topCategories: []
    };

    products?.forEach(product => {
      const stock = product.stock_quantity || 0;
      if (stock === 0) {
        stats.outOfStockCount++;
      } else if (stock < 10) {
        stats.lowStockCount++;
      }

      const categoryName = product.categories?.name || 'Uncategorized';
      stats.categoryBreakdown[categoryName] = (stats.categoryBreakdown[categoryName] || 0) + 1;
    });

    stats.topCategories = Object.entries(stats.categoryBreakdown)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return stats;
  } catch (error) {
    console.error('Error getting product statistics:', error);
    throw error;
  }
};

/**
 * Update product stock
 */
export const updateProductStock = async (productId: string, newStock: number): Promise<void> => {
  try {
    // Get current product for audit log
    const { data: currentProduct } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    const { error } = await supabase
      .from('products')
      .update({ stock_quantity: newStock })
      .eq('id', productId);

    if (error) throw error;

    await logAdminAction(
      'update_product_stock',
      'products',
      productId,
      { stock_quantity: currentProduct?.stock_quantity },
      { stock_quantity: newStock }
    );
  } catch (error) {
    console.error('Error updating product stock:', error);
    throw error;
  }
};

/**
 * Delete multiple products
 */
export const bulkDeleteProducts = async (productIds: string[]): Promise<void> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .in('id', productIds);

    if (error) throw error;

    await logAdminAction(
      'bulk_delete_products',
      'products',
      productIds.join(','),
      undefined,
      { count: productIds.length }
    );
  } catch (error) {
    console.error('Error bulk deleting products:', error);
    throw error;
  }
};

/**
 * Get low stock alerts
 */
export const getLowStockAlerts = async (threshold = 10) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        categories:category_id (name)
      `)
      .lt('stock_quantity', threshold)
      .order('stock_quantity', { ascending: true });

    if (error) throw error;

    return (products || []).map(product => ({
      id: product.id,
      name: product.name,
      stock_quantity: product.stock_quantity,
      category: product.categories?.name || 'Uncategorized',
      image_url: product.image_url
    }));
  } catch (error) {
    console.error('Error getting low stock alerts:', error);
    return [];
  }
};