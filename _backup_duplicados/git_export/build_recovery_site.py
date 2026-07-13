#!/usr/bin/env python3
"""
Build static site from shemalewiki_recovery JSON for relaunch.
Usage: python build_recovery_site.py [--output-dir shemalewiki_recovery/site]
"""

import argparse
import html
import json
import re
from pathlib import Path

OUTPUT_ROOT = Path("shemalewiki_recovery")
JSON_DIR = OUTPUT_ROOT / "json"


def clean_display_name(raw_name):
    """Short title for cards and <title>."""
    if not raw_name:
        return ""
    s = raw_name.strip()
    for sep in (" - Archive -", " - www.shemalewiki.com", " | www.shemalewiki"):
        if sep in s:
            s = s.split(sep)[0].strip()
    if " | " in s and len(s) > 80:
        parts = s.split(" | ")
        if len(parts) >= 2:
            s = parts[0].strip()
    return s[:120] if len(s) > 120 else s


def pick_thumbnail(images):
    """First sensible profile image (skip flags, external junk)."""
    skip = (
        "flags_iso", "flag_not", "phncdn.com", "pornhub", "logo", "favicon",
        "search_16", "banner", "vr6.png", "yes.png", "no.png",
    )
    for src in images or []:
        if not src:
            continue
        low = src.lower()
        if any(x in low for x in skip):
            continue
        if "images_profile" in low or "/slices/" in low:
            return src
    for src in images or []:
        if src and "web.archive.org" in src and not any(
            x in src.lower() for x in skip
        ):
            return src
    return None


def get_location_line(prof):
    """Best-effort location string."""
    loc = prof.get("location")
    if loc:
        return loc
    desc = prof.get("description") or ""
    m = re.search(
        r"(?:right now in|in)\s+([^\.]+?)(?:\.|See |\s+Call)",
        desc,
        re.IGNORECASE,
    )
    if m:
        return m.group(1).strip()
    facts = prof.get("facts") or {}
    nat = facts.get("Nationality")
    if nat:
        return nat
    return ""


def load_json(path, default):
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def build_site(output_dir=None):
    output_dir = Path(output_dir) if output_dir else OUTPUT_ROOT / "site"
    output_dir.mkdir(parents=True, exist_ok=True)
    assets = output_dir / "assets"
    assets.mkdir(exist_ok=True)

    profiles = load_json(JSON_DIR / "profiles.json", {})
    reviews_all = load_json(JSON_DIR / "reviews.json", [])
    reviews_by_profile = load_json(JSON_DIR / "reviews_by_profile.json", {})
    listings = load_json(JSON_DIR / "listings.json", {})
    summary = load_json(JSON_DIR / "summary.json", {})

    if isinstance(reviews_all, dict):
        reviews_all = []

    # Merge reviews into by-profile if only flat list exists
    if reviews_all and not reviews_by_profile:
        for rev in reviews_all:
            pid = rev.get("profile_id")
            if not pid:
                continue
            reviews_by_profile.setdefault(pid, []).append(rev)

    css = """/* ShemaleWiki recovery — static relaunch */
:root {
  --bg: #0f0f1a;
  --panel: #16162a;
  --accent: #e94560;
  --text: #e8e8f0;
  --muted: #9898a8;
  --border: #2a2a42;
  --success: #43a047;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.5;
  min-height: 100vh;
}
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
.topnav {
  background: var(--panel);
  border-bottom: 1px solid var(--border);
  padding: 0.75rem 1.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.topnav h1 { font-size: 1.25rem; font-weight: 700; }
.topnav h1 a { color: var(--accent); text-decoration: none; }
.topnav nav { display: flex; gap: 1.25rem; font-size: 0.95rem; }
.hero {
  text-align: center;
  padding: 2.5rem 1rem 1.5rem;
  max-width: 720px;
  margin: 0 auto;
}
.hero h2 { font-size: 1.75rem; margin-bottom: 0.5rem; color: var(--text); }
.hero p { color: var(--muted); font-size: 0.95rem; }
.stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-top: 1.25rem;
  font-size: 0.9rem;
}
.stats span { color: var(--muted); }
.stats strong { color: var(--accent); font-size: 1.1rem; }
.search-wrap {
  max-width: 560px;
  margin: 1.5rem auto 0;
  padding: 0 1rem;
}
#q {
  width: 100%;
  padding: 0.65rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--panel);
  color: var(--text);
  font-size: 1rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}
.card {
  background: var(--panel);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
  transition: transform 0.15s, box-shadow 0.15s;
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.35);
}
.card a.block { display: block; color: inherit; text-decoration: none; }
.card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: #0a0a14;
}
.card .no-img {
  height: 200px;
  background: linear-gradient(135deg, #1a1a2e, #0f0f1a);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--border);
  font-size: 2.5rem;
}
.card-body { padding: 1rem 1.1rem 1.25rem; }
.card-body h3 {
  font-size: 1.05rem;
  color: var(--accent);
  margin-bottom: 0.35rem;
  line-height: 1.3;
}
.card-body .loc { font-size: 0.8rem; color: var(--muted); margin-bottom: 0.35rem; }
.card-body p { font-size: 0.82rem; color: var(--muted); line-height: 1.4; }
.profile-page { max-width: 920px; margin: 0 auto; padding: 1.5rem 1.25rem 3rem; }
.profile-page h1 {
  font-size: 1.65rem;
  color: var(--accent);
  margin-bottom: 0.5rem;
}
.profile-page .loc { color: var(--muted); margin-bottom: 1rem; font-size: 0.95rem; }
.facts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.65rem;
  margin: 1.25rem 0;
}
.fact {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.5rem 0.65rem;
  font-size: 0.85rem;
}
.fact .k { color: var(--muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.03em; }
.fact .v { color: var(--text); margin-top: 0.15rem; word-break: break-word; }
.bio {
  margin: 1.25rem 0;
  color: var(--text);
  font-size: 0.95rem;
  white-space: pre-wrap;
}
.services {
  margin: 1rem 0;
}
.services h3 { font-size: 1rem; margin-bottom: 0.5rem; color: var(--text); }
.services ul {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.services li {
  background: var(--panel);
  border: 1px solid var(--border);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
}
.services li.off { opacity: 0.45; }
.contact-box {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1rem 1.25rem;
  margin: 1.25rem 0;
  font-size: 0.9rem;
}
.contact-box a { word-break: break-all; }
.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
}
.gallery img {
  max-width: 280px;
  width: 100%;
  height: auto;
  border-radius: 8px;
  border: 1px solid var(--border);
}
.reviews-section { margin-top: 2rem; }
.reviews-section h2 { font-size: 1.2rem; margin-bottom: 1rem; }
.review-item {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 0.75rem;
}
.review-item .title { font-weight: 600; color: var(--text); margin-bottom: 0.35rem; }
.review-item .meta { font-size: 0.8rem; color: var(--muted); margin-bottom: 0.35rem; }
.stars { color: #ffc107; letter-spacing: 0.05em; }
.footer-note {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
  font-size: 0.75rem;
  color: var(--muted);
}
.table-wrap { overflow-x: auto; margin: 1rem; max-width: 1200px; margin-left: auto; margin-right: auto; }
table.directory {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
}
table.directory th, table.directory td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--border);
  text-align: left;
}
table.directory th { color: var(--muted); font-weight: 600; }
.reviews-page .review-item { max-width: 900px; margin-left: auto; margin-right: auto; }
.hidden { display: none !important; }
"""

    (assets / "style.css").write_text(css, encoding="utf-8")

    # Search index (lightweight)
    search_index = []
    for pid, prof in profiles.items():
        name = clean_display_name(prof.get("name") or "")
        loc = get_location_line(prof)
        thumb = pick_thumbnail(prof.get("images") or [])
        search_index.append({
            "id": str(pid),
            "name": name,
            "loc": loc,
            "thumb": thumb,
            "snippet": (prof.get("description") or "")[:200],
        })

    (output_dir / "search-index.json").write_text(
        json.dumps(search_index, ensure_ascii=False),
        encoding="utf-8",
    )

    n_profiles = len(profiles)
    n_reviews = len(reviews_all) if reviews_all else sum(
        len(v) for v in reviews_by_profile.values()
    )
    n_listings = len(listings)

    # --- index.html with client-side search ---
    cards_parts = []
    for pid, prof in profiles.items():
        name = clean_display_name(prof.get("name") or ("Profile #%s" % pid))
        desc = html.escape((prof.get("description") or "")[:140])
        loc = html.escape(get_location_line(prof))
        thumb = pick_thumbnail(prof.get("images") or [])
        img_html = (
            '<img src="%s" alt="%s" loading="lazy">'
            % (html.escape(thumb, True), html.escape(name, True))
            if thumb
            else '<div class="no-img">·</div>'
        )
        cards_parts.append(
            """
    <article class="card" data-id="%s" data-search="%s">
      <a class="block" href="profile_%s.html">
        %s
        <div class="card-body">
          <h3>%s</h3>
          <div class="loc">%s</div>
          <p>%s</p>
        </div>
      </a>
    </article>"""
            % (
                html.escape(str(pid)),
                html.escape(
                    ("%s %s %s" % (name, loc, desc)).lower().replace('"', ""),
                ),
                html.escape(str(pid)),
                img_html,
                html.escape(name),
                loc or "—",
                desc or "—",
            )
        )

    index_html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Recovered archive of escort profiles — static mirror for preservation.">
  <title>Directory — Recovered</title>
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
  <header class="topnav">
    <h1><a href="index.html">ShemaleWiki Archive</a></h1>
    <nav>
      <a href="index.html">Directory</a>
      <a href="reviews.html">Reviews</a>
      <a href="about.html">About</a>
    </nav>
  </header>
  <section class="hero">
    <h2>Recovered directory</h2>
    <p>Static snapshot from public web archives. Not affiliated with the original site.</p>
    <div class="stats">
      <span><strong>%d</strong><br>profiles</span>
      <span><strong>%d</strong><br>reviews indexed</span>
      <span><strong>%d</strong><br>listing pages</span>
    </div>
  </section>
  <div class="search-wrap">
    <input type="search" id="q" placeholder="Filter by name, city, keyword…" autocomplete="off">
  </div>
  <main class="grid" id="grid">
%s
  </main>
  <script>
  (function(){
    var q = document.getElementById('q');
    var cards = document.querySelectorAll('.card');
    q.addEventListener('input', function(){
      var term = (q.value || '').trim().toLowerCase();
      cards.forEach(function(c){
        var s = c.getAttribute('data-search') || '';
        c.classList.toggle('hidden', term && s.indexOf(term) === -1);
      });
    });
  })();
  </script>
</body>
</html>""" % (n_profiles, n_reviews, n_listings, "".join(cards_parts))

    (output_dir / "index.html").write_text(index_html, encoding="utf-8")

    # --- Profile pages ---
    for pid, prof in profiles.items():
        name = clean_display_name(prof.get("name") or ("Profile #%s" % pid))
        title_esc = html.escape(name)
        desc = prof.get("description") or ""
        bio = prof.get("bio") or ""
        loc_line = get_location_line(prof)
        facts = prof.get("facts") or {}
        services = prof.get("services") or []
        contact = prof.get("contact") or {}

        facts_html = ""
        for k, v in sorted(facts.items()):
            if v is None or str(v).strip() == "":
                continue
            facts_html += (
                '<div class="fact"><div class="k">%s</div>'
                '<div class="v">%s</div></div>'
                % (html.escape(str(k)), html.escape(str(v)))
            )

        serv_html = ""
        if services:
            serv_html = '<div class="services"><h3>Services</h3><ul>'
            for s in services:
                svc = s.get("service", "")
                ok = s.get("available", True)
                cls_attr = ' class="off"' if not ok else ""
                serv_html += "<li%s>%s</li>" % (
                    cls_attr,
                    html.escape(svc),
                )
            serv_html += "</ul></div>"

        contact_html = ""
        if any(contact.values()):
            contact_html = '<div class="contact-box"><strong>Contact</strong><br>'
            if contact.get("phone"):
                contact_html += "Phone: %s<br>" % html.escape(
                    str(contact["phone"])
                )
            if contact.get("email"):
                e = html.escape(str(contact["email"]))
                contact_html += 'Email: <a href="mailto:%s">%s</a><br>' % (e, e)
            if contact.get("whatsapp"):
                contact_html += "WhatsApp: %s<br>" % html.escape(
                    str(contact["whatsapp"])
                )
            contact_html += "</div>"

        gallery = []
        seen = set()
        for img in (prof.get("images") or [])[:24]:
            if not img or img in seen:
                continue
            low = img.lower()
            if any(x in low for x in ("flags_iso", "phncdn.com", "pornhub")):
                continue
            seen.add(img)
            gallery.append(
                '<img src="%s" alt="" loading="lazy">'
                % html.escape(img, True)
            )
        gallery_html = (
            '<div class="gallery">%s</div>' % "".join(gallery)
            if gallery
            else ""
        )

        rev_html = ""
        revs = reviews_by_profile.get(str(pid), reviews_by_profile.get(pid, []))
        if revs:
            rev_html = '<section class="reviews-section"><h2>Client reviews</h2>'
            for r in revs[:50]:
                if r.get("source") == "review_link_only":
                    continue
                tit = html.escape(r.get("title") or "Review")
                author = html.escape(r.get("author") or "Anonymous")
                rating = int(r.get("rating") or 0)
                stars = "★" * rating + "☆" * (5 - rating) if rating else ""
                rev_html += (
                    '<div class="review-item">'
                    '<div class="title">%s</div>'
                    '<div class="meta"><span class="stars">%s</span> — %s</div>'
                    "</div>"
                    % (tit, stars, author)
                )
            rev_html += "</section>"

        page = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="%s">
  <title>%s — Archive</title>
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
  <header class="topnav">
    <h1><a href="index.html">ShemaleWiki Archive</a></h1>
    <nav>
      <a href="index.html">Directory</a>
      <a href="reviews.html">Reviews</a>
      <a href="about.html">About</a>
    </nav>
  </header>
  <article class="profile-page">
    <h1>%s</h1>
    <p class="loc">%s</p>
    <p style="color:var(--muted);font-size:0.9rem;">%s</p>
    <div class="facts">%s</div>
    %s
    %s
    <div class="bio">%s</div>
    %s
    %s
    <p class="footer-note">Profile ID %s · Recovered from public web archives · No affiliation with original operators.</p>
  </article>
</body>
</html>""" % (
            html.escape(desc[:160]),
            title_esc,
            title_esc,
            html.escape(loc_line) if loc_line else "Location unknown",
            html.escape(desc),
            facts_html or '<div class="fact"><div class="v">No facts extracted</div></div>',
            serv_html,
            contact_html,
            html.escape(bio) if bio else "",
            gallery_html,
            rev_html,
            html.escape(str(pid)),
        )

        (output_dir / ("profile_%s.html" % pid)).write_text(page, encoding="utf-8")

    # --- reviews.html ---
    review_rows = []
    if reviews_all:
        iterable = reviews_all
    else:
        iterable = []
        for plist in reviews_by_profile.values():
            iterable.extend(plist)

    for r in iterable:
        if r.get("source") == "review_link_only" and not r.get("title"):
            continue
        rid = r.get("review_id", "")
        tit = html.escape(r.get("title") or "(no title)")
        pid = r.get("profile_id", "")
        pname = html.escape(r.get("profile_name") or "")
        author = html.escape(r.get("author") or "")
        rating = int(r.get("rating") or 0)
        stars = "★" * rating + "☆" * (5 - rating) if rating else ""
        link = (
            '<a href="profile_%s.html">Profile %s</a>'
            % (html.escape(str(pid)), html.escape(str(pid)))
            if pid
            else "—"
        )
        review_rows.append(
            """
    <div class="review-item">
      <div class="title">%s</div>
      <div class="meta">For %s · %s <span class="stars">%s</span> · %s</div>
    </div>"""
            % (tit, link, pname, stars, author)
        )

    reviews_body = (
        "".join(review_rows)
        if review_rows
        else '<p style="text-align:center;color:var(--muted);padding:2rem;">No review entries in JSON yet. Run recovery with review listing download, or place reviews.json in json/</p>'
    )

    reviews_page = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Reviews — Archive</title>
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
  <header class="topnav">
    <h1><a href="index.html">ShemaleWiki Archive</a></h1>
    <nav>
      <a href="index.html">Directory</a>
      <a href="reviews.html">Reviews</a>
      <a href="about.html">About</a>
    </nav>
  </header>
  <section class="profile-page reviews-page">
    <h1 style="margin-bottom:1rem;">Reviews</h1>
    <p style="color:var(--muted);margin-bottom:1.5rem;">%d entries in index.</p>
    %s
  </section>
</body>
</html>""" % (len(review_rows), reviews_body)

    (output_dir / "reviews.html").write_text(reviews_page, encoding="utf-8")

    # --- about.html ---
    about_html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>About — Archive</title>
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
  <header class="topnav">
    <h1><a href="index.html">ShemaleWiki Archive</a></h1>
    <nav>
      <a href="index.html">Directory</a>
      <a href="reviews.html">Reviews</a>
      <a href="about.html">About</a>
    </nav>
  </header>
  <article class="profile-page">
    <h1>About this mirror</h1>
    <p class="bio">This is a static snapshot produced for preservation and research.
    Content was recovered from public web archives (e.g. Wayback Machine). Images may load from archive.org or original CDN URLs if still available.</p>
    <p class="bio">This project is not affiliated with, endorsed by, or connected to the former shemalewiki.com operators. Deploy only in compliance with applicable law and hosting policies.</p>
    <h2 style="margin-top:1.5rem;font-size:1.1rem;">Deploy</h2>
    <p class="bio">Upload the <code>site/</code> folder to any static host: S3+CloudFront, Netlify, Vercel, GitHub Pages, nginx, Apache, or Caddy. Only static files are required — no server-side runtime.</p>
    <p class="footer-note">Build via <code>python build_recovery_site.py</code></p>
  </article>
</body>
</html>"""
    (output_dir / "about.html").write_text(about_html, encoding="utf-8")

    # --- robots.txt ---
    (output_dir / "robots.txt").write_text(
        "User-agent: *\nAllow: /\n",
        encoding="utf-8",
    )

    # --- README deploy ---
    deploy_md = """# Static site deploy (recovery)

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
"""
    (output_dir / "README-DEPLOY.md").write_text(deploy_md, encoding="utf-8")

    return output_dir, n_profiles, n_reviews


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--output-dir",
        type=str,
        default=None,
        help="Output directory (default: shemalewiki_recovery/site)",
    )
    args = ap.parse_args()
    out, np, nr = build_site(args.output_dir)
    print("Built site at: %s" % out)
    print("Profiles: %d, review rows: %d" % (np, nr))


if __name__ == "__main__":
    main()
