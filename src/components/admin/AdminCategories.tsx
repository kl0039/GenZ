
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Edit, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { getCategories, getSubcategoriesByParentId, buildCategoryTree } from '@/services/categories';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [flatCategories, setFlatCategories] = useState<Category[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({});
  const [newCategory, setNewCategory] = useState<Partial<Category>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Get all categories
      const { data: allCategories, error } = await supabase
        .from('categories')
        .select('*')
        .order('level')
        .order('name');
      
      if (error) throw error;
      
      setFlatCategories(allCategories || []);
      
      // Build the category tree for hierarchical display
      const treeCategories = buildCategoryTree(allCategories || []);
      setCategories(treeCategories);
      
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive"
      });
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: newCategory.name,
          description: newCategory.description || null,
          icon: newCategory.icon || null,
          image_url: newCategory.image_url || null,
          parent_id: newCategory.parent_id || null
        })
        .select();

      if (error) throw error;

      if (data) {
        toast({
          title: "Success",
          description: "Category added successfully",
        });
        
        setNewCategory({});
        setIsAddDialogOpen(false);
        fetchCategories(); // Refresh categories to include the new one with proper path/level
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive"
      });
    }
  };

  const handleEditCategory = async () => {
    if (!currentCategory.name || !currentCategory.id) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .update({
          name: currentCategory.name,
          description: currentCategory.description || null,
          icon: currentCategory.icon || null,
          image_url: currentCategory.image_url || null,
          parent_id: currentCategory.parent_id || null
        })
        .eq('id', currentCategory.id)
        .select();

      if (error) throw error;

      if (data) {
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
        
        setIsEditDialogOpen(false);
        fetchCategories(); // Refresh to update the category tree
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      // First check if there are subcategories
      const { data: subcategories, error: subcategoriesError } = await supabase
        .from('categories')
        .select('id')
        .eq('parent_id', id);
      
      if (subcategoriesError) throw subcategoriesError;
      
      if (subcategories && subcategories.length > 0) {
        toast({
          title: "Error",
          description: "Cannot delete a category with subcategories. Please delete or move the subcategories first.",
          variant: "destructive"
        });
        return;
      }
      
      // Check if there are products using this category
      const { data: products, error: productsError } = await supabase
        .from('product_categories')
        .select('id')
        .eq('category_id', id);
        
      if (productsError) throw productsError;
      
      if (products && products.length > 0) {
        toast({
          title: "Warning",
          description: `There are ${products.length} products associated with this category. Are you sure you want to delete it?`,
          variant: "destructive"
        });
        // Consider adding a confirmation dialog here
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive"
      });
    }
  };

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const renderCategoryRow = (category: Category, level = 0) => {
    const isExpanded = expandedCategories[category.id];
    const hasChildren = category.children && category.children.length > 0;
    
    return (
      <React.Fragment key={category.id}>
        <TableRow>
          <TableCell className="font-medium">
            <div className="flex items-center" style={{ marginLeft: `${level * 20}px` }}>
              {hasChildren && (
                <button
                  onClick={() => toggleExpand(category.id)}
                  className="mr-2 focus:outline-none"
                >
                  {isExpanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
              )}
              {!hasChildren && <div className="w-6" />}
              {category.name}
            </div>
          </TableCell>
          <TableCell>{category.description}</TableCell>
          <TableCell>{category.icon}</TableCell>
          <TableCell>{category.level}</TableCell>
          <TableCell className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setCurrentCategory(category);
                setIsEditDialogOpen(true);
              }}
            >
              <Edit size={16} />
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => handleDeleteCategory(category.id)}
            >
              <Trash2 size={16} />
            </Button>
          </TableCell>
        </TableRow>
        
        {/* Render children if expanded */}
        {isExpanded && hasChildren && category.children!.map(child => 
          renderCategoryRow(child, level + 1)
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Category Management</h2>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="parent">Parent Category</Label>
                <Select 
                  value={newCategory.parent_id || ''} 
                  onValueChange={(value) => 
                    setNewCategory({ ...newCategory, parent_id: value || null })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None (Top Level)</SelectItem>
                    {flatCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.level > 0 ? '└─ '.repeat(cat.level) : ''} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input 
                  id="name" 
                  value={newCategory.name || ''}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  value={newCategory.description || ''}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Input 
                  id="icon" 
                  value={newCategory.icon || ''}
                  onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input 
                  id="image_url" 
                  value={newCategory.image_url || ''}
                  onChange={(e) => setNewCategory({ ...newCategory, image_url: e.target.value })}
                />
              </div>
              <Button onClick={handleAddCategory} className="w-full mt-4">
                Save Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Level</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map(category => renderCategoryRow(category))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-parent">Parent Category</Label>
              <Select 
                value={currentCategory.parent_id || ''} 
                onValueChange={(value) => 
                  setCurrentCategory({ ...currentCategory, parent_id: value || null })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None (Top Level)</SelectItem>
                  {flatCategories
                    .filter(cat => cat.id !== currentCategory.id) // Prevent a category from being its own parent
                    .filter(cat => !cat.path?.includes(currentCategory.id as string)) // Prevent circular references
                    .map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.level > 0 ? '└─ '.repeat(cat.level) : ''} {cat.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Category Name</Label>
              <Input 
                id="edit-name" 
                value={currentCategory.name || ''}
                onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input 
                id="edit-description" 
                value={currentCategory.description || ''}
                onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-icon">Icon</Label>
              <Input 
                id="edit-icon" 
                value={currentCategory.icon || ''}
                onChange={(e) => setCurrentCategory({ ...currentCategory, icon: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image_url">Image URL</Label>
              <Input 
                id="edit-image_url" 
                value={currentCategory.image_url || ''}
                onChange={(e) => setCurrentCategory({ ...currentCategory, image_url: e.target.value })}
              />
            </div>
            <Button onClick={handleEditCategory} className="w-full mt-4">
              Update Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
