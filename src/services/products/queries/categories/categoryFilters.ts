
import { Product } from "@/types";

export const applySearchFilter = (products: Product[], searchTerm: string): Product[] => {
  if (!searchTerm || searchTerm.trim() === '') return products;
  
  const searchLower = searchTerm.toLowerCase();
  return products.filter(p => 
    p.name.toLowerCase().includes(searchLower) || 
    (p.description && p.description.toLowerCase().includes(searchLower))
  );
};

export const applyCategoryFilter = (products: Product[], categories: string[]): Product[] => {
  if (!categories || categories.length === 0 || categories.includes('all')) return products;
  
  console.log(`Applying category filter with ${categories.length} categories:`, categories);
  
  // Check if the category ID is valid UUID format
  const isUuidFormat = (str: string): boolean => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  };
  
  // Helper function to check if product matches a category
  const productMatchesCategory = (product: Product, category: string): boolean => {
    console.log(`Checking if product ${product.name} matches category ${category}`);
    
    // Direct category_id match (highest priority)
    if (product.category_id === category) {
      console.log(`Product ${product.name} matches direct category_id ${category}`);
      return true;
    }
    
    // Match against product's categories array by ID
    if (product.categories && product.categories.length > 0) {
      for (const cat of product.categories) {
        // Match by ID
        if (cat.id === category) {
          console.log(`Product ${product.name} matches category ID ${cat.id}`);
          return true;
        }
        
        // For non-UUID categories, also check name matching
        if (!isUuidFormat(category)) {
          const catNameLower = cat.name.toLowerCase();
          const categoryLower = category.toLowerCase().replace(/-/g, ' ');
          
          // Exact name match or contains match
          if (catNameLower === categoryLower || 
              catNameLower.includes(categoryLower) || 
              categoryLower.includes(catNameLower)) {
            console.log(`Product ${product.name} matches category name ${cat.name} with ${category}`);
            return true;
          }
        }
      }
    }
    
    return false;
  };
  
  // Filter products that match ANY of the specified categories
  const filteredProducts = products.filter(product => 
    categories.some(category => productMatchesCategory(product, category))
  );
  
  console.log(`Category filter: ${products.length} -> ${filteredProducts.length} products`);
  return filteredProducts;
};

export const applyCuisineFilter = (products: Product[], cuisines: string[]): Product[] => {
  if (!cuisines || cuisines.length === 0 || cuisines.includes('all')) return products;
  
  console.log(`Applying cuisine filter with ${cuisines.length} cuisines:`, cuisines);
  
  return products.filter(p => 
    cuisines.some(cuisine => {
      const cuisineLower = cuisine.toLowerCase();
      const nameLower = p.name.toLowerCase();
      const descLower = p.description ? p.description.toLowerCase() : '';
      
      // Also check in product's categories for name matches
      const hasCuisineCategory = p.categories && p.categories.some(cat => {
        const catNameLower = cat.name.toLowerCase();
        return catNameLower === cuisineLower || 
               catNameLower.includes(cuisineLower) || 
               cuisineLower.includes(catNameLower);
      });
      
      return nameLower.includes(cuisineLower) || 
             descLower.includes(cuisineLower) || 
             hasCuisineCategory;
    })
  );
};

export const applyPriceRangeFilter = (products: Product[], priceRange: [number, number]): Product[] => {
  if (!priceRange) return products;
  const [min, max] = priceRange;
  return products.filter(p => p.price >= min && p.price <= max);
};
