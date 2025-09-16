
import React from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (newQuantity: number) => void;
  max: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, onChange, max }) => (
  <div>
    <div className="text-sm text-gray-500 mb-2">Number</div>
    <div className="flex items-center">
      <Button
        variant="outline" 
        size="icon"
        onClick={() => onChange(quantity - 1)}
        disabled={quantity <= 1}
        className="rounded-r-none"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <input
        type="text"
        value={quantity}
        onChange={(e) => {
          const value = parseInt(e.target.value);
          if (!isNaN(value)) {
            onChange(value);
          }
        }}
        className="h-10 w-16 text-center border-y border-input"
      />
      <Button
        variant="outline"
        size="icon"
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= max}
        className="rounded-l-none"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

export default QuantitySelector;
