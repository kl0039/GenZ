
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types";

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('level')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return buildCategoryTree(data || []);
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching category:', error);
    return null;
  }

  return data || null;
};

export const getSubcategoriesByParentId = async (parentId: string | null): Promise<Category[]> => {
  const query = supabase
    .from('categories')
    .select('*')
    .order('name');

  if (parentId) {
    query.eq('parent_id', parentId);
  } else {
    query.is('parent_id', null);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }

  return data || [];
};

export const getCategoryHierarchy = async (categoryId: string): Promise<Category[]> => {
  const { data: category, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', categoryId)
    .single();

  if (error || !category) {
    console.error('Error fetching category hierarchy:', error);
    return [];
  }

  const hierarchy: Category[] = [];
  
  if (category.path && category.path.length > 0) {
    const { data, error: pathError } = await supabase
      .from('categories')
      .select('*')
      .in('id', category.path)
      .order('level');

    if (!pathError && data) {
      hierarchy.push(...data);
    }
  }

  return hierarchy;
};

// Helper function to build the category tree
export const buildCategoryTree = (categories: Category[]): Category[] => {
  const categoryMap = new Map<string, Category>();
  const rootCategories: Category[] = [];

  // First, create a map of all categories
  categories.forEach(category => {
    categoryMap.set(category.id, {
      ...category,
      children: []
    });
  });

  // Then, build the tree structure
  categories.forEach(category => {
    const currentCategory = categoryMap.get(category.id);
    
    if (category.parent_id) {
      const parentCategory = categoryMap.get(category.parent_id);
      if (parentCategory) {
        if (!parentCategory.children) {
          parentCategory.children = [];
        }
        parentCategory.children.push(currentCategory!);
      }
    } else {
      rootCategories.push(currentCategory!);
    }
  });

  return rootCategories;
};

// Get path from root to the current category as an array of categories
export const getCategoryPath = async (categoryId: string): Promise<Category[]> => {
  const { data: category, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', categoryId)
    .single();

  if (error || !category || !category.path) {
    return [];
  }

  const { data: pathCategories, error: pathError } = await supabase
    .from('categories')
    .select('*')
    .in('id', category.path)
    .order('level');

  if (pathError || !pathCategories) {
    return [];
  }

  return pathCategories;
};
