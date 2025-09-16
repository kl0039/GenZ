
import { Product } from "@/types";

/**
 * Convert Google Drive sharing links to direct download links
 */
export const convertGoogleDriveUrl = (url: string): string => {
  if (!url) return url;
  
  // Check if it's a Google Drive share link
  const driveShareMatch = url.match(/https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/);
  if (driveShareMatch) {
    const fileId = driveShareMatch[1];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  
  // Also handle drive.google.com/uc links that might need cleaning
  const driveUcMatch = url.match(/https:\/\/drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/);
  if (driveUcMatch) {
    const fileId = driveUcMatch[1];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  
  return url; // Return original URL if not a Google Drive link
};

/**
 * Collect all product images from the separate image URL fields
 */
export const collectProductImages = (product: any): string[] => {
  if (!product) return [];
  
  const images: string[] = [];
  
  // First try image_url (primary field in database), then fall back to image field
  if (product.image_url && typeof product.image_url === 'string') {
    images.push(convertGoogleDriveUrl(product.image_url));
  } else if (product.image && typeof product.image === 'string') {
    images.push(convertGoogleDriveUrl(product.image));
  }
  
  // Add additional image URLs if they exist
  ['image_url_1', 'image_url_2', 'image_url_3', 'image_url_4'].forEach(field => {
    if (product[field] && typeof product[field] === 'string') {
      images.push(convertGoogleDriveUrl(product[field]));
    }
  });
  
  // Filter out any duplicates and empty values using Set to ensure uniqueness
  const uniqueImages = [...new Set(images)].filter(Boolean);
  console.log("Collected product images:", uniqueImages);
  return uniqueImages;
};

/**
 * Get the primary image for a product (used in cards and grids)
 */
export const getPrimaryProductImage = (product: any): string => {
  if (!product) return getImageFallback();
  
  // Try image_url first (database field), then image field
  if (product.image_url && typeof product.image_url === 'string') {
    return convertGoogleDriveUrl(product.image_url);
  }
  
  if (product.image && typeof product.image === 'string') {
    return convertGoogleDriveUrl(product.image);
  }
  
  // Try additional image fields
  const additionalFields = ['image_url_1', 'image_url_2', 'image_url_3', 'image_url_4'];
  for (const field of additionalFields) {
    if (product[field] && typeof product[field] === 'string') {
      return convertGoogleDriveUrl(product[field]);
    }
  }
  
  return getImageFallback();
};

/**
 * Get fallback image URL
 */
export const getImageFallback = (): string => {
  return "https://storage.googleapis.com/uxpilot-auth.appspot.com/1becc23d-4498-4829-b732-1b288aacd64f.png";
};
