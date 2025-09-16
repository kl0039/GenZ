
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Category } from '@/types';
import { Badge } from '@/components/ui/badge';
import { getCategories } from '@/services/categories';
import { CategoryTree } from './filters/CategoryTree';
import { CuisineFilter } from './filters/CuisineFilter';

interface ProductFiltersProps {
  activeFilters: string[];
  filters: {
    categories: string[];
    cuisines: string[];
    priceRange: [number, number];
    selectedCategories?: Category[];
    sortBy?: string;
    inStock?: boolean;
  };
  onFilterChange: (key: string, value: any) => void;
  onCategoryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCuisineChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceRangeChange: (value: [number, number]) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  activeFilters,
  filters,
  onFilterChange,
  onCategoryChange,
  onCuisineChange,
  onPriceRangeChange
}) => {
  const [categoryTree, setCategoryTree] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(filters.priceRange);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await getCategories();
        setCategoryTree(categories);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    setLocalPriceRange(filters.priceRange);
  }, [filters.priceRange]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handlePriceRangeChange = (values: number[]) => {
    const priceRange = values as [number, number];
    setLocalPriceRange(priceRange);
    const timer = setTimeout(() => {
      onPriceRangeChange(priceRange);
    }, 200);
    return () => clearTimeout(timer);
  };

  const handleApplyFilters = () => {
    console.log('Applying filters:', {
      categories: filters.categories,
      cuisines: filters.cuisines,
      priceRange: localPriceRange,
      inStock: true
    });
    onFilterChange('inStock', true);
    onPriceRangeChange(localPriceRange);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm sticky top-40">
      <h3 className="font-semibold mb-4">Categories</h3>
      {activeFilters.length > 0 && (
        <div className="mb-4">
          {activeFilters.map((filter, index) => (
            <label key={index} className="flex items-center cursor-pointer mb-2">
              <input 
                type="checkbox" 
                value={filter}
                onChange={onCategoryChange}
                checked={filters.categories.includes(filter)}
                className="text-asianred-600 rounded mr-2" 
              />
              <span>{filter}</span>
            </label>
          ))}
        </div>
      )}

      <CategoryTree
        categories={categoryTree}
        selectedCategories={filters.selectedCategories || []}
        expandedCategories={expandedCategories}
        onCategoryChange={onCategoryChange}
        onToggleCategory={toggleCategory}
      />

      <h3 className="font-semibold mt-8 mb-4">Price Range</h3>
      <div className="space-y-2">
        <Slider 
          defaultValue={[0, 100]}
          max={100}
          step={1}
          value={localPriceRange}
          onValueChange={handlePriceRangeChange}
          className="w-full accent-asianred-600" 
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>£{localPriceRange[0]}</span>
          <span>£{localPriceRange[1]}</span>
        </div>
      </div>

      <h3 className="font-semibold mt-8 mb-4">Cuisine</h3>
      <CuisineFilter
        selectedCuisines={filters.cuisines}
        onCuisineChange={onCuisineChange}
      />

      <Button 
        className="w-full mt-6 bg-asianred-600 hover:bg-asianred-700 text-white"
        onClick={handleApplyFilters}
      >
        Apply Filters
      </Button>
    </div>
  );
};

export default ProductFilters;
