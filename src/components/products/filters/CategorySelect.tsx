
import React, { useEffect } from 'react';
import { Category } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/services/categories';

interface CategorySelectProps {
  selectedCategory: string;
  onCategoryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  const { data: categoriesData = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const rootCategories = categoriesData.filter(cat => !cat.parent_id);
  
  // Debug what categories are available and what's currently selected
  useEffect(() => {
    console.log('Available frontend filter categories:', rootCategories);
    console.log('Currently selected category:', selectedCategory);
  }, [rootCategories, selectedCategory]);

  return (
    <Select
      value={selectedCategory}
      onValueChange={(value) => {
        console.log(`Selected frontend category filter: ${value}`);
        const e = {
          target: { value, checked: true, type: 'checkbox' }
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        onCategoryChange(e);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by Category" />
      </SelectTrigger>
      <SelectContent>
        {isCategoriesLoading ? (
          <SelectItem value="loading" disabled>Loading categories...</SelectItem>
        ) : rootCategories.length === 0 ? (
          <SelectItem value="none" disabled>No categories available</SelectItem>
        ) : (
          <>
            <SelectItem value="all">All Categories</SelectItem>
            {rootCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </>
        )}
      </SelectContent>
    </Select>
  );
};
