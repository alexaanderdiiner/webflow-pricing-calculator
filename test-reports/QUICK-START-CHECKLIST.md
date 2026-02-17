# Quick Start Testing Checklist

## Immediate Actions Required

### 1. Restart Claude Code ⚠️ REQUIRED
```bash
# Exit current Claude Code session
exit

# Restart Claude Code CLI
claude-code
```

**Why:** The Puppeteer MCP server configuration has been created but requires a restart to load.

**Verify MCP Loaded:**
After restart, ask Claude Code:
```
What Puppeteer tools are available?
```

Expected tools: `puppeteer_launch`, `puppeteer_navigate`, `puppeteer_click`, etc.

---

### 2. Ensure Dev Server is Running

**Check if running:**
```bash
lsof -i :3000 | grep LISTEN
```

**If not running, start it:**
```bash
cd /Users/alexanderdiner/Projects/webflow-pricing-calculator
npm run dev
```

**Verify it's working:**
```bash
curl http://localhost:3000
# Should return HTTP 200
```

---

### 3. Run Automated Tests

**Option A: Full Test Suite (Recommended)**
After restarting Claude Code with Puppeteer MCP, say:
```
Run all automated browser tests from test-reports/AUTOMATED-TESTING-GUIDE.md,
starting with Test 1 (Homepage) through Test 9 (Complete User Journey).
Save all screenshots to test-reports/screenshots/.
Generate a summary report when complete.
```

**Option B: Quick Smoke Test**
```
Run a quick smoke test:
1. Navigate to http://localhost:3000
2. Check homepage loads
3. Test domain analysis with "shopify.com"
4. Verify results page displays
5. Take screenshots of each step
```

**Option C: Specific Feature Test**
Pick any test from `AUTOMATED-TESTING-GUIDE.md` and paste the prompt.

---

### 4. Review Test Results

**Locations:**
- Main report: `test-reports/e2e-test-report-2026-02-16.md`
- Screenshots: `test-reports/screenshots/` (after browser tests)
- Server logs: Check for errors in terminal running `npm run dev`

**What to look for:**
- ✅ All screenshots captured successfully
- ✅ No JavaScript console errors (except expected AWS Bedrock message)
- ✅ Pricing calculations are accurate
- ✅ UI elements render correctly
- ❌ Any unexpected errors or broken functionality

---

## Optional But Recommended

### 5. Fix AWS Bedrock Permissions

**Current Issue:**
```
AccessDeniedException: Model access is denied due to IAM user or service role
is not authorized to perform the required AWS Marketplace actions
```

**To Fix:**
1. Contact AWS administrator
2. Request permissions added to IAM role:
   - `aws-marketplace:ViewSubscriptions`
   - `aws-marketplace:Subscribe`
3. Or subscribe to Claude Sonnet 3.5 in AWS Marketplace
4. Test after fix:
   ```bash
   curl -X POST http://localhost:3000/api/analyze-domain \
     -H "Content-Type: application/json" \
     -d '{"domain": "shopify.com", "email": "test@example.com"}'
   ```

**Impact if not fixed:**
- Falls back to pattern-based analysis (lower accuracy)
- Confidence scores will be ~70% instead of 90-95%
- Less intelligent recommendations

---

### 6. Update Browserslist

**Quick fix for outdated browser data:**
```bash
cd /Users/alexanderdiner/Projects/webflow-pricing-calculator
npx update-browserslist-db@latest
```

**Impact:** Ensures optimal browser compatibility for latest versions.

---

## Test Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Server Running | ✅ YES | Port 3000, Next.js 14.2.15 |
| API Endpoints | ✅ WORKING | Validation, fallback working |
| Page Rendering | ✅ WORKING | All pages compile successfully |
| AWS Auth | ✅ AUTHENTICATED | SSO logged in |
| AWS Bedrock | ⚠️ DEGRADED | Access denied, fallback working |
| Airtable | ℹ️ MOCK DATA | Using fallback config (expected) |
| Puppeteer MCP | ⚠️ CONFIGURED | Requires restart to activate |
| Browser Tests | ⏳ PENDING | Waiting for MCP restart |

---

## Quick Command Reference

### Start Dev Server
```bash
npm run dev
```

### Test API Manually
```bash
# Domain analysis
curl -X POST http://localhost:3000/api/analyze-domain \
  -H "Content-Type: application/json" \
  -d '{"domain": "shopify.com", "email": "test@example.com"}' | jq

# Pricing config
curl http://localhost:3000/api/pricing | jq
```

### Check Server Status
```bash
# Is server running?
lsof -i :3000

# Check server logs
tail -f /private/tmp/claude-502/-Users-alexanderdiner-Projects-webflow-pricing-calculator/tasks/*.output
```

### View Test Reports
```bash
# Main test report
cat test-reports/e2e-test-report-2026-02-16.md

# Automation guide
cat test-reports/AUTOMATED-TESTING-GUIDE.md

# View screenshots
ls -la test-reports/screenshots/
```

### AWS Status
```bash
# Check authentication
aws sts get-caller-identity --profile bedrock

# Re-login if needed
aws sso login --profile bedrock
```

---

## Testing Priorities

### Priority 1: Critical Path 🔴
1. Homepage loads
2. Domain analysis works (fallback OK)
3. Results page displays pricing
4. Price calculations are accurate

### Priority 2: User Experience 🟡
5. Wizard flow (4 steps) works smoothly
6. Plan customization updates prices correctly
7. Workspace configuration works
8. Grand total calculation is accurate

### Priority 3: Edge Cases 🟢
9. Form validation works
10. Error messages display correctly
11. Mobile responsive design
12. Accessibility compliance

---

## Success Criteria

**Application is production-ready when:**
- ✅ All automated tests pass
- ✅ Pricing calculations verified manually
- ✅ No critical console errors
- ✅ Mobile/tablet/desktop layouts work
- ✅ Error handling works gracefully
- ✅ Performance metrics meet targets (< 2s page load)

**Nice to have:**
- ✅ AWS Bedrock permissions fixed
- ✅ Airtable integration configured
- ✅ Automated tests in CI/CD
- ✅ Error tracking (Sentry) configured

---

## Getting Help

**If tests fail:**
1. Check server is running: `lsof -i :3000`
2. Check server logs for errors
3. Verify AWS authentication: `aws sts get-caller-identity --profile bedrock`
4. Check console in browser DevTools (F12)
5. Review error screenshots in `test-reports/screenshots/`

**If Puppeteer MCP not loading:**
1. Verify configuration: `cat ~/.config/claude-code/mcp.json`
2. Restart Claude Code completely
3. Check npx is available: `which npx`
4. Manually test: `npx -y puppeteer-mcp-server --help`

**If prices seem wrong:**
1. Check pricing config: `curl http://localhost:3000/api/pricing | jq`
2. Review pricing logic: `cat lib/pricing.ts`
3. Test calculation manually in browser console
4. Compare with expected values in test report

---

## Documents Created

1. **e2e-test-report-2026-02-16.md** - Comprehensive test results and findings
2. **AUTOMATED-TESTING-GUIDE.md** - Copy/paste prompts for Puppeteer testing
3. **QUICK-START-CHECKLIST.md** - This document (quick reference)

**All saved in:** `/Users/alexanderdiner/Projects/webflow-pricing-calculator/test-reports/`

---

## Next Steps Timeline

**Now (5 minutes):**
1. Restart Claude Code
2. Verify Puppeteer MCP loaded
3. Run smoke test (Test 1 from guide)

**Soon (30 minutes):**
4. Run full automated test suite
5. Review screenshots
6. Document any issues found

**Later (1-2 hours):**
7. Fix any critical bugs found
8. Re-run tests to verify fixes
9. Update AWS Bedrock permissions (if needed)

**Future (ongoing):**
10. Add unit tests (Jest)
11. Add tests to CI/CD pipeline
12. Set up error tracking
13. Configure Airtable (if needed)

---

**Status:** Ready for testing after Claude Code restart
**Last Updated:** February 16, 2026
**Next Action:** Restart Claude Code → Run Tests
