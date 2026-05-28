#!/usr/bin/env python3
"""
Kinky.nl Photo Scraper — Cross-platform (Windows/Linux/Mac)
Downloads photos from kinky.nl escort profiles and uploads to Supabase Storage.

Usage:
  python kinky_photo_scraper.py [--limit 10] [--delay 2]

Requirements:
  pip install requests supabase

Windows: save this file anywhere, double-click or run from CMD
"""

import os, sys, json, time, hashlib, argparse
import requests
from pathlib import Path

# === CONFIGURATION ===
SUPABASE_URL = "https://qtuzpswxzengqoqqwtpt.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0dXpwc3d4emVuZ3FvcXF3dHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc3NjEwOSwiZXhwIjoyMDk0MzUyMTA5fQ.uWpUtFDsYFqDwndAbAEzbnQIOnKDfzS6V5_Xsrsbv1E"
BUCKET = "profile-photos"
HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
}

def get_kinky_profiles(limit=None):
    """Fetch kinky.nl profiles from Supabase that don't have photos yet"""
    offset = 0
    all_profiles = []
    
    while True:
        resp = requests.get(
            f"{SUPABASE_URL}/rest/v1/profiles",
            headers=HEADERS,
            params={
                "select": "id,name,url",
                "url": "ilike.*kinky.nl*",
                "limit": 500,
                "offset": offset,
                "order": "created_at.desc"
            }
        )
        if resp.status_code != 200:
            print(f"  Error fetching profiles: {resp.status_code}")
            break
        
        batch = resp.json()
        if not batch:
            break
        
        all_profiles.extend(batch)
        offset += 500
        if limit and len(all_profiles) >= limit:
            all_profiles = all_profiles[:limit]
            break
        
        print(f"  Fetched {len(all_profiles)} profiles so far...")
        if len(batch) < 500:
            break
    
    return all_profiles

def check_existing_photos(profile_id):
    """Check if profile already has photos in storage"""
    resp = requests.get(
        f"{SUPABASE_URL}/storage/v1/object/list/{BUCKET}",
        headers=HEADERS,
        params={"prefix": f"kinky/{profile_id}/", "limit": 1}
    )
    if resp.status_code == 200:
        data = resp.json()
        return len(data) > 0
    return False

def extract_photos_from_page(url):
    """Extract photo URLs from a kinky.nl profile page"""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=20)
        if resp.status_code != 200:
            print(f"    HTTP {resp.status_code}")
            return []
        
        html = resp.text
        
        # kinky.nl stores photos in various patterns. Try these:
        photos = set()
        
        # Pattern 1: data-src or src attributes with image URLs
        import re
        for pattern in [
            r'(?:data-src|src)=["\']([^"\']*?(?:img\.kinky\.nl|kinky\.nl.*?\.jpg|kinky\.nl.*?\.jpeg|kinky\.nl.*?\.png|kinky\.nl.*?\.webp))["\']',
            r'https?://[^"\'\s]+?kinky\.nl[^"\'\s]*?\.(?:jpg|jpeg|png|webp)',
            r'https?://img\.kinky\.nl[^"\'\s]+',
        ]:
            matches = re.findall(pattern, html, re.IGNORECASE)
            for m in matches:
                if isinstance(m, tuple):
                    m = m[0]
                if m.startswith("//"):
                    m = "https:" + m
                photos.add(m)
        
        print(f"    Found {len(photos)} photo URLs")
        return list(photos)[:50]  # Max 50 photos per profile
        
    except Exception as e:
        print(f"    Error: {e}")
        return []

def download_photo(url, save_path):
    """Download a single photo"""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=30)
        if resp.status_code == 200:
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            with open(save_path, "wb") as f:
                f.write(resp.content)
            return True
    except Exception as e:
        print(f"      Download error: {e}")
    return False

def upload_to_supabase(local_path, storage_path):
    """Upload photo to Supabase Storage"""
    # Determine content type
    ext = os.path.splitext(local_path)[1].lower()
    content_types = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", 
                     ".png": "image/png", ".webp": "image/webp"}
    content_type = content_types.get(ext, "image/jpeg")
    
    with open(local_path, "rb") as f:
        resp = requests.post(
            f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{storage_path}",
            headers={**HEADERS, "Content-Type": content_type},
            data=f,
            timeout=60
        )
    
    if resp.status_code in (200, 201):
        return f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{storage_path}"
    else:
        print(f"      Upload error: {resp.status_code} {resp.text[:100]}")
        return None

def insert_photo_record(profile_id, photo_url, order_index):
    """Insert photo reference into photos table"""
    # Check if photos table exists and insert
    photo_id = hashlib.md5(f"{profile_id}_{order_index}".encode()).hexdigest()
    resp = requests.post(
        f"{SUPABASE_URL}/rest/v1/photos",
        headers={**HEADERS, "Prefer": "return=minimal"},
        json={
            "id": photo_id,
            "profile_id": profile_id,
            "photo_url": photo_url,
            "order_index": order_index
        }
    )
    return resp.status_code in (200, 201, 204, 409)  # 409 = already exists

def main():
    parser = argparse.ArgumentParser(description="Scrape photos from kinky.nl")
    parser.add_argument("--limit", type=int, default=None, help="Max profiles to process")
    parser.add_argument("--delay", type=float, default=2.0, help="Delay between requests (seconds)")
    parser.add_argument("--temp-dir", default="./kinky_photos_temp", help="Temp directory for downloads")
    args = parser.parse_args()
    
    print("=" * 60)
    print("KINKY.NL PHOTO SCRAPER")
    print("=" * 60)
    
    # Get profiles
    print("\n[1/4] Fetching kinky.nl profiles from Supabase...")
    profiles = get_kinky_profiles(limit=args.limit)
    print(f"  Total: {len(profiles)} profiles")
    
    # Filter: skip profiles that already have photos
    print("\n[2/4] Checking for existing photos...")
    to_process = []
    skipped = 0
    for p in profiles:
        if check_existing_photos(p["id"]):
            skipped += 1
        else:
            to_process.append(p)
    
    print(f"  Already have photos: {skipped}")
    print(f"  Need photos: {len(to_process)}")
    
    # Process
    print(f"\n[3/4] Scraping photos (delay={args.delay}s)...")
    success = 0
    fail = 0
    total_photos = 0
    
    for i, profile in enumerate(to_process):
        pid = profile["id"]
        name = profile["name"]
        url = profile.get("url", "")
        
        print(f"\n  [{i+1}/{len(to_process)}] {name} ({pid})")
        print(f"    URL: {url}")
        
        if not url:
            print("    No URL, skipping")
            fail += 1
            continue
        
        # Extract photo URLs
        photo_urls = extract_photos_from_page(url)
        
        if not photo_urls:
            print("    No photos found")
            fail += 1
            continue
        
        # Download and upload each photo
        downloaded = 0
        for j, photo_url in enumerate(photo_urls):
            # Generate filename
            ext = os.path.splitext(photo_url.split("?")[0])[1] or ".jpg"
            if ext not in (".jpg", ".jpeg", ".png", ".webp"):
                ext = ".jpg"
            
            local_path = os.path.join(args.temp_dir, pid, f"{j:03d}{ext}")
            storage_path = f"kinky/{pid}/{j:03d}{ext}"
            
            # Download
            if download_photo(photo_url, local_path):
                # Upload to Supabase
                public_url = upload_to_supabase(local_path, storage_path)
                if public_url:
                    # Insert DB record
                    insert_photo_record(pid, public_url, j)
                    downloaded += 1
                    total_photos += 1
            
            # Clean up local file
            if os.path.exists(local_path):
                os.remove(local_path)
            
            time.sleep(args.delay * 0.5)  # Small delay between photos
        
        if downloaded > 0:
            print(f"    ✅ Downloaded {downloaded}/{len(photo_urls)} photos")
            success += 1
        else:
            print(f"    ❌ Failed to download any photos")
            fail += 1
        
        time.sleep(args.delay)
    
    # Summary
    print(f"\n{'='*60}")
    print(f"[4/4] COMPLETE")
    print(f"  Profiles processed: {len(to_process)}")
    print(f"  Success: {success}")
    print(f"  Failed: {fail}")
    print(f"  Total photos uploaded: {total_photos}")
    print(f"{'='*60}")
    
    # Clean temp dir
    try:
        os.rmdir(args.temp_dir)
    except:
        pass

if __name__ == "__main__":
    main()
