
/**
 * Type guard to check if an image is valid (either a string or an object with a url property)
 */
function isValidImage(img: unknown): img is string | { url?: string | null } {
  return img !== null && img !== undefined;
}

/**
 * Process and filter product images, ensuring only valid image URLs are used
 */
export const processProductImages = (images: unknown[]): string[] => {
  if (!images || !Array.isArray(images)) {
    console.log("No images provided or invalid images array");
    return [];
  }
  
  // Filter out empty strings, null, undefined values, ensure unique images and convert to string
  const processed = images
    .filter(isValidImage) // narrows the type using our type guard
    .map(img => {
      // If it's a string URL, use it directly
      if (typeof img === 'string') {
        return img;
      }

      // If it's an object with a url property, extract the URL
      if (typeof img === 'object' && img !== null && 'url' in img) {
        const imgObj = img as { url?: string | null };
        return typeof imgObj.url === 'string' && imgObj.url ? imgObj.url : '';
      }

      return '';
    })
    .filter(url => url !== ''); // Remove any empty strings that might result from the mapping
  
  // Remove exact duplicates and return
  const uniqueProcessed = [...new Set(processed)];
  console.log("Processed images:", uniqueProcessed);
  return uniqueProcessed;
};

/**
 * Collect all product images from the separate image URL fields
 */
export const collectProductImages = (product: any): string[] => {
  if (!product) return [];
  
  const images: string[] = [];
  
  // Add main image as the first image if it exists
  if (product.image && typeof product.image === 'string') {
    images.push(product.image);
  } else if (product.image_url && typeof product.image_url === 'string') {
    images.push(product.image_url);
  }
  
  // Add additional image URLs if they exist
  ['image_url_1', 'image_url_2', 'image_url_3', 'image_url_4'].forEach(field => {
    if (product[field] && typeof product[field] === 'string') {
      images.push(product[field]);
    }
  });
  
  // Filter out any duplicates and empty values using Set to ensure uniqueness
  const uniqueImages = [...new Set(images)].filter(Boolean);
  console.log("Collected product images:", uniqueImages);
  return uniqueImages;
};
