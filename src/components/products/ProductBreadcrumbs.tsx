
import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";
import { Category } from "@/types";

interface ProductBreadcrumbsProps {
  currentCategory: Category | null;
  categoryPath: Category[];
}

const ProductBreadcrumbs: React.FC<ProductBreadcrumbsProps> = ({ currentCategory, categoryPath }) => {
  const getCategoryUrl = (category: Category) => {
    // Special handling for known category IDs
    const knownCategoryNames: Record<string, string> = {
      '9d157b91-158c-47a6-80c3-7f9cb589e5a9': 'alcohol-drinks',
      '3fcebe45-53e7-4801-b94e-0d4eb6be9c4e': 'chocolate-and-biscuit',
      'a3bd7585-1111-4ef3-9c0d-954286bff2e7': 'cracker-and-chips',
      '619b9828-acf0-48a9-bffc-7a319b91b1d6': 'egg-roll-and-chocolate-roll'
    };
    
    // Check if this is a known category ID
    if (knownCategoryNames[category.id]) {
      return `/products/${knownCategoryNames[category.id]}`;
    }
    
    // For other categories, create URL-friendly slug
    const urlFriendlyName = category.name
      .toLowerCase()
      .replace(/&/g, '-and-')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    return `/products/${urlFriendlyName}`;
  };

  return (
    <div className="mb-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <Link to="/products/all" className="transition-colors hover:text-foreground">
              All Products
            </Link>
          </BreadcrumbItem>

          {categoryPath.map((category, index) => (
            <React.Fragment key={category.id}>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <Link 
                  to={getCategoryUrl(category)}
                  className={`transition-colors hover:text-foreground ${category.id === currentCategory?.id ? "font-bold" : ""}`}
                >
                  {category.name}
                </Link>
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default ProductBreadcrumbs;
