# shemalewiki.online

Recovered data, static site generator, and exported HTML from public web archives.

## Repo layout

| Path | Description |
|------|-------------|
| `recuperar_shemalewiki.py` | Wayback CDX + download + JSON export |
| `build_recovery_site.py` | Builds `shemalewiki_recovery/site/` from JSON |
| `shemalewiki_recovery/` | `html/`, `json/`, `site/` |

## Regenerate static site

```bash
pip install requests
python build_recovery_site.py
```

Output: `shemalewiki_recovery/site/` (upload this folder for static hosting).

## GitHub repository

**https://github.com/MaxxxCaram/SHEMALEWIKI.ONLINE**

Clone URL:

```text
https://github.com/MaxxxCaram/SHEMALEWIKI.ONLINE.git
```

## First-time push

From this folder (`shemalewiki.online`):

```bash
git init
git add .
git commit -m "Initial import: recovery data and static site builder"
git branch -M main
git remote add origin https://github.com/MaxxxCaram/SHEMALEWIKI.ONLINE.git
git push -u origin main
```

If `git add` is slow or you see `index.lock`, wait for it to finish, or close other Git tools, delete `.git/index.lock`, and run `git add` again.

## GitHub Pages (optional)

Repository **Settings → Pages → Build from branch `main`**, folder `/shemalewiki_recovery/site` (or move `site/` to root and set `/`).

Large repo (~80MB+): cloning may take a minute.
