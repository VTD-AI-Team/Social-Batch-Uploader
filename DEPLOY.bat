@echo off
REM ================================================
REM Social Batch Uploader - Production Deployment
REM ================================================

echo.
echo ========================================
echo   Social Batch Uploader - Deployment
echo ========================================
echo.

REM Check Node.js
echo [1/6] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found!
    echo Please install Node.js v20.11.0+ from https://nodejs.org
    pause
    exit /b 1
)
echo OK: Node.js found

REM Install dependencies
echo.
echo [2/6] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo OK: Dependencies installed

REM Build production
echo.
echo [3/6] Building production...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)
echo OK: Build complete

REM Create screenshots folder
echo.
echo [4/6] Creating screenshots folder...
if not exist "C:\VitaDairy\Screenshots" (
    mkdir "C:\VitaDairy\Screenshots"
    echo OK: Folder created at C:\VitaDairy\Screenshots
) else (
    echo OK: Folder already exists
)

REM Check .env file
echo.
echo [5/6] Checking .env configuration...
if not exist ".env" (
    echo WARNING: .env file not found
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please edit .env file to configure:
    echo   - SCREENSHOT_STORAGE_PATH
    echo   - SCREENSHOT_PUBLIC_URL
    echo.
    pause
)
echo OK: .env file exists

REM Install PM2
echo.
echo [6/6] Installing PM2...
call npm install -g pm2
if errorlevel 1 (
    echo WARNING: PM2 installation failed
    echo You can still run with: npm start
) else (
    echo OK: PM2 installed
)

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Next steps:
echo   1. Edit .env file if needed
echo   2. Start server:
echo      - With PM2: pm2 start npm --name "social-uploader" -- start
echo      - Without PM2: npm start
echo   3. Access at: http://localhost:3000
echo.
pause
