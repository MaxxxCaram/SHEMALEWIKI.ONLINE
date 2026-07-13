// Photo URL filter: only keep images that actually load in the browser.
//
// The DB stores profile photos from several sources:
//   - qtuzpswxzengqoqqwtpt.supabase.co/storage  -> Supabase Storage (loads ✅)
//   - static2.eros.bz                            -> external CDN (loads ✅)
//   - web.archive.org/web/.../cdn.shemalewiki.com/...  -> Wayback snapshot of
//     shemalewiki.com originals. The browser blocks these (no hotlinking /
//     mixed-content / archive.org referer policy), so they render as broken.
//   - *.shemalewiki.com                          -> original source, also blocked.
//
// Per the same fix applied to shemalewiki (Home.jsx): only show photos that
// load. We exclude the two hosts the browser refuses to render.
const BROKEN_HOSTS = ['web.archive.org', 'shemalewiki.com', 'cdn.shemalewiki.com'];

export const isLoadablePhoto = (url) => {
  const u = (url || '').toLowerCase();
  return !BROKEN_HOSTS.some((h) => u.includes(h));
};
