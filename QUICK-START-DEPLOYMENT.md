# Quick Start: Automatic Deployment

Get your Webflow Pricing Calculator deployed automatically in 5 minutes.

## 🚀 5-Minute Setup

### Step 1: Get Your Webflow API Token (2 min)

Run this command:
```bash
./scripts/setup-deployment.sh
```

Or manually:
```bash
webflow auth login
webflow auth token
```

Copy the token that appears.

### Step 2: Add GitHub Secret (1 min)

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `WEBFLOW_API_TOKEN`
5. Value: Paste your token
6. Click **Add secret**

### Step 3: Push and Deploy (2 min)

Commit and push the deployment configuration:

```bash
git add .github/workflows/deploy.yml DEPLOYMENT.md README.md
git commit -m "Add automatic deployment to Webflow Cloud

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
git push origin main
```

### Step 4: Watch Deployment

1. Go to your repository's **Actions** tab
2. Watch the "Deploy to Webflow Cloud" workflow run
3. Wait for the green checkmark ✅

**That's it!** Your site is now deployed automatically on every push to `main`.

---

## 🔄 How It Works

```
Push to main → GitHub Actions → Build → Deploy to Webflow Cloud → Live! 🎉
```

Every time you push to the `main` branch:
1. GitHub Actions automatically runs
2. Installs dependencies and builds your app
3. Deploys to Webflow Cloud
4. Your site is live in 3-5 minutes

---

## 🧪 Test Your Setup

Make a small change to test:

```bash
# Edit README
echo "\n## Deployed with Webflow Cloud ✅" >> README.md

# Commit and push
git add README.md
git commit -m "Test automatic deployment"
git push origin main
```

Then watch it deploy in the Actions tab!

---

## 📋 Deployment Checklist

- [x] GitHub Actions workflow created (`.github/workflows/deploy.yml`)
- [x] Deployment documentation added (`DEPLOYMENT.md`)
- [ ] **YOU DO THIS:** Add `WEBFLOW_API_TOKEN` to GitHub Secrets
- [ ] **YOU DO THIS:** Push changes to `main` branch
- [ ] **YOU DO THIS:** Watch first deployment succeed

---

## 🐛 Troubleshooting

### "Invalid API token" error?
→ Regenerate your token and update the GitHub Secret

### Build fails?
→ Run `npm run build` locally first to check for errors

### Deployment doesn't start?
→ Check the Actions tab permissions: Settings → Actions → General → Workflow permissions

---

## 📚 Full Documentation

- **Detailed guide:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Setup checklist:** [.github/DEPLOYMENT-CHECKLIST.md](.github/DEPLOYMENT-CHECKLIST.md)
- **Main README:** [README.md](README.md)

---

**Ready?** Run `./scripts/setup-deployment.sh` to begin! 🚀
