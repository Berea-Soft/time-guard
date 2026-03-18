@echo off
cd /d "d:\Users\johna\Desktop\Dev Frameworks\@bereasoftware\v2\time-guard"
echo Installing esbuild...
call npm install --save-dev esbuild
echo Running build...
call npm run build
pause
