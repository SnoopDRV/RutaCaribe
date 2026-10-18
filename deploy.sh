#!/usr/bin/env bash
# Deploy script for GitHub Pages (manual)
# Usage: ./deploy.sh

set -e

echo "Building for GitHub Pages..."

# No build step needed - static files only
echo "Deploying to gh-pages branch..."

git add -A
git commit -m "Deploy: $(date -u +'%Y-%m-%d %H:%M:%S UTC')" || true
git push origin main

echo "Deployment triggered. Check GitHub Actions for status."
echo "Site will be available at: https://<username>.github.io/RutaCaribe/"