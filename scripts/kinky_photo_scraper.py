"""
Kinky.nl Photo Scraper for ShemaleWiki
v2 — Robusto, con key completa

Uso: python kinky_photo_scraper.py --limit 5 --delay 3
"""

import os, sys, time, hashlib, argparse, re
import requests

# === CONFIG (key completa) ===
SUPABASE_URL = "https://qtuzpswxzengqoqqwtpt.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0dXpwc3d4emVuZ3FvcXF3dHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc3NjEwOSwiZXhwIjoyMDk0MzUyMTA5fQ.uWpUtFDsYFqDwndAbAEzbnQIOnKDfzS6V5_Xsrsbv1E"
BUCKET = "profile-photos"

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"

def headers(extra=None):
    h = {"apikey": SERVICE_KEY, "Authorization": f"Bearer {SERVICE_KEY}", "User-Agent": UA}
    if extra:
        h.update(extra)
    return h

def get_profiles(limit=None):
    """Obtener perfiles kinky.nl de Supabase"""
    print("[1/3] Obteniendo perfiles...")
    profiles = []
    offset = 0
    while True:
        r = requests.get(
            f"{SUPABASE_URL}/rest/v1/profiles",
            headers=headers(),
            params={"select": "id,name,url", "url": "ilike.*kinky.nl*", "limit": 500, "offset": offset, "order": "created_at.desc"},
            timeout=15
        )
        if r.status_code != 200:
            print(f"  ERROR HTTP {r.status_code}: {r.text[:200]}")
            break
        batch = r.json()
        if not batch:
            break
        profiles.extend(batch)
        offset += 500
        if limit and len(profiles) >= limit:
            profiles = profiles[:limit]
            break
        if len(batch) < 500:
            break
    print(f"  {len(profiles)} perfiles listos")
    return profiles

def extract_photos(html):
    """Extraer URLs de fotos del HTML de kinky.nl"""
    found = set()
    # Patrones principales de kinky.nl
    patterns = [
        r'https?://[^"\'\\s<>]+?\.(?:jpg|jpeg|png|webp)\b',
        r'//[^"\'\\s<>]+?\.(?:jpg|jpeg|png|webp)\b',
        r'(?:src|data-src|data-lazy|content)=["\']([^"\']*?\.(?:jpg|jpeg|png|webp))["\']',
    ]
    for pat in patterns:
        for m in re.findall(pat, html, re.IGNORECASE):
            if isinstance(m, tuple):
                m = m[0]
            if m.startswith("//"):
                m = "https:" + m
            if not m.startswith("http"):
                continue
            # Filtrar cosas que claramente no son fotos de perfil
            low = m.lower()
            if any(x in low for x in ["icon", "logo", "avatar_small", "flag", "banner_ad", "pixel", "1x1", "tracking"]):
                continue
            found.add(m.split("?")[0])  # quitar query params
    return list(found)

def download_upload(profile_id, photo_urls, temp_dir):
    """Descarga y sube las fotos"""
    uploaded = []
    for idx, url in enumerate(photo_urls):
        # Generar nombre
        ext = os.path.splitext(url)[1]
        if ext not in (".jpg", ".jpeg", ".png", ".webp"):
            ext = ".jpg"
        
        local = os.path.join(temp_dir, f"{idx:03d}{ext}")
        remote = f"kinky/{profile_id}/{idx:03d}{ext}"
        
        # 1. Descargar
        try:
            r = requests.get(url, headers({"User-Agent": UA}), timeout=20)
            if r.status_code != 200:
                continue
            os.makedirs(os.path.dirname(local), exist_ok=True)
            with open(local, "wb") as f:
                f.write(r.content)
        except Exception as e:
            print(f"    ✗ descarga: {e}")
            continue
        
        # 2. Subir a Supabase Storage
        ext_map = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp"}
        ct = ext_map.get(ext, "image/jpeg")
        
        try:
            with open(local, "rb") as f:
                r2 = requests.post(
                    f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{remote}",
                    headers=headers({"Content-Type": ct}),
                    data=f,
                    timeout=60
                )
            if r2.status_code in (200, 201):
                pub_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{remote}"
                
                # 3. Insertar en tabla photos
                pid = hashlib.md5(f"{profile_id}_{idx}".encode()).hexdigest()
                requests.post(
                    f"{SUPABASE_URL}/rest/v1/photos",
                    headers=headers({"Prefer": "return=minimal"}),
                    json={"id": pid, "profile_id": profile_id, "photo_url": pub_url, "order_index": idx},
                    timeout=10
                )
                uploaded.append(pub_url)
            else:
                print(f"    ✗ upload HTTP {r2.status_code}")
        except Exception as e:
            print(f"    ✗ upload: {e}")
        
        # Limpiar
        if os.path.exists(local):
            os.remove(local)
    
    return uploaded

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--limit", type=int, default=5, help="Perfiles a procesar (0=todos)")
    p.add_argument("--delay", type=float, default=3.0, help="Delay entre perfiles")
    args = p.parse_args()
    
    limit = None if args.limit == 0 else args.limit
    
    print("=" * 55)
    print("  KINKY.NL PHOTO SCRAPER v2")
    print("=" * 55)
    
    profiles = get_profiles(limit)
    if not profiles:
        print("\nERROR: No se pudieron obtener perfiles.")
        print("¿Tenés conexión a Internet?")
        sys.exit(1)
    
    # Test rápido: ¿podemos acceder a kinky.nl?
    print("\n[2/3] Verificando acceso a kinky.nl...")
    try:
        test = requests.get("https://www.kinky.nl", headers({"User-Agent": UA}), timeout=10)
        print(f"  kinky.nl → HTTP {test.status_code}")
    except Exception as e:
        print(f"  kinky.nl → ERROR: {e}")
        print("\n  ⚠️  kinky.nl no es accesible desde esta PC con requests.")
        print("  Posible bloqueo Cloudflare. Probá abrir kinky.nl en tu navegador.")
        print("  Si abre en el navegador, hay que usar Selenium/Playwright en vez de requests.")
        sys.exit(1)
    
    print(f"\n[3/3] Procesando {len(profiles)} perfiles...")
    total = 0
    ok = 0
    
    for i, prof in enumerate(profiles):
        pid = prof["id"]
        name = prof["name"]
        url = prof.get("url", "")
        
        print(f"\n  [{i+1}/{len(profiles)}] {name}")
        
        if not url:
            print("    Sin URL — skip")
            continue
        
        # Obtener página
        try:
            r = requests.get(url, headers({"User-Agent": UA}), timeout=20)
            if r.status_code != 200:
                print(f"    HTTP {r.status_code}")
                continue
        except Exception as e:
            print(f"    Error: {e}")
            continue
        
        # Extraer fotos
        photos = extract_photos(r.text)
        print(f"    {len(photos)} URLs detectadas")
        
        if not photos:
            # Mostrar snippet del HTML para debug
            print(f"    HTML snippet: {r.text[500:800]}")
            continue
        
        # Descargar y subir
        uploaded = download_upload(pid, photos[:30], f"./temp_{pid}")
        if uploaded:
            print(f"    ✅ {len(uploaded)} fotos subidas")
            total += len(uploaded)
            ok += 1
        else:
            print(f"    ❌ 0 fotos subidas")
        
        time.sleep(args.delay)
    
    print(f"\n{'='*55}")
    print(f"  RESULTADO: {ok}/{len(profiles)} perfiles OK")
    print(f"  Total fotos: {total}")
    print(f"{'='*55}")

if __name__ == "__main__":
    main()
