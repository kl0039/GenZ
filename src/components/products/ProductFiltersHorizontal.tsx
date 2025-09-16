
import React from 'react';
import { CuisineSelect } from './filters/CuisineSelect';
import { CategorySelect } from './filters/CategorySelect';
import { PriceRangeSlider } from './filters/PriceRangeSlider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductFiltersHorizontalProps {
  filters: {
    categories: string[];
    cuisines: string[];
    priceRange: [number, number];
    sortBy?: string;
    inStock?: boolean;
  };
  onFilterChange: (key: string, value: any) => void;
  onCategoryChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCuisineChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceRangeChange: (values: [number, number]) => void;
}

const ProductFiltersHorizontal: React.FC<ProductFiltersHorizontalProps> = ({
  filters,
  onFilterChange,
  onCategoryChange,
  onCuisineChange,
  onPriceRangeChange
}) => {
  return (
    <div className="w-full bg-white py-4 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          {onCategoryChange && (
            <CategorySelect
              selectedCategory={filters.categories[0] || "all"}
              onCategoryChange={onCategoryChange}
            />
          )}
          
          <CuisineSelect
            selectedCuisine={filters.cuisines[0] || "all"}
            onCuisineChange={onCuisineChange}
          />

          <Select defaultValue="any">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Halal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="any">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Vegan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="any">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Gluten Free" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>

          <PriceRangeSlider 
            value={filters.priceRange}
            onChange={onPriceRangeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductFiltersHorizontal;
