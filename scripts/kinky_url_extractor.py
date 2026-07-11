"""
kinky_url_extractor.py v2 — Improved photo URL extraction for kinky.nl profiles
Runs from Maxi's PC with visible Firefox. Extracts URLs only (NO download).
Saves to kinky_ profiles first, then relinks to UUID profiles.

Key improvements over v1:
  - Scrolls page to trigger lazy-loaded images
  - Better CSS selectors (background-image, picture elements, data-src)
  - Aggressive junk filtering (SVGs, payment icons, flags, logos, tracking pixels)
  - Longer wait time for gallery to load
  - Resets old progress to reprocess all profiles

Usage:
    python kinky_url_extractor.py --limit 5 --delay 3
    python kinky_url_extractor.py --limit 0 --delay 2  # all
"""

import argparse
import json
import os
import sys
import time
import traceback
import requests
from playwright.sync_api import sync_playwright

# ============================================================
# CONFIG
# ============================================================
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://qtuzpswxzengqoqqwtpt.supabase.co")
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
if not SERVICE_KEY:
    print("ERROR: SUPABASE_SERVICE_KEY environment variable is required.")
    print("Set it: export SUPABASE_SERVICE_KEY='your-key-here'")
    sys.exit(1)

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
}

PROGRESS_FILE = os.path.join(os.path.dirname(__file__), "kinky_extractor_progress.json")
STATE_FILE = os.path.join(os.path.dirname(__file__), "kinky_extractor_state.json")

# Junk patterns — anything matching these is rejected
JUNK_PATTERNS = [
    # Payment/logos
    'mastercard', 'visacard', 'ideal', 'bancontact', 'paypal', 'maestro',
    # File types that are never profile photos
    '.svg',
    # Logos, icons, flags
    '/logo', '/icon', '/flag', 'favicon', 'apple-touch',
    # Ads & tracking
    'doubleclick', 'googlead', 'exoclick', 'juicyads', 'trafficjunky',
    'pixel', 'adform', 'casalemedia', 'quantserve',
    'facebook.com', 'gravatar',
    # Banners & UI elements
    '/banner', 'banner_', 'placeholder', 'ajax-loader', 'spinner',
]

# Patterns that indicate actual profile photos
GOOD_PATTERNS = [
    'kinky-images.nl', 'kinkykiekjes.nl', 'cloudfront.net',
    '/fotos/', '/photos/', '/gallery/', '/afbeeldingen/',
    '_large', '_full', '_big', '-large', '-full',
    'upload/', '/media/', '/images/profile',
]


def get_next_photo_id() -> int:
    """Get the next available bigint ID for photos table."""
    r = requests.get(
        f"{SUPABASE_URL}/rest/v1/photos?select=id&order=id.desc&limit=1",
        headers=HEADERS,
    )
    if r.status_code == 200 and r.json():
        return r.json()[0]["id"] + 1
    return 1


def extract_photo_urls(page) -> list[str]:
    """Extract full-size photo URLs from a kinky.nl profile page."""
    # First, scroll to trigger lazy loading
    page.evaluate("""() => {
        window.scrollTo(0, document.body.scrollHeight / 4);
    }""")
    time.sleep(0.3)
    page.evaluate("""() => {
        window.scrollTo(0, document.body.scrollHeight / 2);
    }""")
    time.sleep(0.3)
    page.evaluate("""() => {
        window.scrollTo(0, document.body.scrollHeight);
    }""")
    time.sleep(0.5)
    page.evaluate("""() => {
        window.scrollTo(0, 0);
    }""")
    time.sleep(0.3)

    urls = page.evaluate("""() => {
        const JUNK = ['mastercard', 'visacard', 'ideal', 'bancontact', 'paypal',
                       '.svg', '/logo', '/icon', '/flag', 'favicon', 'apple-touch',
                       'doubleclick', 'googlead', 'exoclick', 'juicyads', 'trafficjunky',
                       'pixel', 'adform', 'casemedia', 'quantserve',
                       'facebook.com', 'gravatar', 'banner', 'placeholder', 'ajax-loader', 'spinner'];
        
        const GOOD = ['kinky-images.nl', 'kinkykiekjes.nl', 'cloudfront.net',
                      '/fotos/', '/photos/', '/gallery/', '/afbeeldingen/',
                      'upload/', '/media/', '/images/profile'];
        
        const seen = new Set();
        const results = [];

        function isGood(url) {
            const low = url.toLowerCase();
            // Must pass junk filter
            if (JUNK.some(j => low.includes(j))) return false;
            // Must be an image URL
            if (!low.match(/\.(jpg|jpeg|png|webp|gif|bmp)(\?|$|#)/i) &&
                !GOOD.some(g => low.includes(g))) return false;
            return true;
        }

        function addUrl(src) {
            if (!src || seen.has(src)) return;
            if (src.startsWith('data:')) return;
            if (!isGood(src)) return;
            // Convert thumbnail to full-size
            let full = src
                .replace('_thumb_', '_')
                .replace('/thumb/', '/')
                .replace('_thumb.', '.')
                .replace('-150x150', '')
                .replace('-300x300', '')
                .replace('-thumbnail', '');
            seen.add(full);
            results.push(full);
        }

        // Strategy 1: Gallery/slider containers
        const gallerySelectors = [
            '[class*="gallery"]', '[class*="slider"]', '[class*="carousel"]',
            '[class*="fotorama"]', '[class*="photos"]', '[class*="media-gallery"]',
            '[id*="gallery"]', '[id*="slider"]', '[id*="carousel"]',
            '[class*="swiper"]', '[class*="slick"]', '[class*="owl"]',
            '[class*="lightbox"]', '[class*="slideshow"]',
            // kinky.nl specific
            '[class*="profile-photo"]', '[class*="photo-container"]',
            '[class*="image-container"]', '[class*="thumb"]',
        ];
        
        for (const sel of gallerySelectors) {
            try {
                for (const container of document.querySelectorAll(sel)) {
                    for (const img of container.querySelectorAll('img')) {
                        const src = img.src || img.getAttribute('data-src') || 
                                    img.getAttribute('data-lazy') || img.getAttribute('srcset');
                        if (img.naturalWidth >= 200) addUrl(src);
                    }
                    // Also check background images
                    for (const el of container.querySelectorAll('[style*="background"]')) {
                        const bg = el.style.backgroundImage;
                        if (bg) {
                            const match = bg.match(/url\(["']?([^"')]+)["']?\)/);
                            if (match) addUrl(match[1]);
                        }
                    }
                }
            } catch(e) {}
        }

        // Strategy 2: All large images on page (fallback)
        if (results.length === 0) {
            for (const img of document.querySelectorAll('img')) {
                if (img.naturalWidth < 250 || img.naturalHeight < 250) continue;
                const src = img.src || img.getAttribute('data-src') || 
                            img.getAttribute('data-lazy') || img.getAttribute('srcset');
                addUrl(src);
            }
            // Also check picture elements
            for (const pic of document.querySelectorAll('picture source')) {
                const src = pic.getAttribute('srcset') || pic.getAttribute('data-srcset');
                if (src) {
                    const firstUrl = src.split(',')[0].trim().split(' ')[0];
                    addUrl(firstUrl);
                }
            }
        }

        // Strategy 3: Check for data attributes on any element
        if (results.length === 0) {
            for (const el of document.querySelectorAll('[data-src], [data-image], [data-photo], [data-full]')) {
                const src = el.getAttribute('data-src') || el.getAttribute('data-image') ||
                           el.getAttribute('data-photo') || el.getAttribute('data-full');
                addUrl(src);
            }
        }

        return results;
    }""")
    return urls


def load_progress() -> set:
    """Load set of already-processed profile IDs."""
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, "r") as f:
            return set(json.load(f))
    return set()


def save_progress(done_ids: set):
    """Save processed profile IDs to disk."""
    with open(PROGRESS_FILE, "w") as f:
        json.dump(list(done_ids), f)


def load_state() -> dict:
    """Load saved state with next_photo_id."""
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r") as f:
            return json.load(f)
    return {}


def save_state(state: dict):
    """Save state (next_photo_id) to disk."""
    with open(STATE_FILE, "w") as f:
        json.dump(state, f)


def prepare_extractor():
    """Delete old progress to force reprocessing of all profiles."""
    if os.path.exists(PROGRESS_FILE):
        os.remove(PROGRESS_FILE)
        print("  🧹 Old progress deleted — all profiles will be reprocessed")
    if os.path.exists(STATE_FILE):
        os.remove(STATE_FILE)
        print("  🧹 Old state deleted")


def main():
    parser = argparse.ArgumentParser(description="Extract kinky.nl photo URLs v2 (no download)")
    parser.add_argument("--limit", type=int, default=5, help="Max profiles (0=all)")
    parser.add_argument("--delay", type=float, default=3.0, help="Seconds between profiles")
    parser.add_argument("--start-from", type=int, default=0, help="Skip first N profiles")
    parser.add_argument("--fresh", action="store_true", help="Delete old progress and start fresh")
    args = parser.parse_args()

    print("=" * 60)
    print("KINKY.NL PHOTO URL EXTRACTOR v2")
    print(f"Limit: {args.limit if args.limit > 0 else 'ALL'} | Delay: {args.delay}s | Start: {args.start_from}")
    print("=" * 60)

    if args.fresh:
        prepare_extractor()

    # 1. Test Supabase connectivity
    print("\n[1/5] Testing Supabase connection...")
    try:
        r = requests.get(f"{SUPABASE_URL}/rest/v1/profiles?select=id&limit=1", headers=HEADERS)
        if r.status_code == 200:
            print("  ✅ Supabase OK")
        else:
            print(f"  ❌ Supabase error: {r.status_code} {r.text[:200]}")
            input("Press Enter to exit...")
            return
    except Exception as e:
        print(f"  ❌ Cannot reach Supabase: {e}")
        input("Press Enter to exit...")
        return

    # 2. Get profiles needing photos
    print("\n[2/5] Loading profiles from Supabase...")
    r = requests.get(
        f"{SUPABASE_URL}/rest/v1/profiles?select=id,url,name,location"
        f"&url=ilike.*kinky.nl*&limit=1000",
        headers=HEADERS,
    )
    if r.status_code != 200:
        print(f"  ❌ Query failed: {r.status_code}")
        input("Press Enter to exit...")
        return

    all_profiles = r.json()
    print(f"  Found {len(all_profiles)} kinky.nl profiles")

    # Load progress
    done = load_progress()
    profiles = [p for p in all_profiles if p["id"] not in done]
    print(f"  {len(profiles)} remaining to process ({len(done)} already done)")

    # Apply start-from + limit
    profiles = profiles[args.start_from:]
    if args.limit > 0:
        profiles = profiles[:args.limit]

    if not profiles:
        print("\n  ✅ All profiles already processed!")
        input("Press Enter to exit...")
        return

    print(f"  Will process: {len(profiles)} profiles")

    # Setup next_photo_id
    state = load_state()
    next_id = state.get("next_photo_id", get_next_photo_id())
    print(f"  Next photo ID: {next_id}")

    # 3. Launch Firefox
    print("\n[3/5] Launching Firefox (visible)...")
    print("  ⚠️  Keep Firefox visible — DO NOT minimize")
    stats = {"profiles": 0, "photos": 0, "errors": 0}

    try:
        with sync_playwright() as p:
            browser = p.firefox.launch(headless=False)
            page = browser.new_page()
            page.set_default_timeout(20000)

            for i, profile in enumerate(profiles):
                pid = profile["id"]
                url = profile.get("url", "")
                name = profile.get("name", "Unknown")

                if not url:
                    print(f"  [{i+1}/{len(profiles)}] {name} — NO URL, skipping")
                    done.add(pid)
                    save_progress(done)
                    continue

                print(f"  [{i+1}/{len(profiles)}] {name} — {url[:70]}...")

                try:
                    page.goto(url, wait_until="domcontentloaded")
                    # Extra wait for gallery JS to initialize
                    time.sleep(args.delay)

                    # Extract photo URLs
                    urls = extract_photo_urls(page)
                    print(f"    📸 Found {len(urls)} photos")

                    if urls:
                        # Insert into photos table
                        batch = []
                        for photo_url in urls:
                            batch.append({
                                "id": next_id,
                                "profile_id": pid,
                                "photo_url": photo_url,
                            })
                            next_id += 1

                        # Insert in chunks of 50
                        for chunk_start in range(0, len(batch), 50):
                            chunk = batch[chunk_start : chunk_start + 50]
                            r = requests.post(
                                f"{SUPABASE_URL}/rest/v1/photos",
                                headers={**HEADERS, "Prefer": "return=minimal"},
                                json=chunk,
                            )
                            if r.status_code == 201:
                                stats["photos"] += len(chunk)
                            else:
                                print(f"    ⚠️ Upload error: {r.status_code}")
                                # Try one-by-one
                                for item in chunk:
                                    r2 = requests.post(
                                        f"{SUPABASE_URL}/rest/v1/photos",
                                        headers={**HEADERS, "Prefer": "return=minimal"},
                                        json=item,
                                    )
                                    if r2.status_code == 201:
                                        stats["photos"] += 1
                                    else:
                                        next_id -= 1
                        print(f"    ✅ Saved {len(batch)} URLs")
                    else:
                        print(f"    ℹ️  No photos found")

                    stats["profiles"] += 1

                except Exception as e:
                    print(f"    ❌ Error: {e}")
                    stats["errors"] += 1

                # Save progress
                done.add(pid)
                save_progress(done)
                save_state({"next_photo_id": next_id})

            browser.close()

    except Exception as e:
        print(f"\n🔥 FATAL: {e}")
        traceback.print_exc()
        save_state({"next_photo_id": next_id})

    # 4. Relink photos to UUID profiles
    print("\n[4/5] Relinking photos to UUID profiles...")
    try:
        # Get UUID→name mapping for NL profiles
        r = requests.get(
            f"{SUPABASE_URL}/rest/v1/profiles?select=id,name,location"
            f"&location=ilike.*%|%Netherlands%|*&limit=1200",
            headers=HEADERS,
        )
        uuid_profiles = {p["name"].strip().lower(): p["id"] for p in r.json()}
        
        # Get kinky_ profiles that just got photos
        r = requests.get(
            f"{SUPABASE_URL}/rest/v1/profiles?select=id,name&id=ilike.kinky_*&limit=600",
            headers=HEADERS,
        )
        kinky_names = {p["id"]: p["name"].strip().lower() for p in r.json()}

        relinked = 0
        for kid, name in kinky_names.items():
            if name in uuid_profiles:
                uuid_id = uuid_profiles[name]
                # Update photos from kinky_ ID to UUID ID
                r = requests.patch(
                    f"{SUPABASE_URL}/rest/v1/photos?profile_id=eq.{kid}",
                    headers={**HEADERS, "Prefer": "return=minimal"},
                    json={"profile_id": uuid_id},
                )
                if r.status_code in (200, 204):
                    relinked += 1

        print(f"  ✅ Relinked photos for {relinked} profiles → UUID IDs")
    except Exception as e:
        print(f"  ⚠️ Relink error: {e}")

    # 5. Report
    print("\n[5/5] DONE")
    print(f"  Profiles processed: {stats['profiles']}")
    print(f"  Photo URLs saved:   {stats['photos']}")
    print(f"  Errors:             {stats['errors']}")
    print(f"  Progress saved to:  {PROGRESS_FILE}")
    input("\nPress Enter to exit...")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n💥 UNHANDLED ERROR: {e}")
        traceback.print_exc()
        input("Press Enter to exit...")
