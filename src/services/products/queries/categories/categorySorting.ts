
import { Product } from "@/types";

export const sortProducts = (products: Product[], sortBy?: string): Product[] => {
  if (!sortBy) return products;

  const sortedProducts = [...products];

  switch (sortBy) {
    case 'price-low':
    case 'priceLow':
      sortedProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
    case 'priceHigh':
      sortedProducts.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      sortedProducts.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
      break;
    case 'popularity':
    default:
      sortedProducts.sort((a, b) => ((b.rating || 0) - (a.rating || 0)));
      break;
  }

  return sortedProducts;
};
