import { useQuery } from '@tanstack/react-query';
import { getProductsByCategory } from '@/services/products';
import { ProductFilters } from '@/types';

// Known category IDs that need special handling
const specialCategoryIds = {
  'alcohol-drinks': '9d157b91-158c-47a6-80c3-7f9cb589e5a9',
  'chocolate-and-biscuit': '3fcebe45-53e7-4801-b94e-0d4eb6be9c4e',
  'cracker-and-chips': '040bcbc9-7fff-4903-8a55-6c4e72113c23', 
  'egg-roll-and-chocolate-roll': '619b9828-acf0-48a9-bffc-7a319b91b1d6',
};

// Helper to normalize URL slugs - properly handles both single and double hyphens
const normalizeSlug = (slug: string | undefined): string | undefined => {
  if (!slug) return undefined;
  
  // Replace all occurrences of multiple hyphens with a single hyphen
  return slug.replace(/--+/g, '-');
};

// Enhanced function to find category by name/slug - searches all categories with better & handling
const findCategoryBySlug = async (slug: string): Promise<string | null> => {
  try {
    // Generate multiple search variations to handle different formats
    const searchVariations = [
      // Handle triple hyphens as " - " (space-dash-space) for categories like "Instant Noodles - Packs"
      slug.replace(/---/g, ' - '),
      // Handle double hyphens as "and" replacements
      slug.replace(/--/g, ' & '),  // "pickled--and--preserved-vegetables" -> "pickled & preserved vegetables"
      slug.replace(/--/g, ' and '), // "pickled--and--preserved-vegetables" -> "pickled and preserved vegetables"
      slug.replace(/-and-/g, ' & '), // "pickled-and-preserved-vegetables" -> "pickled & preserved vegetables"
      slug.replace(/-and-/g, ' and '), // Keep "and" version
      slug.replace(/-/g, ' '), // "pickled-preserved-vegetables" -> "pickled preserved vegetables"
      slug.replace(/-/g, ' & '), // "pickled-preserved-vegetables" -> "pickled & preserved vegetables"
      slug, // Keep original slug
    ];
    
    console.log(`Searching for category with slug "${slug}", variations:`, searchVariations);
    
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Build comprehensive OR query for all variations
    const searchConditions = searchVariations.map(variation => 
      `name.ilike.%${variation}%`
    ).join(',');
    
    const { data: categories } = await supabase
      .from('categories')
      .select('id, name')
      .or(searchConditions);
    
    if (categories && categories.length > 0) {
      console.log(`Found ${categories.length} potential category matches for "${slug}":`, categories);
      
      // Priority 1: Exact name match with any variation
      const exactMatch = categories.find(cat => 
        searchVariations.some(variation => 
          cat.name.toLowerCase() === variation.toLowerCase()
        )
      );
      if (exactMatch) {
        console.log(`Found exact match: ${exactMatch.name} -> ${exactMatch.id}`);
        return exactMatch.id;
      }
      
      // Priority 2: Partial match prioritizing & symbol categories
      const ampersandMatch = categories.find(cat => 
        cat.name.includes('&') && searchVariations.some(variation =>
          cat.name.toLowerCase().includes(variation.toLowerCase())
        )
      );
      if (ampersandMatch) {
        console.log(`Found ampersand category match: ${ampersandMatch.name} -> ${ampersandMatch.id}`);
        return ampersandMatch.id;
      }
      
      // Priority 3: Match with " - " (dash with spaces) for categories like "Instant Noodles - Packs"
      const dashMatch = categories.find(cat => 
        cat.name.includes(' - ') && searchVariations.some(variation =>
          cat.name.toLowerCase().includes(variation.toLowerCase())
        )
      );
      if (dashMatch) {
        console.log(`Found dash-separated category match: ${dashMatch.name} -> ${dashMatch.id}`);
        return dashMatch.id;
      }
      
      // Priority 4: Best word-based match
      const wordMatches = categories.filter(cat => {
        const catWords = cat.name.toLowerCase().split(/[\s&\-]+/);
        return searchVariations.some(variation => {
          const searchWords = variation.toLowerCase().split(/[\s&\-]+/);
          return searchWords.filter(word => word.length > 2).every(word => 
            catWords.some(catWord => catWord.includes(word) || word.includes(catWord))
          );
        });
      });
      
      if (wordMatches.length > 0) {
        console.log(`Found word-based match: ${wordMatches[0].name} -> ${wordMatches[0].id}`);
        return wordMatches[0].id;
      }
      
      // Priority 5: Any partial match
      console.log(`Using first partial match: ${categories[0].name} -> ${categories[0].id}`);
      return categories[0].id;
    }
    
    console.log(`No category found for slug "${slug}"`);
    return null;
  } catch (error) {
    console.error('Error finding category by slug:', error);
    return null;
  }
};

interface UseProductDataProps {
  category: string | undefined;
  filters: ProductFilters;
  searchTerm: string;
}

export const useProductData = ({ category, filters, searchTerm }: UseProductDataProps) => {
  // Don't normalize the category slug too early - preserve double hyphens for proper matching
  const originalCategory = category;
  
  // Log the original category for debugging
  console.log('Original category from URL:', originalCategory);
  
  // ---- FIX: Serialize filters object for React Query cache key ----
  const filtersKey = JSON.stringify(filters);

  return useQuery({
    queryKey: ['products', originalCategory, filtersKey, searchTerm],
    queryFn: async () => {
      console.log('Running query function with category:', originalCategory);
      console.log('Filters:', filters);
      console.log('Search term:', searchTerm);
      
      let categoryToUse = originalCategory || 'all';
      
      // Check if this is a special category slug that maps to an ID
      const normalizedForSpecial = normalizeSlug(originalCategory);
      if (normalizedForSpecial && specialCategoryIds[normalizedForSpecial as keyof typeof specialCategoryIds]) {
        categoryToUse = specialCategoryIds[normalizedForSpecial as keyof typeof specialCategoryIds];
        console.log(`Using special category ID: ${categoryToUse}`);
      } 
      // For all other category slugs, try to find the actual category ID from database
      else if (originalCategory && originalCategory !== 'all') {
        const foundCategoryId = await findCategoryBySlug(originalCategory);
        if (foundCategoryId) {
          categoryToUse = foundCategoryId;
          console.log(`Found category ID for slug "${originalCategory}": ${categoryToUse}`);
        } else {
          console.log(`No category found for slug "${originalCategory}", using slug for text-based matching`);
          // Keep the original slug for text-based matching in the query
          categoryToUse = originalCategory;
        }
      }
      
      // Deep clone the filters to avoid modifying the original
      const fetchOptions = {
        priceRange: filters.priceRange,
        inStock: filters.inStock,
        sortBy: filters.sortBy,
        cuisines: filters.cuisines.length > 0 && !filters.cuisines.includes('all') ? 
          [...filters.cuisines] : 
          undefined,
        searchTerm: searchTerm.trim() !== '' ? searchTerm : undefined,
        categories: [] as string[]
      };
      
      // Add any additional categories from filters (but don't override the main category)
      if (filters.categories.length > 0) {
        filters.categories.forEach(cat => {
          const categoryToAdd = typeof cat === 'string' ? cat : cat;
          if (categoryToAdd && !fetchOptions.categories.includes(categoryToAdd)) {
            fetchOptions.categories.push(categoryToAdd);
          }
        });
      }
      
      // If we have no additional categories, set to undefined for API compatibility
      if (fetchOptions.categories.length === 0) {
        fetchOptions.categories = undefined;
      }
      
      console.log('Final fetch options:', fetchOptions);
      console.log('Category to use for fetching:', categoryToUse);
      
      try {
        const fetchedProducts = await getProductsByCategory(categoryToUse, fetchOptions);
        console.log(`Fetched ${fetchedProducts.length} products for category ${categoryToUse}`);
        return fetchedProducts;
      } catch (error) {
        console.error('Error fetching products:', error);
        // Return empty array on error instead of throwing
        return [];
      }
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
};
