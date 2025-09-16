
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Category } from '@/types';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface ProductCategoriesSelectorProps {
  primaryCategory: string;
  setPrimaryCategory: (value: string) => void;
  selectedCategories: Category[];
  setSelectedCategories: (categories: Category[]) => void;
  categories: Category[];
}

const ProductCategoriesSelector: React.FC<ProductCategoriesSelectorProps> = ({
  primaryCategory,
  setPrimaryCategory,
  selectedCategories,
  setSelectedCategories,
  categories
}) => {
  const [commandOpen, setCommandOpen] = useState(false);

  const handleCategoryRemove = (categoryToRemove: Category) => {
    setSelectedCategories(selectedCategories.filter(category => category.id !== categoryToRemove.id));
  };

  const handleCategorySelect = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    
    if (category && !selectedCategories.some(c => c.id === category.id)) {
      setSelectedCategories([...selectedCategories, category]);
      setCommandOpen(false);
    }
  };

  return (
    <>
      <div>
        <Label htmlFor="primary-category">Primary Category</Label>
        <Select onValueChange={setPrimaryCategory} value={primaryCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select primary category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500 mt-1">
          Required for backwards compatibility
        </p>
      </div>
      
      <div>
        <Label htmlFor="categories">Categories</Label>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedCategories.map((category) => (
              <Badge key={category.id} variant="secondary" className="px-3 py-1">
                {category.name}
                <button 
                  type="button" 
                  onClick={() => handleCategoryRemove(category)}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              </Badge>
            ))}
          </div>
          
          <Popover open={commandOpen} onOpenChange={setCommandOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={commandOpen}
                className="w-full justify-between"
                type="button"
              >
                Add categories
                <ChevronsUpDown size={16} className="ml-2 opacity-50 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search categories..." />
                <CommandEmpty>No category found.</CommandEmpty>
                <CommandGroup>
                  {categories
                    .filter(cat => !selectedCategories.some(sc => sc.id === cat.id))
                    .map((category) => (
                      <CommandItem
                        key={category.id}
                        value={category.name}
                        onSelect={() => handleCategorySelect(category.id)}
                      >
                        <Check
                          size={16}
                          className={cn(
                            "mr-2",
                            selectedCategories.some(c => c.id === category.id) 
                              ? "opacity-100" 
                              : "opacity-0"
                          )}
                        />
                        {category.name}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  );
};

export default ProductCategoriesSelector;
