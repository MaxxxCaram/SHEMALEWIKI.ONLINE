@echo off
echo =============================================
echo KINKY.NL PHOTO SCRAPER v6 — ShemaleWiki
echo =============================================
echo.

python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python no encontrado.
    pause
    exit /b 1
)

echo Instalando Playwright + Firefox...
pip install playwright --quiet 2>nul
python -m playwright install firefox 2>nul

echo.
echo Ejecutando scraper (1 perfil, Firefox VISIBLE)...
echo.
python kinky_photo_scraper.py --limit 1 --delay 3

echo.
echo =============================================
echo LISTO. Cambia --limit 1 por --limit 0 para
echo TODOS los perfiles.
echo =============================================
pause
