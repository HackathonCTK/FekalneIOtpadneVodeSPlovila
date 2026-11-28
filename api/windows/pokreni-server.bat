@echo off
rem ============================================================
rem  CistoMore server - pokretanje (ovo pokrece Task Scheduler pri paljenju racunala)
rem  Pokrene node api\server.js; ako server stane, ponovno ga pokrene za 10 s.
rem  Zapis: api\logs\server.log
rem ============================================================
setlocal
cd /d "%~dp0.."
set "PATH=%ProgramFiles%\nodejs;%ProgramFiles(x86)%\cloudflared;%ProgramFiles%\cloudflared;%PATH%"
if not exist logs mkdir logs

:petlja
rem log veci od 5 MB premjesti u server-staro.log
for %%F in (logs\server.log) do if %%~zF GTR 5000000 move /Y logs\server.log logs\server-staro.log >nul
rem stari tunel (ako je ostao nakon pada) ugasi, server pokrece svoj
taskkill /IM cloudflared.exe /F >nul 2>&1
echo [%date% %time%] Pokrecem server >> logs\server.log
node server.js >> logs\server.log 2>&1
echo [%date% %time%] Server je stao, ponovno pokretanje za 10 s >> logs\server.log
timeout /t 10 /nobreak >nul
goto petlja
