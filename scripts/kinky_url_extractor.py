"""
kinky_url_extractor.py — Fast photo URL extraction for kinky.nl profiles
Runs from Maxi's PC with visible Firefox. Extracts URLs only (NO download).
Uploads to Supabase photos table. Server downloads images later.

Usage:
    python kinky_url_extractor.py --limit 5 --delay 2
    python kinky_url_extractor.py --limit 0 --delay 1.5  # all 596
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
SUPABASE_URL = "https://qtuzpswxzengqoqqwtpt.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0dXpwc3d4emVuZ3FvcXF3dHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc3NjEwOSwiZXhwIjoyMDk0MzUyMTA5fQ.uWpUtFDsYFqDwndAbAEzbnQIOnKDfzS6V5_Xsrsbv1E"

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
}

PROGRESS_FILE = os.path.join(os.path.dirname(__file__), "kinky_extractor_progress.json")
STATE_FILE = os.path.join(os.path.dirname(__file__), "kinky_extractor_state.json")

# Image CDN domains (kinky.nl uses these for actual photos, not ads)
PHOTO_DOMAINS = {
    "kinky-images.nl",
    "kinkykiekjes.nl",
    "cloudfront.net",
    "kinky.nl/images",
}

# Blacklist domains (ads, trackers, icons)
BLOCKED_DOMAINS = {
    "doubleclick.net", "googleadservices.com", "googlesyndication.com",
    "exoclick.com", "trafficjunky.com", "juicyads.com",
    "facebook.com", "gravatar.com", "google-analytics.com",
    "pixel.quantserve.com", "adform.net", "casalemedia.com",
}


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
    """Extract full-size photo URLs from a kinky.nl profile page using JS."""
    urls = page.evaluate("""() => {
        const blocked = ['doubleclick', 'googlead', 'exoclick', 'juicyads',
                         'facebook', 'gravatar', 'pixel', 'adform', 'casalemedia',
                         'trafficjunky', 'banner', 'logo', 'icon', 'flag'];
        const seen = new Set();
        const results = [];

        // Strategy 1: Find gallery/slider containers
        const galleries = document.querySelectorAll('[class*="gallery"], [class*="slider"], [class*="carousel"], [class*="fotorama"], [class*="photos"], [class*="media"]');
        for (const g of galleries) {
            for (const img of g.querySelectorAll('img')) {
                const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy');
                if (!src || seen.has(src)) continue;
                if (img.naturalWidth < 200) continue;
                const low = src.toLowerCase();
                if (blocked.some(b => low.includes(b))) continue;
                // Convert thumb to full-size
                let full = src.replace('_thumb_', '_').replace('/thumb/', '/').replace('_thumb.', '.');
                seen.add(full);
                results.push(full);
            }
        }

        // Strategy 2: All large images on page
        if (results.length === 0) {
            for (const img of document.querySelectorAll('img')) {
                const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy');
                if (!src || seen.has(src)) continue;
                if (img.naturalWidth < 250 || img.naturalHeight < 250) continue;
                const low = src.toLowerCase();
                if (blocked.some(b => low.includes(b))) continue;
                let full = src.replace('_thumb_', '_').replace('/thumb/', '/').replace('_thumb.', '.');
                seen.add(full);
                results.push(full);
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


def main():
    parser = argparse.ArgumentParser(description="Extract kinky.nl photo URLs (no download)")
    parser.add_argument("--limit", type=int, default=5, help="Max profiles (0=all)")
    parser.add_argument("--delay", type=float, default=2.0, help="Seconds between profiles")
    parser.add_argument("--start-from", type=int, default=0, help="Skip first N profiles")
    args = parser.parse_args()

    print("=" * 60)
    print("KINKY.NL PHOTO URL EXTRACTOR")
    print(f"Limit: {args.limit if args.limit > 0 else 'ALL'} | Delay: {args.delay}s | Start: {args.start_from}")
    print("=" * 60)

    # 1. Test Supabase connectivity FIRST
    print("\n[1/4] Testing Supabase connection...")
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
    print("\n[2/4] Loading profiles from Supabase...")
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
    print(f"  Found {len(all_profiles)} kinky.nl profiles in DB")

    # Filter out ones that already have photos
    r = requests.get(f"{SUPABASE_URL}/rest/v1/photos?select=profile_id&limit=50000", headers=HEADERS)
    photo_pids = set(str(p["profile_id"]) for p in r.json())

    profiles = [p for p in all_profiles if str(p["id"]) not in photo_pids]
    print(f"  {len(profiles)} still need photos")

    # Load progress
    done = load_progress()
    profiles = [p for p in profiles if p["id"] not in done]
    print(f"  {len(profiles)} remaining after progress filter")

    # Apply start-from
    profiles = profiles[args.start_from:]
    # Apply limit
    if args.limit > 0:
        profiles = profiles[: args.limit]

    if not profiles:
        print("\n  ✅ All profiles already processed!")
        input("Press Enter to exit...")
        return

    print(f"  Will process: {len(profiles)} profiles")

    # Load/setup next_photo_id
    state = load_state()
    next_id = state.get("next_photo_id", get_next_photo_id())
    print(f"  Next photo ID: {next_id}")

    # 3. Launch Firefox
    print("\n[3/4] Launching Firefox (visible)...")
    stats = {"profiles": 0, "photos": 0, "errors": 0}

    try:
        with sync_playwright() as p:
            browser = p.firefox.launch(headless=False)
            page = browser.new_page()
            page.set_default_timeout(15000)

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
                    time.sleep(args.delay)

                    # Extract photo URLs
                    urls = extract_photo_urls(page)
                    print(f"    Found {len(urls)} photos")

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
                                print(f"    ✅ Uploaded {len(chunk)} URLs to Supabase")
                                stats["photos"] += len(chunk)
                            else:
                                print(f"    ⚠️ Upload error: {r.status_code} {r.text[:100]}")
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
                                        next_id -= 1  # rollback
                    else:
                        print(f"    ℹ️  No photos found on page")

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

    # 4. Report
    print("\n[4/4] DONE")
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
