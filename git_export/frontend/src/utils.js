export const getProxiedImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/300x400?text=No+Photo';
  
  // Only proxy external-content.duckduckgo.com or other known blocked domains
  if (url.includes('duckduckgo.com') || url.includes('bing.net')) {
    return `/api/image?url=${encodeURIComponent(url)}`;
  }
  
  return url;
};
