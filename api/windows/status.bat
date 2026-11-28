@echo off
rem ============================================================
rem  CistoMore server - stanje: radi li server, javna adresa, zadnji zapisi
rem ============================================================
setlocal
cd /d "%~dp0.."
echo === Lokalna provjera (http://127.0.0.1:8787/api/health) ===
curl -s http://127.0.0.1:8787/api/health
echo.
echo.
echo === Javna adresa (tunel) ===
if exist data\adresa.txt (type data\adresa.txt) else (echo jos nema adrese)
echo.
echo === Zadnjih 25 redaka zapisa ===
if exist logs\server.log powershell -NoProfile -Command "Get-Content logs\server.log -Tail 25"
echo.
pause
