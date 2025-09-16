
import React from 'react';
import { Slider } from "@/components/ui/slider";

interface PriceRangeSliderProps {
  value: [number, number];
  onChange: (values: [number, number]) => void;
}

export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="flex items-center gap-2 min-w-[200px]">
      <span className="text-sm text-gray-500">Price:</span>
      <div className="flex-1">
        <Slider
          defaultValue={value}
          max={100}
          step={1}
          value={value}
          onValueChange={(values) => onChange(values as [number, number])}
          className="w-full accent-asianred-600"
        />
      </div>
      <span className="text-sm text-gray-500">
        £{value[0]}-£{value[1]}
      </span>
    </div>
  );
};
