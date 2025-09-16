
import React from 'react';

const cuisineTypes = [
  "Korean", "Thai", "Vietnamese", "Japanese", "Chinese", "Indian",
  "Alcohol Drinks", "Cracker & Chips"
];

interface CuisineFilterProps {
  selectedCuisines: string[];
  onCuisineChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CuisineFilter: React.FC<CuisineFilterProps> = ({
  selectedCuisines,
  onCuisineChange
}) => {
  return (
    <div className="space-y-2 max-h-40 overflow-y-auto">
      {cuisineTypes.map((cuisine, index) => (
        <label key={index} className="flex items-center cursor-pointer">
          <input 
            type="checkbox"
            value={cuisine}
            onChange={(e) => {
              console.log(`Cuisine checkbox changed: ${cuisine} - checked: ${e.target.checked}`);
              onCuisineChange(e);
            }}
            checked={selectedCuisines.includes(cuisine)}
            className="text-asianred-600 rounded" 
          />
          <span className="ml-2">{cuisine}</span>
        </label>
      ))}
    </div>
  );
};
