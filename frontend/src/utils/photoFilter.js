// Photo URL filter: keep ALL external images.
//
// The DB stores profile photos from several sources:
//   - qtuzpswxzengqoqqwtpt.supabase.co/storage  -> Supabase Storage (loads ✅)
//   - static2.eros.bz                            -> external CDN (loads ✅)
//   - web.archive.org/web/.../cdn.shemalewiki.com/...  -> Wayback snapshot
//   - distintas.net / www.kinky.nl                  -> older CDNs
//
// The browser blocks hotlinked external images (CORB / referrer policy / 403).
// To bypass this we route EVERY external url through our edge proxy
// `/api/image` (see getProxiedImageUrl in utils.js), which fetches the
// image server-side and serves it from our own domain. So we no longer
// need to reject any host here — the proxy handles the blocking.
//
// We only drop empty / obviously-invalid values.
export const isLoadablePhoto = (url) => {
  const u = (url || '').trim().toLowerCase();
  if (!u) return false;
  if (!/^https?:\/\//.test(u)) return false; // must be an http(s) url
  return true;
};
