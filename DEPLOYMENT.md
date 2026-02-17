# Deployment Guide

This guide explains how to deploy the Webflow Pricing Calculator to Webflow Cloud with automatic deployments via GitHub Actions.

## Prerequisites

- Webflow Cloud project created (Project ID: `e5d2b068-f190-482d-8e28-9d1e90a0aba3`)
- GitHub repository with push access
- Webflow API token with deployment permissions

## Automatic Deployment Setup

The repository is configured with GitHub Actions to automatically deploy to Webflow Cloud whenever code is pushed to the `main` branch.

### Step 1: Get Your Webflow API Token

1. Log in to your Webflow account
2. Go to **Account Settings** → **API Access**
3. Click **Generate API Token**
4. Give it a name like "GitHub Actions Deployment"
5. Copy the token (you'll only see it once)

Alternatively, use the Webflow CLI:
```bash
webflow auth login
webflow auth token
```

### Step 2: Add GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `WEBFLOW_API_TOKEN` | Your Webflow API token | Required for authentication |
| `NEXT_PUBLIC_APP_URL` | Your production URL | Optional, for build-time env vars |
| `AWS_PROFILE` | `bedrock` | Optional, if using AWS Bedrock in production |
| `AWS_REGION` | `us-east-1` | Optional, AWS region for Bedrock |

### Step 3: Configure AWS Environment Variables (Optional)

If you want to use AWS Bedrock for domain analysis in production:

1. Add AWS credentials as GitHub secrets:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

2. Update `.github/workflows/deploy.yml` to include AWS env vars in the build step

**Note:** The application includes a fallback pattern-based analysis, so AWS Bedrock is optional.

### Step 4: Trigger Deployment

Once configured, deployments happen automatically:

**Automatic Triggers:**
- Push to `main` branch → Automatic deployment
- Merge pull request → Automatic deployment

**Manual Trigger:**
1. Go to **Actions** tab in GitHub
2. Select "Deploy to Webflow Cloud" workflow
3. Click **Run workflow**
4. Select branch and click **Run workflow** button

## Deployment Workflow

The GitHub Actions workflow performs these steps:

1. **Checkout code** - Gets the latest code from the repository
2. **Setup Node.js** - Installs Node.js 18 with npm caching
3. **Install dependencies** - Runs `npm ci` for clean install
4. **Build application** - Runs `npm run build` to create production build
5. **Install Webflow CLI** - Installs the Webflow CLI globally
6. **Authenticate** - Logs in to Webflow using API token
7. **Deploy** - Deploys to Webflow Cloud production environment
8. **Summary** - Outputs deployment success message

## Manual Deployment

If you prefer to deploy manually:

```bash
# Ensure you're logged in to Webflow
webflow auth login

# Deploy to production
webflow cloud deploy --environment production

# Or deploy with auto-publish
webflow cloud deploy --environment production --auto-publish
```

## Environment Configuration

### Webflow Cloud Configuration (`webflow.json`)

```json
{
  "cloud": {
    "project_id": "e5d2b068-f190-482d-8e28-9d1e90a0aba3",
    "framework": "nextjs",
    "buildCommand": "npm run build",
    "outputDirectory": ".next"
  }
}
```

### Next.js Configuration

The application is built with:
- **Framework:** Next.js 14.2.15
- **Build output:** `.next` directory
- **Build command:** `npm run build`

### Environment Variables

Create a `.env.local` file for local development:

```env
# AWS Bedrock (optional, has fallback)
AWS_PROFILE=bedrock
AWS_REGION=us-east-1

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For production, set these in Webflow Cloud or GitHub Secrets.

## Monitoring Deployments

### View Deployment Status

1. Go to **Actions** tab in GitHub repository
2. Click on the latest workflow run
3. View logs for each step

### Deployment Success Criteria

✅ All checks passed:
- Dependencies installed
- TypeScript compilation successful
- Build completed without errors
- Webflow deployment successful

### Troubleshooting

**Build Fails:**
- Check TypeScript errors in the "Build application" step
- Verify all dependencies are in `package.json`
- Ensure environment variables are set correctly

**Deployment Fails:**
- Verify `WEBFLOW_API_TOKEN` is set in GitHub Secrets
- Check token has deployment permissions
- Ensure project ID is correct in `webflow.json`

**Authentication Fails:**
- Regenerate Webflow API token
- Update `WEBFLOW_API_TOKEN` secret in GitHub
- Verify token hasn't expired

## Deployment Environments

### Production
- **Branch:** `main`
- **URL:** Your Webflow Cloud production URL
- **Auto-deploy:** Yes (on push to main)

### Creating Additional Environments

To create a staging environment:

1. Update `.github/workflows/deploy.yml` to include a staging job
2. Deploy to different environment name:
```bash
webflow cloud deploy --environment staging
```

## Rollback

If you need to rollback a deployment:

1. Revert the commit in GitHub:
```bash
git revert <commit-hash>
git push origin main
```

2. Or redeploy a previous version:
```bash
git checkout <previous-commit>
webflow cloud deploy --environment production
```

## Performance Considerations

- **Build time:** ~2-3 minutes (depends on dependencies)
- **Deploy time:** ~1-2 minutes (Webflow Cloud upload)
- **Total deployment:** ~3-5 minutes from push to live

## Security

- ✅ API tokens stored as encrypted GitHub Secrets
- ✅ Tokens never exposed in logs
- ✅ Automated deployments require GitHub authentication
- ✅ Environment variables kept secure

## Next Steps

1. Set up the GitHub Secrets (see Step 2 above)
2. Push a commit to `main` to trigger first automatic deployment
3. Monitor the deployment in the Actions tab
4. Verify the live site once deployed

## Support

For issues with:
- **Webflow Cloud:** Contact Webflow Support
- **GitHub Actions:** Check the Actions tab logs
- **Application bugs:** Open an issue in this repository

---

**Last Updated:** February 17, 2026
**Webflow CLI Version:** 1.8.44
**Next.js Version:** 14.2.15
