@echo off
title AI Money Mentor - Starting Application
color 0A

echo.
echo ========================================
echo    AI Money Mentor - Starting Services
echo ========================================
echo.

:: Check if virtual environment exists
if not exist "backend\venv" (
    echo Creating Python virtual environment...
    cd backend
    python -m venv venv
    echo Virtual environment created!
    cd ..
)

:: Activate virtual environment and install backend dependencies
echo.
echo Installing backend dependencies...
cd backend
call venv\Scripts\activate
pip install -r requirements.txt
cd ..

:: Check if node_modules exists
if not exist "frontend\node_modules" (
    echo.
    echo Installing frontend dependencies...
    cd frontend
    npm install
    cd ..
)

:: Start backend server in new window
echo.
echo Starting backend server...
start "AI Money Mentor - Backend" cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload"

:: Wait a moment for backend to start
timeout /t 3 /nobreak >nul

:: Start frontend server in new window
echo.
echo Starting frontend server...
start "AI Money Mentor - Frontend" cmd /k "cd frontend && npm run dev"

:: Wait a moment for frontend to start
timeout /t 5 /nobreak >nul

:: Open browser automatically
echo.
echo Opening application in browser...
start http://localhost:5173

echo.
echo ========================================
echo   AI Money Mentor is now running!
echo ========================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window...
echo (The servers will continue running)
pause >nul
