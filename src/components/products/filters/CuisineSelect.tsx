
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Update the cuisine types to match the data in the database
const cuisineTypes = [
  "Korean", "Thai", "Vietnamese", "Japanese", "Chinese", "Indian",
  "Alcohol Drinks", "Cracker & Chips"
];

interface CuisineSelectProps {
  selectedCuisine: string;
  onCuisineChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CuisineSelect: React.FC<CuisineSelectProps> = ({
  selectedCuisine,
  onCuisineChange
}) => {
  return (
    <Select
      value={selectedCuisine}
      onValueChange={(value) => {
        console.log(`Selected cuisine: ${value}`);
        const e = {
          target: { value, checked: true, type: 'checkbox' }
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        onCuisineChange(e);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Cuisine" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Cuisines</SelectItem>
        {cuisineTypes.map((cuisine) => (
          <SelectItem key={cuisine} value={cuisine}>
            {cuisine}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
