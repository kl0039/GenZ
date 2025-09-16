
import React from 'react';

interface SortSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const SortSelector: React.FC<SortSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <select 
      className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-asianred-600"
      value={value}
      onChange={(e) => {
        console.log('Sort by changed to:', e.target.value);
        onChange(e.target.value);
      }}
    >
      <option value="popularity">Sort by Popularity</option>
      <option value="priceLow">Price: Low to High</option>
      <option value="priceHigh">Price: High to Low</option>
      <option value="newest">Most Recent</option>
    </select>
  );
};
