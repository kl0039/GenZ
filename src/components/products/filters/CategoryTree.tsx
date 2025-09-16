
import React from 'react';
import { Category } from '@/types';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CategoryTreeProps {
  categories: Category[];
  selectedCategories: Category[];
  expandedCategories: Record<string, boolean>;
  onCategoryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleCategory: (categoryId: string) => void;
}

export const CategoryTree: React.FC<CategoryTreeProps> = ({
  categories,
  selectedCategories,
  expandedCategories,
  onCategoryChange,
  onToggleCategory
}) => {
  const renderCategoryItem = (category: Category, level = 0) => {
    const isExpanded = expandedCategories[category.id];
    const hasChildren = category.children && category.children.length > 0;
    
    return (
      <React.Fragment key={category.id}>
        <div className="flex items-center" style={{ marginLeft: `${level * 12}px` }}>
          {hasChildren && (
            <button
              type="button"
              onClick={() => onToggleCategory(category.id)}
              className="mr-2 focus:outline-none flex-shrink-0"
            >
              {isExpanded ? (
                <ChevronDown size={14} className="text-gray-400" />
              ) : (
                <ChevronRight size={14} className="text-gray-400" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-4" />}
          <label className="flex items-center cursor-pointer flex-1">
            <input 
              type="checkbox" 
              value={category.id}
              onChange={(e) => {
                console.log(`Category checkbox changed: ${category.id} (${category.name}) - checked: ${e.target.checked}`);
                onCategoryChange(e);
              }}
              checked={selectedCategories.some(cat => cat.id === category.id)}
              className="text-asianred-600 rounded mr-2" 
            />
            <span className="text-sm">{category.name}</span>
          </label>
        </div>
        
        {isExpanded && hasChildren && (
          <div className="ml-2">
            {category.children!.map(child => renderCategoryItem(child, level + 1))}
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto">
      {categories.map(category => renderCategoryItem(category))}
    </div>
  );
};
