@echo off
REM kinky_url_extractor.bat v2 — Extract photo URLs from kinky.nl
REM Run from: G:\shemalewiki.online\scripts\
cd /d "%~dp0"

echo ========================================
echo  KINKY.NL PHOTO URL EXTRACTOR v2
echo ========================================
echo.
echo IMPROVED: scrolls gallery, better detection, filters junk
echo NO downloading — just URLs. Saves to Supabase.
echo.
echo KEEP FIREFOX VISIBLE — do NOT minimize!
echo.
echo Options:
echo   1. TEST (5 profiles, ~2 min)
echo   2. ALL profiles (~15-20 min)
echo   3. FRESH START (reset + all, ~15-20 min)
echo   4. RESUME (continue from last save)
echo.
set /p choice="Choose (1-4): "

if "%choice%"=="1" (
    python kinky_url_extractor.py --limit 5 --delay 3
) else if "%choice%"=="2" (
    python kinky_url_extractor.py --limit 0 --delay 2
) else if "%choice%"=="3" (
    python kinky_url_extractor.py --limit 0 --delay 2 --fresh
) else if "%choice%"=="4" (
    python kinky_url_extractor.py --limit 0 --delay 2
) else (
    echo Invalid choice. Running TEST mode...
    python kinky_url_extractor.py --limit 5 --delay 3
)
