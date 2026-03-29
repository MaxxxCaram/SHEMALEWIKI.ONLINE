# Static site deploy (recovery)

## Contents
- `index.html` — profile directory with search filter
- `profile_<id>.html` — one page per profile
- `reviews.html` — review index (if `json/reviews.json` populated)
- `assets/style.css` — styles
- `search-index.json` — optional for future SPA tooling

## Quick serve (local)
```bash
cd site
python -m http.server 8080
```
Open http://localhost:8080

## Production
- Upload **entire** `site/` directory preserving paths.
- Ensure `assets/style.css` resolves (case-sensitive on Linux).
- Optional: add HTTPS via host (Cloudflare, etc.).

## Regenerate after new JSON
```bash
python build_recovery_site.py
```
