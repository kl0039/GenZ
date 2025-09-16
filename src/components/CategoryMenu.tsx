import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Category } from '@/types';
import { getCategories } from '@/services/categories';

// List of promotional categories to hide
const promotionalCategories = [
  "Buy 2 Get 3 Special",
  "Free Delivery Offers",
  "Limited Time Offers"
];

// Map category names to uploaded icon image URLs - only for level 0 categories
const categoryIcons: Record<string, string> = {
  "Alcohol": "/lovable-uploads/a805792a-a415-4b59-aea5-149f315559ff.png",
  "Beauty & Health": "/lovable-uploads/5e549941-996e-4d34-bdf3-0cfd5384e170.png",
  "Confectionery and Snacks": "/lovable-uploads/d3530b9d-914d-4e4d-a4e3-571cad7a5fe5.png",
  "Cooking": "/lovable-uploads/9533c6ad-250c-4e8f-9447-2243a1ebbd89.png",
  "Cooking Noodles": "/lovable-uploads/1375b3ea-044b-44dd-ae4b-73d456253209.png",
  "Drinks": "/lovable-uploads/680f929d-2a65-4f43-863b-ee98f6870ec7.png",
  "Instant Noodles": "/lovable-uploads/40ea7d94-c308-42bf-b95a-20c6e898647f.png"
};

interface CategoryLevelProps {
  categories: Category[];
  onSelectCategory: (category: Category) => void;
  onNavigate: (category: Category) => void;
  isLevel0?: boolean;
}

const CategoryLevel: React.FC<CategoryLevelProps> = ({ categories, onSelectCategory, onNavigate, isLevel0 = false }) => {
  // Filter out promotional categories
  const filteredCategories = categories.filter(category =>
    !promotionalCategories.includes(category.name)
  );

  return (
    <div className="flex-none h-[400px] overflow-y-auto border-r w-[280px] bg-white">
      {filteredCategories.length === 0 ? (
        <div className="p-4 text-gray-500">No categories found</div>
      ) : (
        filteredCategories.map((category) => {
          let iconSrc = null;
          
          if (isLevel0) {
            // For level 0 categories, use the predefined icons
            iconSrc = categoryIcons[category.name];
          } else {
            // For level 1+ categories, use their own image_url from database
            iconSrc = category.image_url;
          }
          
          const hasChildren = category.children && category.children.length > 0;
          
          return (
            <button
              key={category.id}
              onClick={() => {
                console.log('Category clicked:', category.name, 'Has children:', hasChildren);
                // Always navigate to show products for this category
                onNavigate(category);
                // Also select it for the dropdown if it has children
                if (hasChildren) {
                  onSelectCategory(category);
                }
              }}
              onMouseEnter={() => {
                // For level 0 categories, show children immediately on hover
                if (isLevel0 && hasChildren) {
                  onSelectCategory(category);
                }
              }}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 text-left"
            >
              <div className="flex items-center gap-3">
                {iconSrc ? (
                  <img
                    src={iconSrc}
                    alt={`${category.name} icon`}
                    className="h-6 w-6 object-cover rounded-full"
                  />
                ) : (
                  <div className="h-6 w-6 bg-gray-200 rounded-full" />
                )}
                <span className="text-sm font-medium text-gray-700">{category.name}</span>
              </div>
              {hasChildren && (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
            </button>
          );
        })
      )}
    </div>
  );
};

const CategoryMenu = () => {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // Filter promotional categories from root categories
  const rootCategories = categories
    .filter(cat => !cat.parent_id)
    .filter(cat => !promotionalCategories.includes(cat.name));

  const handleSelectCategory = (category: Category, level: number) => {
    const newSelected = selectedCategories.slice(0, level);
    newSelected[level] = category;
    setSelectedCategories(newSelected);
  };

  const handleNavigateToCategory = (category: Category) => {
    console.log('Navigating to category:', category.name, 'with id:', category.id);
    setIsOpen(false);

    // Fix URL formatting to ensure consistent format across all categories
    const urlFriendlyName = category.name
      .toLowerCase()
      .replace(/&/g, '-and-')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    console.log(`Generated URL slug: ${urlFriendlyName}`);
    navigate(`/products/${urlFriendlyName}`);
  };

  const getLevelCategories = (level: number) => {
    if (level === 0) return rootCategories;
    const parentCategory = selectedCategories[level - 1];

    // If there are children, filter out promotional categories
    if (parentCategory?.children) {
      return parentCategory.children.filter(child =>
        !promotionalCategories.includes(child.name)
      );
    }

    return [];
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return <div className="text-gray-500">Loading categories...</div>;
  }

  if (error) {
    console.error('Error loading categories:', error);
    return <div className="text-red-500">Error loading categories</div>;
  }

  return (
    <div className="relative z-50" ref={menuRef}>
      <button
        className="hidden md:flex items-center gap-2 text-[#FEF7CD] hover:text-[#FEF7CD]/80 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
      >
        <span>Categories</span>
        <ChevronRight className="h-4 w-4 rotate-90 text-[#FEF7CD]" />
      </button>

      <button
        className="md:hidden flex items-center gap-2 text-[#FEF7CD] hover:text-[#FEF7CD]/80 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Categories</span>
        <ChevronRight className="h-4 w-4 rotate-90 text-[#FEF7CD]" />
      </button>

      {isOpen && (
        <>
          <div
            className="absolute left-0 top-full mt-2 flex bg-white shadow-lg rounded-md overflow-hidden z-50"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <CategoryLevel
              categories={getLevelCategories(0)}
              onSelectCategory={(category) => handleSelectCategory(category, 0)}
              onNavigate={handleNavigateToCategory}
              isLevel0={true}
            />

            {selectedCategories.map((selectedCategory, index) => (
              selectedCategory?.children && selectedCategory.children.length > 0 && (
                <CategoryLevel
                  key={selectedCategory.id}
                  categories={getLevelCategories(index + 1)}
                  onSelectCategory={(category) => handleSelectCategory(category, index + 1)}
                  onNavigate={handleNavigateToCategory}
                  isLevel0={false}
                />
              )
            ))}
          </div>

          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default CategoryMenu;
