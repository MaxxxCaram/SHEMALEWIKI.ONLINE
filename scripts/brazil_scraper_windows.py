#!/usr/bin/env python3
"""
Multi-Source Brazil Scraper — for Maxima's Windows PC
Scrapes Brazilian escort directories for trans profiles.

Sources tried:
  - distintas.net.br (DNS blocked from server, may work from PC)
  - photoacompanhantes.com (Cloudflare 403)
  - garotacomlocal.com (to test)

Usage:
  python brazil_scraper.py --source distintas --limit 50

Requirements:
  pip install requests beautifulsoup4
"""

import os, sys, json, time, hashlib, argparse, re
import requests
from urllib.parse import urljoin

SUPABASE_URL = "https://qtuzpswxzengqoqqwtpt.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0dXpwc3d4emVuZ3FvcXF3dHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc3NjEwOSwiZXhwIjoyMDk0MzUyMTA5fQ.uWpUtFDsYFqDwndAbAEzbnQIOnKDfzS6V5_Xsrsbv1E"
HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

# Cities to scrape (top Brazilian cities for trans escorts)
CITIES = [
    ("São Paulo", "sp", "sao-paulo"),
    ("Rio de Janeiro", "rj", "rio-de-janeiro"),
    ("Belo Horizonte", "mg", "belo-horizonte"),
    ("Brasília", "df", "brasilia"),
    ("Salvador", "ba", "salvador"),
    ("Fortaleza", "ce", "fortaleza"),
    ("Curitiba", "pr", "curitiba"),
    ("Porto Alegre", "rs", "porto-alegre"),
    ("Recife", "pe", "recife"),
    ("Manaus", "am", "manaus"),
]

def scrape_distintas(city_state, city_name, city_slug, limit=50):
    """Scrape distintas.net for a given city"""
    profiles = []
    state = city_state.lower()
    city_url = city_slug
    
    url = f"https://distintas.net/acompanhantes/{state}/{city_url}"
    print(f"\n  Checking: {url}")
    
    try:
        resp = requests.get(url, headers=HEADERS, timeout=20)
        if resp.status_code == 200:
            print(f"    HTTP 200, {len(resp.text):,} bytes")
            
            # Extract profile cards
            # distintas.net uses a card-based layout
            # Look for profile links
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(resp.text, 'html.parser')
            
            # Common patterns for escort listing cards
            cards = soup.select('article, .card, .listing, .escort-card, [class*="model"], [class*="profile"]')
            if not cards:
                cards = soup.select('a[href*="/acompanhante/"], a[href*="/escort/"], a[href*="/model/"]')
            
            print(f"    Found {len(cards)} potential cards/links")
            
            count = 0
            seen = set()
            for card in cards:
                if card.name == 'a' and card.get('href'):
                    link = urljoin(url, card['href'])
                    name = card.get_text(strip=True)[:50] or card.get('title', '')[:50]
                else:
                    link_el = card.select_one('a[href]')
                    if not link_el:
                        continue
                    link = urljoin(url, link_el['href'])
                    name_el = card.select_one('h2, h3, h4, .name, .title, [class*="name"]')
                    name = name_el.get_text(strip=True)[:50] if name_el else link_el.get_text(strip=True)[:50]
                
                if link in seen or not name:
                    continue
                seen.add(link)
                
                profiles.append({
                    "source_id": f"distintas_{hashlib.md5(link.encode()).hexdigest()[:8]}",
                    "name": name,
                    "url": link,
                    "city": city_name,
                    "state": state.upper(),
                    "source": "distintas.net"
                })
                count += 1
                if count >= limit:
                    break
            
            print(f"    Extracted {count} profiles")
        else:
            print(f"    HTTP {resp.status_code}")
    except Exception as e:
        print(f"    ERROR: {e}")
    
    return profiles

def insert_to_supabase(profiles, source_prefix="distintas_br"):
    """Insert profiles into Supabase"""
    if not profiles:
        return 0
    
    inserted = 0
    for p in profiles:
        profile_id = f"{source_prefix}_{p['source_id']}"
        location = f"Americas | Brazil | {p.get('state', '')} | {p.get('city', 'Unknown')}"
        
        data = {
            "id": profile_id,
            "name": p.get("name", "Unknown")[:100],
            "url": p.get("url", "")[:500],
            "location": location[:200],
            "phone": p.get("phone", "")[:50],
            "whatsapp": p.get("whatsapp", "")[:50],
        }
        
        try:
            resp = requests.post(
                f"{SUPABASE_URL}/rest/v1/profiles",
                headers={**HEADERS, "Prefer": "return=minimal"},
                json=data,
                timeout=10
            )
            if resp.status_code in (200, 201, 204):
                inserted += 1
            elif resp.status_code == 409:
                pass  # Already exists, skip
            else:
                print(f"    Insert error {resp.status_code}: {resp.text[:100]}")
        except Exception as e:
            print(f"    Exception: {e}")
    
    return inserted

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", default="distintas", choices=["distintas", "photo", "garotacomlocal"])
    parser.add_argument("--limit", type=int, default=50, help="Max profiles per city")
    parser.add_argument("--cities", nargs="+", help="City slugs to scrape (default: all)")
    parser.add_argument("--delay", type=float, default=3.0)
    args = parser.parse_args()
    
    print("=" * 60)
    print(f"BRAZIL SCRAPER — {args.source}")
    print("=" * 60)
    
    to_scrape = CITIES
    if args.cities:
        to_scrape = [c for c in CITIES if c[2] in args.cities]
    
    total_profiles = []
    
    for city_name, state, slug in to_scrape:
        print(f"\n[{city_name}, {state.upper()}]")
        
        if args.source == "distintas":
            profiles = scrape_distintas(state, city_name, slug, args.limit)
        else:
            print(f"  Source {args.source} not yet implemented")
            continue
        
        total_profiles.extend(profiles)
        
        if profiles:
            inserted = insert_to_supabase(profiles)
            print(f"  Inserted: {inserted}/{len(profiles)}")
        
        time.sleep(args.delay)
    
    print(f"\n{'='*60}")
    print(f"TOTAL: {len(total_profiles)} profiles scraped")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
