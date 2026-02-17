#!/bin/bash

# Manual Deployment Script for Webflow Cloud
# Run this script to deploy your app right now

set -e

echo "🚀 Deploying to Webflow Cloud"
echo "=============================="
echo ""

# Check if build directory exists
if [ ! -d ".next" ]; then
    echo "📦 Building application first..."
    npm run build
    echo ""
fi

echo "✅ Build ready"
echo ""
echo "🌐 Starting Webflow Cloud deployment..."
echo ""
echo "You'll be prompted to select an environment."
echo "Select: main (/pricing-calculator)"
echo ""
echo "Press Enter to continue..."
read

# Deploy to Webflow Cloud
webflow cloud deploy

echo ""
echo "✅ Deployment complete!"
echo ""
