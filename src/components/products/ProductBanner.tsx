
import React from 'react';
import { Category } from '@/types';

interface BannerConfig {
  title: string;
  description: string;
  image: string;
}

interface ProductBannerProps {
  category: Category | null;
  bannerData: BannerConfig;
}

const ProductBanner: React.FC<ProductBannerProps> = ({ category, bannerData }) => {
  const title = category ? `Shop ${category.name}` : bannerData.title;
  const description = category?.description || bannerData.description;

  return (
    <section className="pt-20 h-[400px] relative">
      <div className="absolute inset-0">
        <img className="w-full h-full object-cover" src={bannerData.image} alt={title} />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      <div className="container mx-auto px-4 relative h-full flex items-center">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
          <p className="text-xl text-white/90">{description}</p>
        </div>
      </div>
    </section>
  );
};

export default ProductBanner;
