@echo off
echo =============================================
echo KINKY.NL PHOTO SCRAPER — ShemaleWiki
echo =============================================
echo.
echo Verificando Python...

python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python no encontrado.
    echo Instalalo de https://python.org
    echo IMPORTANTE: tilda "Add Python to PATH" al instalar
    pause
    exit /b 1
)

echo Python OK. Instalando dependencias...
pip install requests --quiet 2>nul

echo.
echo Ejecutando scraper (5 perfiles de prueba)...
echo.
python kinky_photo_scraper.py --limit 5 --delay 3

echo.
echo =============================================
echo LISTO.
echo Si funciono, edita este .bat y cambia --limit 5
echo por --limit 0 para procesar TODOS los perfiles.
echo =============================================
pause
