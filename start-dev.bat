@echo off
title HerbVision AI - Dev Servers
color 0A
echo.
echo =========================================
echo   HerbVision AI - Starting Dev Servers
echo =========================================
echo.

:: Start Backend
echo [1/2] Starting FastAPI backend on port 8000...
start "HerbVision Backend" cmd /k "cd /d D:\Projects\HerbVision AI\herbvision-ai\backend && venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

:: Wait for backend to start
timeout /t 4 /nobreak > nul

:: Start Frontend
echo [2/2] Starting Vite frontend on port 5173...
start "HerbVision Frontend" cmd /k "cd /d D:\Projects\HerbVision AI\herbvision-ai\frontend && npm run dev"

echo.
echo =========================================
echo   Both servers starting in new windows!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo =========================================
echo.
pause
