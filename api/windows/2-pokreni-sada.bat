@echo off
rem ============================================================
rem  CistoMore server - pokreni odmah (bez ponovnog paljenja racunala)
rem ============================================================
setlocal
net session >nul 2>&1
if %errorlevel% neq 0 (
  powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)
schtasks /End /TN "CistoMore server" >nul 2>&1
powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { $_.CommandLine -like '*server.js*' -and $_.ExecutablePath } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"
taskkill /IM cloudflared.exe /F >nul 2>&1
if exist "%~dp0..\data\adresa.txt" del "%~dp0..\data\adresa.txt"
schtasks /Run /TN "CistoMore server"
echo.
echo Server se pokrece. Cekam adresu tunela (do 60 s)...
for /L %%i in (1,1,30) do (
  if exist "%~dp0..\data\adresa.txt" goto ima
  timeout /t 2 /nobreak >nul
)
echo Adresa jos nije spremna. Pogledaj api\logs\server.log ili pokreni status.bat.
pause
exit /b

:ima
echo.
echo Server radi. Javna adresa:
type "%~dp0..\data\adresa.txt"
echo.
echo Stranice je pronalaze same (grana api-adresa na GitHubu) za 1-5 minuta.
pause
