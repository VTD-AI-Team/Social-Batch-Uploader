@echo off
echo ========================================
echo Cai dat lai dependencies
echo ========================================
echo.

echo Xoa node_modules va cache...
if exist "node_modules" rmdir /s /q node_modules
if exist ".next" rmdir /s /q .next
if exist "package-lock.json" del /f /q package-lock.json

echo.
echo Cai dat dependencies moi...
call npm install

if %errorlevel% neq 0 (
    echo.
    echo Loi khi cai dat!
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================
echo Hoan thanh! Ban co the chay run.bat
echo ========================================
pause
