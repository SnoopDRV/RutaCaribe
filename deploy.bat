@echo off
REM Deploy script for GitHub Pages (Windows)
REM Usage: deploy.bat

echo Building for GitHub Pages...

REM No build step needed - static files only
echo Deploying to main branch...

git add -A
git commit -m "Deploy: %DATE% %TIME%" || exit /b 0
git push origin main

echo Deployment triggered. Check GitHub Actions for status.
echo Site will be available at: https://<username>.github.io/RutaCaribe/