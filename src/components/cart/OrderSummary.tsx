import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';

interface OrderSummaryProps {
  subtotal: number;
  deliveryCost: number;
  isEligibleForFreeDelivery: boolean;
  tax: number;
  totalPrice: number;
  promoCode: string;
  isPromoApplied: boolean;
  onPromoCodeChange: (code: string) => void;
  onPromoCodeApply: () => void;
  onClearCart: () => void;
}

const OrderSummary = ({
  subtotal,
  deliveryCost,
  isEligibleForFreeDelivery,
  tax,
  totalPrice,
  promoCode,
  isPromoApplied,
  onPromoCodeChange,
  onPromoCodeApply,
  onClearCart,
}: OrderSummaryProps) => {
  return (
    <div id="order-summary" className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
      <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">£{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Delivery</span>
          <div className="text-right">
            {isEligibleForFreeDelivery || isPromoApplied ? (
              <>
                <span className="font-semibold line-through text-gray-400">£{deliveryCost.toFixed(2)}</span>
                <span className="font-semibold text-green-600 ml-2">FREE</span>
              </>
            ) : (
              <span className="font-semibold">£{deliveryCost.toFixed(2)}</span>
            )}
          </div>
        </div>
        {isEligibleForFreeDelivery && !isPromoApplied && (
          <div className="text-xs text-green-600 flex items-center">
            <Tag className="h-3 w-3 mr-1" />
            Free delivery item in cart
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span className="font-semibold">£{tax.toFixed(2)}</span>
        </div>
        <div className="pt-4 border-t">
          <div className="flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-bold text-xl">£{totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div id="promo-code" className="mb-6">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Enter promo code" 
            className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-asianred-600"
            value={promoCode}
            onChange={(e) => onPromoCodeChange(e.target.value)}
          />
          <button 
            className="px-6 py-3 bg-gray-100 rounded-lg hover:bg-gray-200"
            onClick={onPromoCodeApply}
          >
            Apply
          </button>
        </div>
        {isPromoApplied && (
          <div className="mt-2 text-green-600 text-sm">
            Promo code applied: Free delivery
          </div>
        )}
      </div>

      <div className="text-sm text-gray-600">
        <p className="flex items-center gap-2 mb-2">
          <i className="fa-solid fa-shield text-green-600"></i>
          Secure checkout powered by Stripe
        </p>
        <p className="flex items-center gap-2">
          <i className="fa-solid fa-truck text-blue-600"></i>
          Free delivery on orders over £50 or eligible products
        </p>
      </div>

      <div className="mt-6 flex justify-between">
        <button 
          onClick={onClearCart} 
          className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Clear Cart
        </button>
        <Link to="/">
          <button className="px-6 py-3 bg-gray-100 rounded-lg hover:bg-gray-200">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSummary;
