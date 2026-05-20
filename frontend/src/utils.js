export const getProxiedImageUrl = (url) => {
  if (!url) return '/api/image?url=';
  
  // If it is already a relative path, local resource, or base64 data URI, return it directly
  if (url.startsWith('/') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  
  // Route all external images through our secure, high-performance edge cached proxy
  return `/api/image?url=${encodeURIComponent(url)}`;
};
