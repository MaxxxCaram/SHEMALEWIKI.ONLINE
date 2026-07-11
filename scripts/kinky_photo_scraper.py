"""
Kinky.nl Photo Scraper v6 — Playwright Firefox (menos detectable que Chromium)
Uso: python kinky_photo_scraper.py --limit 1 --delay 3
"""
import os, sys, time, argparse, re
import requests
from playwright.sync_api import sync_playwright

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://qtuzpswxzengqoqqwtpt.supabase.co")
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
if not SERVICE_KEY:
    print("ERROR: SUPABASE_SERVICE_KEY environment variable is required.")
    print("Set it: export SUPABASE_SERVICE_KEY='your-key-here'")
    sys.exit(1)
BUCKET = "profile-photos"

def supabase_headers(extra=None):
    h = {"apikey": SERVICE_KEY, "Authorization": f"Bearer {SERVICE_KEY}"}
    if extra: h.update(extra)
    return h

def get_profiles(limit=None):
    print("[1/3] Obteniendo perfiles de Supabase...")
    profiles = []
    offset = 0
    while True:
        r = requests.get(
            f"{SUPABASE_URL}/rest/v1/profiles",
            headers=supabase_headers(),
            params={"select": "id,name,url", "url": "ilike.*kinky.nl*",
                    "limit": 500, "offset": offset, "order": "created_at.desc"},
            timeout=15
        )
        if r.status_code != 200:
            print(f"  ERROR HTTP {r.status_code}")
            break
        batch = r.json()
        if not batch: break
        profiles.extend(batch)
        offset += 500
        if limit and len(profiles) >= limit:
            profiles = profiles[:limit]
            break
        if len(batch) < 500: break
    print(f"  {len(profiles)} perfiles listos")
    return profiles

JUNK_DOMAINS = [
    'doubleclick', 'googlead', 'googlesyndication', 'facebook.com/tr',
    'analytics', 'pixel', 'tracking', 'banner', 'adserver',
    'exosrv', 'trafficjunky', 'juicyads', 'eroadvertising',
    'exoclick', 'adnxs', 'adsrv', 'adzerk', 'criteo',
    'cdn.taboola', 'outbrain', 'revcontent'
]

def is_junk_url(url):
    low = url.lower()
    for d in JUNK_DOMAINS:
        if d in low:
            return True
    return False

def extract_photos_smart(page, url):
    try:
        page.goto(url, wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(3000)
    except Exception as e:
        print(f"    Playwright error: {e}")
        return []

    imgs_info = page.evaluate("""() => {
        const results = [];
        document.querySelectorAll('img').forEach(img => {
            const parent = img.closest('[class]');
            const parentClass = parent ? (parent.className || '') : '';
            const grandparent = parent ? parent.parentElement : null;
            const gpClass = grandparent ? (grandparent.className || '') : '';
            results.push({
                src: (img.src || img.getAttribute('data-src') || '').split('?')[0],
                w: img.naturalWidth || img.width || 0,
                h: img.naturalHeight || img.height || 0,
                alt: (img.alt || '').toLowerCase(),
                cls: (img.className || ''),
                parentCls: parentClass.substring(0, 80),
                gpCls: gpClass.substring(0, 80)
            });
        });
        return results;
    }""")

    bg_imgs = page.evaluate("""() => {
        const urls = [];
        document.querySelectorAll('[style*="background-image"], [style*="background:"]').forEach(el => {
            const style = el.getAttribute('style') || '';
            const match = style.match(/url\\(["']?([^"')]+)["']?\\)/g);
            if (match) {
                match.forEach(m => {
                    const u = m.replace(/url\\(["']?/, '').replace(/["']?\\)/, '').split('?')[0];
                    if (u.match(/\\.(jpg|jpeg|png|webp)/i)) urls.push(u);
                });
            }
        });
        return urls;
    }""")

    valid_ext = lambda u: u.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))
    is_big = lambda i: (i['w'] >= 300 or i['h'] >= 300) or any(
        x in i['src'].lower() for x in ['/photo', '/image', '/gallery', '/upload', 'kinky', 'advertentie']
    )
    not_junk = lambda i: not is_junk_url(i['src'])
    not_icon = lambda i: not any(x in i['alt'] or x in i['src'].lower() 
        for x in ['icon', 'logo', 'flag', 'avatar_small', 'pixel', '1x1', 'tracking', 
                  'banner_ad', 'favicon', 'svg', 'placeholder', 'spacer'])
    gallery_keywords = ['gallery', 'slider', 'carousel', 'fotorama', 'photo', 'image', 
                        'picture', 'media', 'swiper', 'slick', 'slideshow']
    in_gallery = lambda i: any(kw in (i['parentCls'] + i['gpCls'] + i['cls']).lower() 
                                for kw in gallery_keywords)

    photos = []
    for img in imgs_info:
        if valid_ext(img['src']) and not_junk(img) and not_icon(img) and in_gallery(img) and is_big(img):
            photos.append((img['src'], 1))
    for img in imgs_info:
        if valid_ext(img['src']) and not_junk(img) and not_icon(img) and is_big(img):
            if img['src'] not in {p[0] for p in photos}:
                photos.append((img['src'], 2))
    for u in bg_imgs:
        if valid_ext(u) and not is_junk_url(u) and u not in {p[0] for p in photos}:
            photos.append((u, 3))

    photos.sort(key=lambda x: x[1])
    unique = list(dict.fromkeys([p[0] for p in photos]))

    print(f"    Total <img> tags: {len(imgs_info)}, bg imgs: {len(bg_imgs)}")
    print(f"    After filter: {len(unique)} candidate photos")
    for u in unique[:5]:
        print(f"      → {u[:100]}")
    return unique

def get_next_photo_id():
    r = requests.get(
        f"{SUPABASE_URL}/rest/v1/photos",
        headers=supabase_headers(),
        params={"select": "id", "order": "id.desc", "limit": 1},
        timeout=10
    )
    if r.status_code == 200 and r.json():
        return r.json()[0]["id"] + 1
    return 1

def download_upload(profile_id, photo_urls, context, id_counter):
    """Descarga con requests (mas fiable que Playwright para imagenes)"""
    uploaded = []
    
    # Headers que imitan Firefox
    img_headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0",
        "Accept": "image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5",
        "Referer": "https://www.kinky.nl/",
        "Accept-Language": "nl,en-US;q=0.7,en;q=0.3",
    }
    
    for idx, url in enumerate(photo_urls):
        ext = os.path.splitext(url.split("?")[0])[1]
        if ext not in (".jpg", ".jpeg", ".png", ".webp"):
            ext = ".jpg"
        remote_path = f"kinky/{profile_id}/{idx:03d}{ext}"

        # Intentar primero la URL con _thumb_ (la que sabemos que existe)
        # Si tiene _thumb_, usarla; si no, probar la original
        img_data = None
        urls_to_try = [url]  # la URL original YA tiene _thumb_, es la que funciona
        
        for attempt_url in urls_to_try:
            try:
                r = requests.get(attempt_url, headers=img_headers, timeout=20)
                if r.status_code == 200 and len(r.content) > 1000:
                    img_data = r.content
                    break
                elif r.status_code == 200:
                    pass  # muy chico, probar siguiente
            except Exception:
                continue

        if not img_data:
            print(f"    x download [{idx}] HTTP {r.status_code if 'r' in dir() else '?'}: {url[:80]}")
            continue

        try:
            r2 = requests.post(
                f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{remote_path}",
                headers=supabase_headers({"Content-Type": "image/jpeg"}),
                data=img_data, timeout=60
            )
            if r2.status_code in (200, 201):
                pub_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{remote_path}"
                photo_id = id_counter[0]
                id_counter[0] += 1
                r3 = requests.post(
                    f"{SUPABASE_URL}/rest/v1/photos",
                    headers=supabase_headers({"Prefer": "return=minimal", "Content-Type": "application/json"}),
                    json={"id": photo_id, "profile_id": profile_id, "photo_url": pub_url},
                    timeout=10
                )
                if r3.status_code in (200, 201):
                    uploaded.append(pub_url)
                else:
                    print(f"    x DB {r3.status_code}: {r3.text[:80]}")
            else:
                print(f"    x upload HTTP {r2.status_code}")
        except Exception as e:
            print(f"    x upload: {e}")

    return uploaded

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--limit", type=int, default=5, help="Perfiles (0=todos)")
    p.add_argument("--delay", type=float, default=3.0)
    p.add_argument("--headless", action="store_true", default=False, help="Firefox invisible")
    args = p.parse_args()

    limit = None if args.limit == 0 else args.limit

    print("=" * 55)
    print("  KINKY.NL PHOTO SCRAPER v6 (Firefox)")
    print(f"  headless={args.headless} | limit={args.limit} | delay={args.delay}s")
    print("=" * 55)

    # Test Supabase
    print("\n[0/3] Testeando conexión a Supabase...")
    try:
        r = requests.get(
            f"{SUPABASE_URL}/rest/v1/profiles?select=count",
            headers=supabase_headers(),
            params={"limit": 0}, timeout=10
        )
        if r.status_code == 200:
            print(f"  ✅ Supabase OK")
        else:
            print(f"  ❌ Supabase ERROR HTTP {r.status_code}")
            input("\nPresiona Enter para salir...")
            sys.exit(1)
    except Exception as e:
        print(f"  ❌ No se pudo conectar a Supabase: {e}")
        input("\nPresiona Enter para salir...")
        sys.exit(1)

    profiles = get_profiles(limit)
    if not profiles:
        print("\nERROR: No se pudieron obtener perfiles.")
        input("\nPresiona Enter para salir...")
        sys.exit(1)

    print(f"\n[2/3] Lanzando Firefox {'(invisible)' if args.headless else '(visible)'}...")
    total = 0
    ok = 0
    id_counter = [get_next_photo_id()]

    with sync_playwright() as pw:
        browser = pw.firefox.launch(headless=args.headless)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0",
            viewport={"width": 1920, "height": 1080},
            locale="nl-NL"
        )

        print(f"\n[3/3] Procesando {len(profiles)} perfiles...")
        for i, prof in enumerate(profiles):
            pid = prof["id"]
            name = prof["name"]
            url = prof.get("url", "")

            print(f"\n  [{i+1}/{len(profiles)}] {name}")
            print(f"    URL: {url}")

            if not url:
                print("    Sin URL - skip")
                continue

            page = context.new_page()
            photos = extract_photos_smart(page, url)
            page.close()

            if not photos:
                print("    ❌ 0 fotos de perfil encontradas")
                continue

            uploaded = download_upload(pid, photos[:30], context, id_counter)
            if uploaded:
                print(f"    ✅ {len(uploaded)} fotos subidas")
                total += len(uploaded)
                ok += 1
            else:
                print(f"    ❌ Falló la subida")

            time.sleep(args.delay)

        context.close()
        browser.close()

    print(f"\n{'='*55}")
    print(f"  RESULTADO: {ok}/{len(profiles)} perfiles OK")
    print(f"  Total fotos: {total}")
    print(f"{'='*55}")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n{'='*55}")
        print(f"  ❌ ERROR INESPERADO:")
        import traceback
        traceback.print_exc()
        print(f"{'='*55}")
    input("\nPresiona Enter para salir...")
