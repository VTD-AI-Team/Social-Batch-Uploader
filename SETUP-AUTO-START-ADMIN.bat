@echo off
echo ========================================
echo  AUTO-START SETUP
echo ========================================
echo.
echo This script will create a Windows Task to auto-start the server.
echo You need to run this as ADMINISTRATOR.
echo.
echo Right-click this file and select "Run as administrator"
echo.
pause

REM Check for admin rights
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Please run as Administrator!
    echo Right-click this file and select "Run as administrator"
    pause
    exit /b 1
)

echo Running with Administrator privileges...
echo.

REM Run PowerShell script
powershell -ExecutionPolicy Bypass -File "%~dp0SETUP-AUTO-START.ps1"

echo.
echo ========================================
echo Setup complete!
echo ========================================
pause
