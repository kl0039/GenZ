
import { useState, useEffect } from 'react';
import { Category } from '@/types';
import { getCategories, getCategoryById, getCategoryPath } from '@/services/categories';

// Remove "Alcohol Drinks" and "Cracker & Chips" from cuisineTypes
export const cuisineTypes = [
  "Japanese", "Korean", "Thai", "Vietnamese", "Chinese", "Indian", 
  "Chocolate & Biscuit"
];

// Known category IDs for special handling
const knownCategoryIds = {
  '9d157b91-158c-47a6-80c3-7f9cb589e5a9': 'Alcohol Drinks',
  '3fcebe45-53e7-4801-b94e-0d4eb6be9c4e': 'Chocolate & Biscuit',
  '040bcbc9-7fff-4903-8a55-6c4e72113c23': 'Cracker & Chips',
  '619b9828-acf0-48a9-bffc-7a319b91b1d6': 'Egg Roll & Chocolate Roll'
};

// Known category slugs mapping to IDs for reverse lookup
const knownCategorySlugs = {
  'alcohol-drinks': '9d157b91-158c-47a6-80c3-7f9cb589e5a9',
  'chocolate-and-biscuit': '3fcebe45-53e7-4801-b94e-0d4eb6be9c4e',
  'cracker-and-chips': '040bcbc9-7fff-4903-8a55-6c4e72113c23',
  'egg-roll-and-chocolate-roll': '619b9828-acf0-48a9-bffc-7a319b91b1d6'
};

export const useProductCategory = (categoryParam: string | undefined) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [categoryPath, setCategoryPath] = useState<Category[]>([]);

  // Define isUuid function
  const isUuid = (str: string | undefined): boolean => {
    if (!str) return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  };
  
  // Helper to normalize category slugs - properly handles both single and double hyphens
  const normalizeSlug = (slug: string): string => {
    return slug.replace(/--+/g, '-'); // Convert any sequence of multiple hyphens to single
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
        console.log("Fetched categories:", fetchedCategories.length);

        if (categoryParam) {
          // Normalize the category param to handle multiple hyphens
          const normalizedCategoryParam = normalizeSlug(categoryParam);
          console.log(`Processing normalized category param: '${normalizedCategoryParam}' (original: '${categoryParam}')`);
          
          if (categoryParam === 'all') {
            console.log('Using "all" special category');
            setCurrentCategory(null);
            setCategoryPath([]);
            return;
          }
          
          // Check if this is a known category slug
          if (knownCategorySlugs[normalizedCategoryParam]) {
            const categoryId = knownCategorySlugs[normalizedCategoryParam];
            console.log(`Found known category ID for slug ${normalizedCategoryParam}: ${categoryId}`);
            
            // Try to fetch category details from ID
            const categoryDetails = await getCategoryById(categoryId);
            if (categoryDetails) {
              console.log("Fetched category details from slug mapping:", categoryDetails);
              setCurrentCategory(categoryDetails);
              
              const path = await getCategoryPath(categoryDetails.id);
              console.log("Category path:", path);
              setCategoryPath(path);
              return;
            } else {
              // Create virtual category if not found in database
              const knownName = knownCategoryIds[categoryId];
              const virtualCategory = {
                id: categoryId,
                name: knownName,
                description: `Browse our selection of ${knownName} products`,
                level: 0,
                path: [categoryId]
              } as Category;
              
              setCurrentCategory(virtualCategory);
              setCategoryPath([virtualCategory]);
              return;
            }
          }
          
          // For UUID format categories (direct database lookup)
          if (isUuid(normalizedCategoryParam)) {
            console.log(`Category '${normalizedCategoryParam}' is a UUID, fetching details...`);
            
            // Check if it's a known special category ID first
            if (knownCategoryIds[normalizedCategoryParam as keyof typeof knownCategoryIds]) {
              console.log(`Found special category ID: ${normalizedCategoryParam}`);
              const knownName = knownCategoryIds[normalizedCategoryParam as keyof typeof knownCategoryIds];
              
              // Try to find the category in the database first
              const categoryDetails = await getCategoryById(normalizedCategoryParam);
              if (categoryDetails) {
                console.log("Fetched category details:", categoryDetails);
                setCurrentCategory(categoryDetails);
                
                const path = await getCategoryPath(categoryDetails.id);
                console.log("Category path:", path);
                setCategoryPath(path);
                return;
              } 
              
              // If not found, create a virtual category
              const virtualCategory = {
                id: normalizedCategoryParam,
                name: knownName,
                description: `Browse our selection of ${knownName} products`,
                level: 0,
                path: [normalizedCategoryParam]
              } as Category;
              
              setCurrentCategory(virtualCategory);
              setCategoryPath([virtualCategory]);
              return;
            }
            
            // For regular UUID categories
            const categoryDetails = await getCategoryById(normalizedCategoryParam);
            if (categoryDetails) {
              console.log("Fetched category details:", categoryDetails);
              setCurrentCategory(categoryDetails);
              
              const path = await getCategoryPath(categoryDetails.id);
              console.log("Category path:", path);
              setCategoryPath(path);
            } else {
              console.log("No category found with ID:", normalizedCategoryParam);
              setCurrentCategory(null);
              setCategoryPath([]);
            }
          } 
          // For named categories (like URL-friendly slugs)
          else {
            console.log(`Category '${normalizedCategoryParam}' is a name/slug format`);
            
            // Handle special category names with "&" that might be encoded as "and" in the URL
            const hasSpecialHandling = Object.entries(knownCategoryIds).some(([id, name]) => {
              const nameSlug = name
                .toLowerCase()
                .replace(/&/g, '-and-')
                .replace(/\s+/g, '-');
              
              return nameSlug === normalizedCategoryParam;
            });
            
            if (hasSpecialHandling || cuisineTypes.includes(categoryParam)) {
              console.log(`Category '${normalizedCategoryParam}' needs special handling`);
              
              // Convert URL-friendly format back to readable name
              let readableName = normalizedCategoryParam
                .toLowerCase()
                .replace(/-and-/g, ' & ')
                .replace(/-/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              
              // First check if there is an existing category with this name
              const matchingCategory = fetchedCategories.find(cat => {
                const catNameSlug = cat.name
                  .toLowerCase()
                  .replace(/&/g, '-and-')
                  .replace(/\s+/g, '-');
                  
                return catNameSlug === normalizedCategoryParam.toLowerCase();
              });
              
              if (matchingCategory) {
                console.log(`Found matching category in database: ${matchingCategory.name}`);
                setCurrentCategory(matchingCategory);
                setCategoryPath([matchingCategory]);
              } else {
                // Create a virtual category for display
                const virtualCategory = {
                  id: normalizedCategoryParam,
                  name: readableName,
                  description: `Browse our selection of ${readableName} products`,
                  level: 0,
                  path: [normalizedCategoryParam]
                } as Category;
                
                setCurrentCategory(virtualCategory);
                setCategoryPath([virtualCategory]);
              }
            } else {
              // For other category names, try to find a match
              const matchingCategory = fetchedCategories.find(cat => {
                const catNameSlug = cat.name
                  .toLowerCase()
                  .replace(/&/g, '-and-')
                  .replace(/\s+/g, '-');
                  
                return catNameSlug === normalizedCategoryParam.toLowerCase();
              });
              
              if (matchingCategory) {
                console.log(`Found matching category by name: ${matchingCategory.name}`);
                setCurrentCategory(matchingCategory);
                setCategoryPath([matchingCategory]);
              } else {
                console.log(`No matching category found for: ${normalizedCategoryParam}`);
                
                // Create a virtual category as fallback
                const readableName = normalizedCategoryParam
                  .replace(/-and-/g, ' & ')
                  .replace(/-/g, ' ')
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
                
                const virtualCategory = {
                  id: normalizedCategoryParam,
                  name: readableName,
                  description: `Browse our selection of ${readableName} products`,
                  level: 0,
                  path: [normalizedCategoryParam]
                } as Category;
                
                setCurrentCategory(virtualCategory);
                setCategoryPath([virtualCategory]);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };

    fetchCategories();
  }, [categoryParam]);

  return {
    categories,
    currentCategory,
    categoryPath
  };
};
