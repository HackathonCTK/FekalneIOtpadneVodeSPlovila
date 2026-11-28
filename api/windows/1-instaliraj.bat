@echo off
rem ============================================================
rem  CistoMore server - instalacija (pokreni JEDNOM na racunalu sa serverom)
rem  Instalira Node.js LTS i cloudflared, napravi config.json i postavi
rem  automatsko pokretanje servera pri paljenju racunala.
rem ============================================================
setlocal
cd /d "%~dp0"

net session >nul 2>&1
if %errorlevel% neq 0 (
  echo Trazim administratorska prava...
  powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)

echo.
echo === CistoMore server: instalacija ===
echo.

where winget >nul 2>&1
if %errorlevel% neq 0 (
  echo winget nije pronadjen. U Microsoft Storeu instaliraj "App Installer", pa pokreni ovu datoteku ponovno.
  pause
  exit /b 1
)

echo [1/5] Node.js LTS...
winget install -e --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements --silent
echo.
echo [2/5] cloudflared (Cloudflare tunel)...
winget install -e --id Cloudflare.cloudflared --accept-source-agreements --accept-package-agreements --silent
echo.

echo [3/5] Postavke (api\config.json)...
if not exist "%~dp0..\config.json" (
  copy "%~dp0..\config.example.json" "%~dp0..\config.json" >nul
  echo     Napravljen config.json.
) else (
  echo     config.json vec postoji, ne diram ga.
)
echo.

echo [4/5] Automatsko pokretanje pri paljenju racunala (Task Scheduler)...
schtasks /Create /F /TN "CistoMore server" /TR "\"%~dp0pokreni-server.bat\"" /SC ONSTART /RU SYSTEM /RL HIGHEST /DELAY 0001:00
echo.

echo [5/5] Spavanje racunala
echo     Server radi samo dok je racunalo budno.
choice /C DN /M "    Iskljuciti spavanje i hibernaciju dok je racunalo na struji (preporuceno)"
if errorlevel 2 goto preskoci
powercfg /change standby-timeout-ac 0
powercfg /change hibernate-timeout-ac 0
echo     Spavanje iskljuceno.
:preskoci

echo.
echo === Gotovo ===
echo Sada u config.json upisi:
echo   - adminEmails: tvoj e-mail (npr. ["ime@gmail.com"])
echo   - googleClientId: Client ID iz Google Cloud Console
echo   - github.token: GitHub token (samo ovaj repo, Contents: Read and write)
echo Upute su u api\UPUTE-SERVER.md. Otvaram config.json...
echo Kad spremis config.json, pokreni 2-pokreni-sada.bat
echo.
notepad "%~dp0..\config.json"
pause
