
import { useState, useEffect, useCallback } from 'react';

interface Filters {
  categories: string[];
  cuisines: string[];
  priceRange: [number, number];
  inStock: boolean;
  sortBy: string;
}

export const useProductFilters = (initialFilters: Filters) => {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  // Memoize the handler functions to prevent recreation on each render
  const handleFilterChange = useCallback((key: string, value: any) => {
    console.log(`Changing filter ${key} to:`, value);
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isChecked = e.target.checked;
    setFilters(prev => {
      const categories = isChecked 
        ? [...prev.categories, value] 
        : prev.categories.filter(cat => cat !== value);
      return { ...prev, categories };
    });
  }, []);

  const handleCuisineChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isChecked = e.target.checked;
    setFilters(prev => {
      const cuisines = isChecked 
        ? [...prev.cuisines, value] 
        : prev.cuisines.filter(cuisine => cuisine !== value);
      return { ...prev, cuisines };
    });
  }, []);

  const handlePriceRangeChange = useCallback((values: [number, number]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: values
    }));
  }, []);

  return {
    filters,
    handleFilterChange,
    handleCategoryChange,
    handleCuisineChange,
    handlePriceRangeChange
  };
};
