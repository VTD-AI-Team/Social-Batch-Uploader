@echo off
echo ========================================
echo   Social Batch Uploader - Auto Start
echo ========================================
echo.

:: Kill existing node processes
echo Stopping old server...
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 2 /nobreak >nul

:: Go to project folder
cd /d "C:\Users\vitadairy\.gemini\antigravity\scratch\social-batch-uploader"

:: Start server
echo Starting server on port 3001...
start "Social Batch Uploader" npm start -- -p 3001

:: Wait for server to be ready
timeout /t 5 /nobreak >nul

:: Open browser automatically
echo Opening browser...
start http://192.168.14.204:3001

echo.
echo ✅ Server started at http://192.168.14.204:3001
echo.
