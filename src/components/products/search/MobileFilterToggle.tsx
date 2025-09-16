
import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileFilterToggleProps {
  showFilters: boolean;
  onClick: () => void;
}

export const MobileFilterToggle: React.FC<MobileFilterToggleProps> = ({
  showFilters,
  onClick
}) => {
  return (
    <Button 
      variant="outline" 
      className="flex items-center gap-2 md:hidden bg-asianred-600 text-white hover:bg-asianred-700"
      onClick={onClick}
    >
      <Filter size={18} /> 
      Filters 
      <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
    </Button>
  );
};
