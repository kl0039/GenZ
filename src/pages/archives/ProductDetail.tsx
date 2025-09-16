import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '@/services/products/index';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";
import ProductBreadcrumbs from '@/components/products/ProductBreadcrumbs';
import { getCategoryById, getCategoryPath } from '@/services/categories';
import { Category } from '@/types';
import ProductImageNavigator from '@/components/products/ProductImageNavigator';
import { collectProductImages } from '@/utils/images';
import { getProductVideos } from '@/services/videos';
import { getCustomDomainUrl } from '@/utils/urlUtils';

import ProductHeader from '@/components/products/ProductHeader';
import ProductPrice from '@/components/products/ProductPrice';
import QuantitySelector from '@/components/products/QuantitySelector';
import ProductActions from '@/components/products/ProductActions';
import ProductTabs from '@/components/products/ProductTabs';
import VideoSection from '@/components/products/VideoSection';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { user, toggleFavorite } = useAuth();
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [categoryPath, setCategoryPath] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const { data: product, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id || ''),
    enabled: !!id
  });

  const { data: relatedVideos = [] } = useQuery({
    queryKey: ['product-videos', id],
    queryFn: () => getProductVideos(id || ''),
    enabled: !!id
  });

  useEffect(() => {
    const fetchCategoryInfo = async () => {
      if (product?.categories && product.categories.length > 0) {
        const categoryId = product.categories[0].id;
        const category = await getCategoryById(categoryId);
        const path = await getCategoryPath(categoryId);
        setCurrentCategory(category);
        setCategoryPath(path);
      }
    };
    if (product) fetchCategoryInfo();
  }, [product]);

  if (productLoading) return <div className="container mx-auto p-6 flex justify-center items-center min-h-[50vh]">Loading...</div>;
  if (productError || !product) return <div className="container mx-auto p-6">Product not found</div>;

  const isFavorite = user?.user_metadata?.favorites?.includes(product.id) || false;
  const allProductImages = collectProductImages(product);
  const currentUrl = getCustomDomainUrl(window.location.href);

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product.stock_quantity || 100)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToWishlist = () => {
    toggleFavorite(product.id);
    toast.success(isFavorite 
      ? `${product.name} removed from wishlist` 
      : `${product.name} added to wishlist`
    );
  };

  const handleShareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: currentUrl,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(currentUrl);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <div className="pt-20">
      <div className="container mx-auto p-4 md:p-6">
        <ProductBreadcrumbs currentCategory={currentCategory} categoryPath={categoryPath} />
        <div className="grid md:grid-cols-2 gap-8">
          <ProductImageNavigator
            images={allProductImages}
            productName={product.name}
            isNew={product.new}
            discount={product.discount}
          />
          <div className="space-y-6">
            <ProductHeader product={product} isFavorite={isFavorite} categoryPath={categoryPath} currentCategory={currentCategory} />
            <ProductPrice product={product} />
            <QuantitySelector quantity={quantity} onChange={handleQuantityChange} max={product.stock_quantity || 100} />
            <ProductActions
              handleAddToCart={handleAddToCart}
              handleAddToWishlist={handleAddToWishlist}
              handleShareProduct={handleShareProduct}
              stock_quantity={product.stock_quantity}
              productName={product.name}
              productUrl={currentUrl}
              productImage={product.image}
            />
          </div>
        </div>
        <ProductTabs product={product} />
        <VideoSection 
          relatedVideos={relatedVideos} 
          selectedVideo={selectedVideo}
          setSelectedVideo={setSelectedVideo}
          productImage={product.image}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
