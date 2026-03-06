@echo off
echo ==========================================
echo Starting Student Management System
echo ==========================================

echo [1/2] Starting Backend Server (Port 3000)...
start "SMS Backend" npm run server

timeout /t 5 /nobreak >nul

echo [2/2] Starting Frontend App...
start "SMS Frontend" npm run dev

echo ==========================================
echo Servers are running!
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo ==========================================
echo Please wait for the browser to open (or open http://localhost:5173 manually).
pause
