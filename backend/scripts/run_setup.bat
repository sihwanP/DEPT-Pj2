@echo off
cd /d c:\dev\department-b\backend
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 exit /b %errorlevel%

echo Building project...
call npm run build
if %errorlevel% neq 0 exit /b %errorlevel%

echo Initializing database...
call npx ts-node scripts/init_db.ts
if %errorlevel% neq 0 exit /b %errorlevel%

echo Verifying setup...
call npx ts-node scripts/verify_db.ts
if %errorlevel% neq 0 exit /b %errorlevel%

echo Setup complete.
