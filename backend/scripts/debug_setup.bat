@echo off
cd /d c:\dev\department-b\backend
echo Starting debug script > debug_output.txt

echo Running npm install... >> debug_output.txt
call npm install >> debug_output.txt 2>&1
if %errorlevel% neq 0 (
    echo npm install failed >> debug_output.txt
    exit /b %errorlevel%
)

echo Running npm run build... >> debug_output.txt
call npm run build >> debug_output.txt 2>&1
if %errorlevel% neq 0 (
    echo npm build failed >> debug_output.txt
    exit /b %errorlevel%
)

echo Running init_db... >> debug_output.txt
call npx ts-node scripts/init_db.ts >> debug_output.txt 2>&1
if %errorlevel% neq 0 (
    echo init_db failed >> debug_output.txt
    // Don't exit, try verify
)

echo Running verify_db... >> debug_output.txt
call npx ts-node scripts/verify_db.ts >> debug_output.txt 2>&1

echo Debug script finished. >> debug_output.txt
