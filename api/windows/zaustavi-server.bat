@echo off
rem ============================================================
rem  CistoMore server - zaustavi (do sljedeceg paljenja racunala ili 2-pokreni-sada.bat)
rem ============================================================
setlocal
net session >nul 2>&1
if %errorlevel% neq 0 (
  powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)
schtasks /End /TN "CistoMore server"
powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { $_.CommandLine -like '*server.js*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"
taskkill /IM cloudflared.exe /F >nul 2>&1
echo Server je zaustavljen.
pause
