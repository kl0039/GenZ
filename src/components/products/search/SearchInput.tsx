
import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  searchTerm: string;
  categoryTitle: string;
  onSearchChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  searchTerm,
  categoryTitle,
  onSearchChange,
  onSubmit,
  onClear
}) => {
  return (
    <form onSubmit={onSubmit} className="relative flex-1">
      <div className="flex items-center border rounded-lg overflow-hidden bg-white">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={`Search in ${categoryTitle}...`}
          className="px-4 py-2 flex-1 focus:outline-none"
        />
        {searchTerm && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="p-2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
        <button
          type="submit"
          className="bg-asianred-600 text-white p-2 flex items-center justify-center"
          aria-label="Search"
        >
          <Search size={18} />
        </button>
      </div>
    </form>
  );
};
