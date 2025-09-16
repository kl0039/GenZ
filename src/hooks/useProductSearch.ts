
import { useState, useEffect } from 'react';

export const useProductSearch = (initialSearchTerm: string, onSearchChange: (value: string) => void) => {
  const [localSearch, setLocalSearch] = useState(initialSearchTerm);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setLocalSearch(initialSearchTerm);
  }, [initialSearchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    console.log('Submitting search for:', localSearch);
    onSearchChange(localSearch);
    // Reset searching state after a short delay
    setTimeout(() => setIsSearching(false), 500);
  };

  // Handle immediate search on clear
  const handleClearSearch = () => {
    setLocalSearch('');
    console.log('Clearing search term');
    onSearchChange('');
  };

  return {
    localSearch,
    setLocalSearch,
    handleSearch,
    handleClearSearch,
    isSearching
  };
};
