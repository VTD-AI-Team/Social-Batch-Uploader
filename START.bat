@echo off
SETLOCAL EnableDelayedExpansion

echo ========================================
echo FACEBOOK/TIKTOK BATCH UPLOADER
echo Automated Setup for Investor Review
echo ========================================
echo.

REM Change to script directory
cd /d "%~dp0"

echo [Step 1/6] Checking Node.js installation...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found in PATH
    echo Please close this terminal and open a new one
    echo Then run this script again
    pause
    exit /b 1
)

node --version
echo Node.js found!
echo.

echo [Step 2/6] Cleaning old files...
if exist "node_modules" (
    echo Removing old node_modules...
    rmdir /s /q node_modules
)
if exist ".next" (
    echo Removing old .next cache...
    rmdir /s /q .next
)
if exist "package-lock.json" (
    echo Removing old package-lock.json...
    del /f /q package-lock.json
)
echo Clean complete!
echo.

echo [Step 3/6] Installing dependencies...
echo This may take 2-5 minutes depending on internet speed...
echo.
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ERROR: npm install failed
    echo Please check your internet connection
    pause
    exit /b %errorlevel%
)
echo.
echo Dependencies installed successfully!
echo.

echo [Step 4/6] Creating screenshots directory...
if not exist "public\screenshots" (
    mkdir public\screenshots
    echo Created public\screenshots\
) else (
    echo Directory already exists
)
echo.

echo [Step 5/6] Generating sample Excel template...
echo Template will be available at /api/template
echo.

echo [Step 6/6] Starting development server...
echo.
echo ========================================
echo SERVER STARTING...
echo ========================================
echo.
echo The application will be available at:
echo.
echo    http://localhost:3000
echo.
echo Browser will open automatically in 3 seconds...
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

REM Wait 3 seconds then open browser
timeout /t 3 /nobreak >nul
start http://localhost:3000

REM Start the dev server
call npm run dev

ENDLOCAL
