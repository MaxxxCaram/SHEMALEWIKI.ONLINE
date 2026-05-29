@echo off
REM kinky_url_extractor.bat — Extract photo URLs from kinky.nl (FAST, no download)
REM Run from: G:\shemalewiki.online\scripts\
cd /d "%~dp0"

echo ========================================
echo  KINKY.NL PHOTO URL EXTRACTOR
echo ========================================
echo.
echo This will open Firefox and extract photo URLs.
echo NO downloading — just URLs. Takes ~2-3 min for 5 profiles.
echo.

python kinky_url_extractor.py --limit 5 --delay 2
