
import React from "react";
import { Button } from "@/components/ui/button";
import { Share, Facebook, X } from "lucide-react";
import { MessageCircle } from "lucide-react";

interface ProductActionsProps {
  handleAddToCart: () => void;
  handleAddToWishlist: () => void;
  handleShareProduct: () => void;
  stock_quantity: number;
  productName: string;
  productUrl: string;
  productImage?: string;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  handleAddToCart,
  handleAddToWishlist,
  handleShareProduct,
  stock_quantity,
  productName,
  productUrl,
  productImage,
}) => {
  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const handleXShare = () => {
    const text = `Check out this product: ${productName}`;
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(productUrl)}`;
    window.open(xUrl, '_blank', 'width=600,height=400');
  };

  const handleWhatsAppShare = () => {
    const text = `Check out this product: ${productName} ${productUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleAddToCart} 
          className="flex-1 bg-green-700 hover:bg-green-800 text-white"
          disabled={stock_quantity === 0}
        >
          Add to Cart
        </Button>
        <Button 
          onClick={handleAddToWishlist}
          variant="outline" 
          className="flex-1"
        >
          Add To Wishlist
        </Button>
      </div>
      
      {/* Social Sharing */}
      <div>
        <div className="text-sm text-gray-500 mb-3">Share it</div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full w-12 h-12 border-gray-300 hover:bg-blue-50 hover:border-blue-400" 
            onClick={handleFacebookShare}
            title="Share on Facebook"
          >
            <Facebook className="h-5 w-5 text-blue-600" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full w-12 h-12 border-gray-300 hover:bg-gray-50 hover:border-gray-400" 
            onClick={handleXShare}
            title="Share on X"
          >
            <X className="h-5 w-5 text-gray-700" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full w-12 h-12 border-gray-300 hover:bg-green-50 hover:border-green-400" 
            onClick={handleWhatsAppShare}
            title="Share on WhatsApp"
          >
            <MessageCircle className="h-5 w-5 text-green-600" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full w-12 h-12 border-gray-300 hover:bg-gray-50 hover:border-gray-400" 
            onClick={handleShareProduct}
            title="More sharing options"
          >
            <Share className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductActions;
