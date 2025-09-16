
import React from 'react';
import { CartItem as CartItemType } from '@/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItemProps {
  item: CartItemType;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

const CartItem = ({ item, onRemove, onUpdateQuantity }: CartItemProps) => {
  // Function to handle quantity changes, removing item if quantity becomes zero
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemove(item.product.id);
    } else {
      onUpdateQuantity(item.product.id, newQuantity);
    }
  };

  return (
    <div className="flex gap-6 pb-6 mb-6 border-b last:border-b-0 last:pb-0 last:mb-0">
      <div className="w-24 h-24">
        <img 
          src={item.product.image} 
          alt={item.product.name} 
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between mb-2">
          <h3 className="font-semibold">{item.product.name}</h3>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove Item</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove {item.product.name} from your cart?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => onRemove(item.product.id)}
                >
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          {item.product.description.substring(0, 60)}
          {item.product.description.length > 60 ? '...' : ''}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => handleQuantityChange(item.quantity - 1)}
            >
              -
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button 
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => handleQuantityChange(item.quantity + 1)}
            >
              +
            </Button>
          </div>
          <span className="font-bold">£{(item.product.price * item.quantity).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
