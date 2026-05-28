@echo off
echo =============================================
echo KINKY.NL PHOTO SCRAPER — ShemaleWiki
echo =============================================
echo.
echo This script downloads photos from kinky.nl
echo profiles and uploads them to the site.
echo.
echo Requirements:
echo   - Python 3 installed (https://python.org)
echo   - pip install requests
echo.
echo Press any key to start (first 20 profiles)...
pause > nul

python kinky_photo_scraper.py --limit 20 --delay 3

echo.
echo =============================================
echo DONE! Check the output above for results.
echo.
echo To process ALL profiles, run:
echo   python kinky_photo_scraper.py --delay 3
echo =============================================
pause
