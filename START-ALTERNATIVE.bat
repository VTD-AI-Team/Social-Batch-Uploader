@echo off
SETLOCAL EnableDelayedExpansion

echo ========================================
echo FACEBOOK/TIKTOK BATCH UPLOADER
echo Alternative Start (No PATH required)
echo ========================================
echo.

REM Try common Node.js installation paths
set "NODE_PATHS=C:\Program Files\nodejs\node.exe"
set "NODE_PATHS=%NODE_PATHS%;C:\Program Files (x86)\nodejs\node.exe"
set "NODE_PATHS=%NODE_PATHS%;%LOCALAPPDATA%\Programs\nodejs\node.exe"
set "NODE_PATHS=%NODE_PATHS%;%APPDATA%\npm\node.exe"

set "NODE_EXE="
for %%p in (%NODE_PATHS%) do (
    if exist "%%p" (
        set "NODE_EXE=%%p"
        goto :found
    )
)

:found
if "%NODE_EXE%"=="" (
    echo ERROR: Could not find Node.js installation
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Or make sure Node.js is in your PATH
    pause
    exit /b 1
)

echo Found Node.js at: %NODE_EXE%
echo.

REM Get npm path
for %%i in ("%NODE_EXE%") do set "NODE_DIR=%%~dpi"
set "NPM_CMD=%NODE_DIR%npm.cmd"

if not exist "%NPM_CMD%" (
    echo ERROR: npm.cmd not found at %NPM_CMD%
    pause
    exit /b 1
)

echo Found npm at: %NPM_CMD%
echo.

REM Change to script directory
cd /d "%~dp0"

echo [Step 1/5] Cleaning old files...
if exist ".next" rmdir /s /q .next
echo.

echo [Step 2/5] Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies (2-5 minutes)...
    call "%NPM_CMD%" install
    if %errorlevel% neq 0 (
        echo ERROR: npm install failed
        pause
        exit /b %errorlevel%
    )
) else (
    echo Dependencies already installed
)
echo.

echo [Step 3/5] Creating screenshots directory...
if not exist "public\screenshots" mkdir public\screenshots
echo.

echo [Step 4/5] Starting development server...
echo.
echo ========================================
echo SERVER STARTING...
echo ========================================
echo.
echo Application will be available at:
echo    http://localhost:3000
echo.
echo Browser will open in 3 seconds...
echo Press Ctrl+C to stop the server
echo ========================================
echo.

timeout /t 3 /nobreak >nul
start http://localhost:3000

echo Starting server...
call "%NPM_CMD%" run dev

ENDLOCAL
