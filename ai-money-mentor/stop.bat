@echo off
title AI Money Mentor - Stopping Application
color 0C

echo.
echo ========================================
echo    AI Money Mentor - Stopping Services
echo ========================================
echo.

echo Stopping backend and frontend servers...
echo.

:: Kill processes running on ports 8000 and 5173
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8000" ^| find "LISTENING"') do (
    echo Killing process %%a (Backend on port 8000)
    taskkill /f /pid %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -aon ^| find ":5173" ^| find "LISTENING"') do (
    echo Killing process %%a (Frontend on port 5173)
    taskkill /f /pid %%a >nul 2>&1
)

:: Also kill uvicorn and npm processes
taskkill /f /im uvicorn.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1

echo.
echo ========================================
echo      All services stopped successfully!
echo ========================================
echo.
echo Press any key to exit...
pause >nul
