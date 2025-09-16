
/**
 * Converts a Lovable preview URL to the custom domain URL
 * @param currentUrl - The current URL (usually from window.location.href)
 * @returns The URL with the custom domain
 */
export const getCustomDomainUrl = (currentUrl: string): string => {
  // Replace the Lovable preview domain with the custom domain
  return currentUrl.replace('preview--asianfood-ai.lovable.app', 'asianfood.ai');
};
