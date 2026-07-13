const NO_PHOTO_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400" fill="none"><rect width="300" height="400" fill="%231e293b"/><circle cx="150" cy="160" r="50" fill="%23475569"/><path d="M70,300 C70,240 230,240 230,300" fill="%23475569"/><text x="150" y="360" fill="%2394a3b8" font-family="system-ui, sans-serif" font-size="16" font-weight="600" text-anchor="middle">No Photo</text></svg>`;

export const getProxiedImageUrl = (url) => {
  if (!url) return NO_PHOTO_SVG;
  
  // If it is already a relative path, local resource, or base64 data URI, return it directly
  if (url.startsWith('/') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  
  // Route all external images through our secure, high-performance edge cached proxy
  return `/api/image?url=${encodeURIComponent(url)}`;
};
