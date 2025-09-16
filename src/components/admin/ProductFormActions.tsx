
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProductFormActionsProps {
  isEditing: boolean;
  isLoading: boolean;
  onCancel: () => void;
}

const ProductFormActions: React.FC<ProductFormActionsProps> = ({ 
  isEditing, 
  isLoading, 
  onCancel 
}) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            {isEditing ? 'Updating...' : 'Adding...'}
          </>
        ) : (
          isEditing ? 'Update Product' : 'Add Product'
        )}
      </Button>
    </div>
  );
};

export default ProductFormActions;
