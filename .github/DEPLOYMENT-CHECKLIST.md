# Deployment Setup Checklist

Use this checklist to ensure automatic deployment is properly configured.

## ☑️ Pre-Deployment Checklist

### 1. Webflow API Token
- [ ] Logged in to Webflow account
- [ ] Generated API token from Account Settings → API Access
- [ ] Copied token to clipboard (you only see it once!)
- [ ] Token has deployment permissions

### 2. GitHub Secrets Configuration
- [ ] Navigated to repository Settings → Secrets and variables → Actions
- [ ] Added `WEBFLOW_API_TOKEN` secret
- [ ] Added `NEXT_PUBLIC_APP_URL` secret (optional)
- [ ] Added AWS credentials if using Bedrock (optional)

### 3. Repository Configuration
- [ ] GitHub Actions workflow file exists at `.github/workflows/deploy.yml`
- [ ] `webflow.json` contains correct project ID
- [ ] All tests pass locally (`npm run build`)
- [ ] No TypeScript errors

### 4. Verify Local Build
Run these commands to ensure everything builds correctly:

```bash
# Install dependencies
npm ci

# Build the application
npm run build

# Run tests (if any)
npm test
```

Expected result: ✅ Build succeeds with no errors

### 5. Test Deployment Workflow
- [ ] Push a small change to a feature branch
- [ ] Create pull request
- [ ] Verify Actions tab shows workflow
- [ ] Merge to main
- [ ] Watch deployment in Actions tab

## 🔐 Getting Your Webflow API Token

### Method 1: Webflow Dashboard
1. Go to https://webflow.com/dashboard
2. Click your profile → Account Settings
3. Navigate to **API Access** or **Integrations**
4. Click **Generate API Token** or **Create Token**
5. Name it "GitHub Actions Deployment"
6. Copy the token (shown only once)

### Method 2: Webflow CLI
```bash
# Login to Webflow
webflow auth login

# Get your API token
webflow auth token
```

## 📝 Adding GitHub Secrets

1. **Navigate to your repository on GitHub**
   - URL format: `https://github.com/YOUR_USERNAME/webflow-pricing-calculator`

2. **Go to Settings**
   - Click **Settings** tab (requires admin access)

3. **Navigate to Secrets**
   - Left sidebar → **Secrets and variables** → **Actions**

4. **Add New Secret**
   - Click **New repository secret**
   - Name: `WEBFLOW_API_TOKEN`
   - Value: Paste your Webflow API token
   - Click **Add secret**

5. **Add Optional Secrets** (if needed)

   For AWS Bedrock domain analysis:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION` (e.g., `us-east-1`)

   For production environment:
   - `NEXT_PUBLIC_APP_URL` (e.g., `https://your-site.webflow.io`)

## ✅ Verification Steps

### After First Deployment

1. **Check GitHub Actions**
   - [ ] Go to **Actions** tab
   - [ ] Latest workflow shows green checkmark ✅
   - [ ] All steps completed successfully
   - [ ] No error messages in logs

2. **Verify Webflow Cloud**
   - [ ] Log in to Webflow dashboard
   - [ ] Check Cloud project is updated
   - [ ] Verify deployment timestamp matches
   - [ ] Test the live site URL

3. **Test Functionality**
   - [ ] Visit deployed site
   - [ ] Test wizard flow
   - [ ] Test domain analysis
   - [ ] Check pricing calculator
   - [ ] Verify responsive design on mobile
   - [ ] Check browser console for errors

## 🐛 Troubleshooting

### Deployment Fails at "Deploy to Webflow Cloud"

**Problem:** Authentication error
```
Error: Invalid API token
```

**Solution:**
1. Verify `WEBFLOW_API_TOKEN` is set in GitHub Secrets
2. Check token hasn't expired
3. Regenerate token in Webflow dashboard
4. Update GitHub Secret with new token

---

**Problem:** Project ID mismatch
```
Error: Project not found
```

**Solution:**
1. Check `webflow.json` has correct `project_id`
2. Verify project exists in Webflow Cloud
3. Ensure API token has access to this project

---

### Build Fails

**Problem:** TypeScript errors
```
Type error: Property 'X' does not exist
```

**Solution:**
1. Run `npm run build` locally first
2. Fix all TypeScript errors
3. Commit and push fixes

---

**Problem:** Missing dependencies
```
Error: Cannot find module 'X'
```

**Solution:**
1. Ensure all dependencies in `package.json`
2. Run `npm install` and commit `package-lock.json`
3. Clear npm cache if needed: `npm ci`

---

### Secrets Not Working

**Problem:** Environment variable undefined
```
Warning: WEBFLOW_API_TOKEN is not set
```

**Solution:**
1. Double-check secret name matches exactly (case-sensitive)
2. Verify secret was added to repository (not organization)
3. Re-add the secret if needed
4. Check workflow file references correct secret name

## 📊 Monitoring

### View Deployment Logs

```bash
# In GitHub Actions tab, click on a workflow run to see:
```

- ✅ Build output
- ✅ Test results (if any)
- ✅ Deployment status
- ✅ Error messages (if failed)

### Deployment Success Indicators

When deployment succeeds, you'll see:

```
✅ Successfully deployed to Webflow Cloud!
Project ID: e5d2b068-f190-482d-8e28-9d1e90a0aba3
Environment: production
```

### Deployment Timeline

Typical deployment takes **3-5 minutes**:
- ⏱️ Checkout & setup: 30 seconds
- ⏱️ Install dependencies: 1-2 minutes
- ⏱️ Build application: 1-2 minutes
- ⏱️ Deploy to Webflow: 30 seconds - 1 minute

## 🎯 Next Steps After Setup

- [ ] Create a staging environment (optional)
- [ ] Set up deployment notifications (Slack/Discord)
- [ ] Configure branch protection rules
- [ ] Add deployment status badge to README
- [ ] Document rollback procedure for team

## 📞 Support

If you encounter issues:

1. **Check the logs** in GitHub Actions first
2. **Review this checklist** for missed steps
3. **Read DEPLOYMENT.md** for detailed instructions
4. **Contact Webflow Support** for API/Cloud issues
5. **Open GitHub Issue** for application bugs

---

**Last Updated:** February 17, 2026
**Status:** Ready for automatic deployment ✅
