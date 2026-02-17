#!/bin/bash

# Webflow Cloud Deployment Setup Script
# This script helps you set up automatic deployment to Webflow Cloud

set -e

echo "🚀 Webflow Cloud Deployment Setup"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Webflow CLI is installed
echo "📦 Checking prerequisites..."
if ! command -v webflow &> /dev/null; then
    echo -e "${YELLOW}⚠️  Webflow CLI not found${NC}"
    echo "Installing Webflow CLI..."
    npm install -g @webflow/webflow-cli
    echo -e "${GREEN}✅ Webflow CLI installed${NC}"
else
    echo -e "${GREEN}✅ Webflow CLI found${NC}"
fi

echo ""
echo "🔐 Getting Webflow API Token"
echo "----------------------------"
echo ""

# Check if user is logged in to Webflow
if webflow auth whoami &> /dev/null; then
    echo -e "${GREEN}✅ You're logged in to Webflow${NC}"
    echo ""
    echo "To get your API token, run:"
    echo -e "${BLUE}webflow auth token${NC}"
    echo ""

    read -p "Would you like to see your token now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo -e "${YELLOW}Your Webflow API Token:${NC}"
        webflow auth token
        echo ""
        echo -e "${YELLOW}⚠️  Keep this token secure! It grants full access to your Webflow account.${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  You're not logged in to Webflow${NC}"
    echo ""
    echo "Please log in first:"
    echo -e "${BLUE}webflow auth login${NC}"
    echo ""
    read -p "Press Enter to login now, or Ctrl+C to cancel..."
    webflow auth login
    echo ""
    echo -e "${GREEN}✅ Successfully logged in${NC}"
    echo ""
    echo "To get your API token, run:"
    echo -e "${BLUE}webflow auth token${NC}"
fi

echo ""
echo "📝 Next Steps"
echo "-------------"
echo ""
echo "1. Copy your Webflow API token (shown above or run: webflow auth token)"
echo ""
echo "2. Add it to GitHub Secrets:"
echo "   • Go to: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/settings/secrets/actions"
echo "   • Click 'New repository secret'"
echo "   • Name: WEBFLOW_API_TOKEN"
echo "   • Value: Paste your token"
echo "   • Click 'Add secret'"
echo ""
echo "3. Verify the setup:"
echo "   • Push a commit to main branch"
echo "   • Check the Actions tab for deployment status"
echo "   • URL: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/actions"
echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "For detailed instructions, see: DEPLOYMENT.md"
echo "For a checklist, see: .github/DEPLOYMENT-CHECKLIST.md"
echo ""
