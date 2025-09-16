
import React from 'react';
import { SearchInput } from './search/SearchInput';
import { SortSelector } from './search/SortSelector';
import { MobileFilterToggle } from './search/MobileFilterToggle';
import { useProductSearch } from '@/hooks/useProductSearch';

interface ProductSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: {
    sortBy: string;
    cuisines?: string[];
  };
  onFilterChange: (key: string, value: any) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  categoryTitle: string;
}

const ProductSearchBar: React.FC<ProductSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  showFilters,
  onToggleFilters,
  categoryTitle,
}) => {
  const { 
    localSearch, 
    setLocalSearch, 
    handleSearch, 
    handleClearSearch 
  } = useProductSearch(searchTerm, onSearchChange);

  // Remove the effect that updates onSearchChange(localSearch) on every keystroke.
  // Search should only run on submit (Enter) or clear.

  // Only update the localSearch input if the global searchTerm changes externally
  React.useEffect(() => {
    setLocalSearch(searchTerm);
    // eslint-disable-next-line
  }, [searchTerm]);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <SearchInput
        searchTerm={localSearch}
        categoryTitle={categoryTitle}
        onSearchChange={setLocalSearch}
        onSubmit={handleSearch}
        onClear={handleClearSearch}
      />
      <div className="flex items-center space-x-4">
        <SortSelector
          value={filters.sortBy}
          onChange={(value) => {
            // This triggers parent to update filters (should cause a new object each time)
            onFilterChange('sortBy', value);
          }}
        />
        <MobileFilterToggle
          showFilters={showFilters}
          onClick={onToggleFilters}
        />
      </div>
    </div>
  );
};

export default ProductSearchBar;

