@echo off
echo Starting EcoFashion AI Development Server...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if we're in the right directory
if not exist "index.html" (
    echo Error: index.html not found. Make sure you're in the project directory.
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo Failed to install dependencies. Trying alternative method...
        echo Installing live-server globally...
        npm install -g live-server
    )
)

REM Start the development server
echo Starting server on http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

REM Try npm start first, fallback to global live-server
npm start
if %errorlevel% neq 0 (
    echo Trying alternative startup method...
    live-server --port=3000 --open=/index.html
    if %errorlevel% neq 0 (
        echo.
        echo Could not start the development server.
        echo Please install live-server manually: npm install -g live-server
        echo Then run: live-server --port=3000
        pause
    )
)