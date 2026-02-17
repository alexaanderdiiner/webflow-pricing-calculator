# Automated Testing Guide - Puppeteer MCP

This guide provides ready-to-use prompts for automated browser testing after restarting Claude Code with Puppeteer MCP configured.

## Prerequisites

1. ✅ MCP configuration created: `~/.config/claude-code/mcp.json`
2. ⚠️ **Restart Claude Code** to load Puppeteer MCP server
3. ✅ Dev server running: `npm run dev` on http://localhost:3000
4. ✅ AWS SSO authenticated (for optional Bedrock integration)

## Quick Start

After restarting Claude Code, verify Puppeteer tools are available by asking:

```
List all available Puppeteer tools
```

Expected tools:
- `puppeteer_launch`
- `puppeteer_navigate`
- `puppeteer_click`
- `puppeteer_type`
- `puppeteer_screenshot`
- `puppeteer_evaluate`
- `puppeteer_wait_for_selector`
- `puppeteer_close`

---

## Test Scenarios - Copy/Paste Ready

### Test 1: Homepage Verification

```
Launch a Puppeteer browser, navigate to http://localhost:3000,
wait for the page to load, take a screenshot, and verify:
1. The page title is "Webflow Pricing Calculator"
2. The Webflow header/logo is present
3. There are no console errors

Save the screenshot as test-reports/screenshots/01-homepage.png
```

### Test 2: Domain Analysis Flow

```
Using Puppeteer, test the complete domain analysis flow:
1. Navigate to http://localhost:3000/pricing-wizard/domain
2. Wait for the form to load
3. Type "shopify.com" into the URL/domain input field
4. Type "test@example.com" into the email input field
5. Click the "Analyze Website" button
6. Wait up to 30 seconds for the analysis to complete
7. Take a screenshot when results appear
8. Extract and display:
   - The detected industry
   - The confidence score
   - The traffic tier
   - Suggested add-ons
   - Whether it's on Webflow
9. Verify the "Get Custom Webflow Recommendation" button appears
10. Click it and verify navigation to results page

Save screenshots as:
- test-reports/screenshots/02a-domain-form.png
- test-reports/screenshots/02b-domain-results.png
```

### Test 3: Pricing Wizard (4-Step Flow)

```
Using Puppeteer, complete the full pricing wizard:
1. Navigate to http://localhost:3000/pricing-wizard/wizard
2. Wait for Step 1 to load
3. Verify "Step 1 of 4" is shown
4. Click on the "Marketing Website" card
5. Click "Next" button
6. Wait for Step 2 (Traffic) to load
7. Select a traffic tier option (e.g., medium)
8. Click "Next"
9. Wait for Step 3 (Content) to load
10. Select content options
11. Click "Next"
12. Wait for Step 4 (Features) to load
13. Select feature checkboxes
14. Click "Get Recommendations" or "Next"
15. Wait for results page to load
16. Take a screenshot of the final recommendations

Save screenshots for each step:
- test-reports/screenshots/03a-wizard-step1.png
- test-reports/screenshots/03b-wizard-step2.png
- test-reports/screenshots/03c-wizard-step3.png
- test-reports/screenshots/03d-wizard-step4.png
- test-reports/screenshots/03e-wizard-results.png
```

### Test 4: Plan Customization & Price Calculation

```
Using Puppeteer, test the pricing customization:
1. Navigate to http://localhost:3000/pricing-wizard/result
   (or continue from wizard test)
2. Wait for the results page to fully load
3. Locate the "Customize Plan" section and expand it if collapsed
4. Take initial screenshot
5. Change the base plan from CMS to Business
6. Wait for price to update
7. Take screenshot showing new price
8. Toggle billing cycle from Monthly to Annual
9. Wait for price recalculation
10. Take screenshot showing annual pricing
11. Enable the "Optimize" add-on
12. Verify $49/mo is added (or annual equivalent)
13. Enable "Analyze" add-on with 10,000 sessions
14. Verify correct price addition
15. Enable "Localization" with 2 locales
16. Verify correct price addition
17. Extract the final grand total
18. Take final screenshot

Manually calculate expected total:
- Business Plan (Annual): $468/year = $39/mo
- Optimize (Annual): $468/year = $39/mo
- Analyze (10k sessions): $29/mo
- Localization (2 locales): $18/mo
- Expected Monthly Equivalent: ~$125/mo

Verify the displayed total matches calculation.

Save screenshots as:
- test-reports/screenshots/04a-result-initial.png
- test-reports/screenshots/04b-plan-changed.png
- test-reports/screenshots/04c-annual-billing.png
- test-reports/screenshots/04d-addons-configured.png
- test-reports/screenshots/04e-final-total.png
```

### Test 5: Workspace Configuration

```
Using Puppeteer, test workspace pricing:
1. On the results page, scroll to the Workspace Pricing Card
2. Click "Customize" to expand workspace options
3. Take screenshot of default state
4. Change workspace type to "Team"
5. Verify base cost shows $19/mo
6. Set Full Seats to 3
7. Verify cost = $19 + (3 × $39) = $136/mo
8. Set Limited Seats to 2
9. Verify cost = $136 + (2 × $15) = $166/mo
10. Set Free Seats to 5
11. Verify cost stays at $166/mo (free seats are free)
12. Take screenshot showing seat breakdown
13. Change workspace type to "Freelancer"
14. Verify base cost changes to $24/mo
15. Take final screenshot

Extract and verify:
- Workspace base cost
- Full seats cost
- Limited seats cost
- Total workspace cost

Save screenshots as:
- test-reports/screenshots/05a-workspace-default.png
- test-reports/screenshots/05b-workspace-team-configured.png
- test-reports/screenshots/05c-workspace-freelancer.png
```

### Test 6: Complete Cost Breakdown Verification

```
Using Puppeteer, verify the grand total calculation:
1. On the results page with customizations applied
2. Locate the "Your Complete Pricing" card (green gradient)
3. Extract all three components:
   a. Workspace cost
   b. Hosting cost (plan + add-ons)
   c. Add-ons cost
4. Extract the Grand Total
5. Take screenshot
6. Verify in JavaScript console:
   - Add up all components
   - Compare with displayed total
   - Report any discrepancies

Example calculation:
Workspace: $166/mo (Team + 3 full + 2 limited)
Hosting: $39/mo (Business annual)
Add-ons: $86/mo (Optimize $39 + Analyze $29 + Localization $18)
Grand Total: $291/mo

Save screenshot as:
- test-reports/screenshots/06-grand-total.png

Report: Does the math check out? ✅ or ❌
```

### Test 7: Mobile Responsiveness

```
Using Puppeteer with device emulation, test responsive design:

1. Launch browser with mobile viewport (375×667 - iPhone SE)
2. Navigate to http://localhost:3000
3. Take screenshot of homepage on mobile
4. Navigate to /pricing-wizard/domain
5. Take screenshot
6. Verify form elements are usable on mobile
7. Navigate to /pricing-wizard/wizard
8. Take screenshot
9. Navigate to /pricing-wizard/result
10. Take screenshot

11. Resize viewport to tablet (768×1024 - iPad)
12. Repeat screenshots for all pages

13. Resize viewport to desktop (1920×1080)
14. Repeat screenshots for all pages

Save all screenshots as:
- test-reports/screenshots/07-mobile-{page}.png
- test-reports/screenshots/07-tablet-{page}.png
- test-reports/screenshots/07-desktop-{page}.png

Verify in each screenshot:
- No horizontal overflow
- Text is readable
- Buttons are adequately sized
- Navigation works
- No layout breaks
```

### Test 8: Error Handling

```
Using Puppeteer, test error scenarios:

Test 8a: Empty Domain Validation
1. Navigate to http://localhost:3000/pricing-wizard/domain
2. Leave domain field empty
3. Enter email: "test@example.com"
4. Click "Analyze Website"
5. Wait for validation error to appear
6. Take screenshot
7. Verify error message says "Domain is required"

Test 8b: Invalid Domain
1. Enter domain: "not-a-real-domain-xyz123.com"
2. Enter email: "test@example.com"
3. Click "Analyze Website"
4. Wait for analysis to complete
5. Take screenshot
6. Verify fallback analysis is shown (confidence ~70%)
7. Verify reasoning mentions "fallback"

Test 8c: Console Errors
1. Navigate through all pages: /, /pricing-wizard/domain, /wizard, /result
2. Monitor browser console for errors
3. Report any unexpected errors (AWS Bedrock error is expected)
4. Take screenshot if errors found

Save screenshots as:
- test-reports/screenshots/08a-validation-error.png
- test-reports/screenshots/08b-invalid-domain.png
- test-reports/screenshots/08c-console-errors.png
```

### Test 9: Complete User Journey

```
Using Puppeteer, simulate a complete user journey from start to finish:

1. Start at homepage http://localhost:3000
2. Click the primary CTA button (if present)
3. Navigate to domain analysis
4. Enter domain: "shopify.com"
5. Enter email: "test@example.com"
6. Click "Analyze Website"
7. Wait for results (up to 30 seconds)
8. Click "Get Custom Webflow Recommendation"
9. Wait for results page to load
10. Expand "Customize Plan" section
11. Change plan to "Business"
12. Switch to "Annual" billing
13. Enable "Optimize" add-on
14. Configure workspace: Team, 2 full seats, 1 limited seat
15. Take final screenshot showing complete configuration
16. Extract and report final grand total

Expected approximate total:
- Business Annual: ~$39/mo
- Optimize Annual: ~$39/mo
- Team workspace + 2 full + 1 limited: $19 + $78 + $15 = $112/mo
- Grand Total: ~$190/mo

Save screenshots throughout journey:
- test-reports/screenshots/09-journey-{step}.png

Final report: Document the complete user experience, any friction points,
and verify the final price calculation is accurate.
```

---

## Advanced Testing

### Performance Testing

```
Using Puppeteer, measure performance metrics:

1. Launch browser with performance tracking enabled
2. Navigate to http://localhost:3000
3. Measure:
   - Time to First Byte (TTFB)
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Time to Interactive (TTI)
   - Total page load time
4. Repeat for all major pages
5. Generate performance report

Target metrics:
- TTFB: < 600ms
- FCP: < 1.8s
- LCP: < 2.5s
- TTI: < 3.8s
- Total Load: < 5s
```

### Accessibility Testing

```
Using Puppeteer with axe-core, test accessibility:

1. Navigate to each page
2. Run axe accessibility audit
3. Report violations by severity:
   - Critical
   - Serious
   - Moderate
   - Minor
4. Generate accessibility report

Focus areas:
- ARIA labels present
- Color contrast ratios (WCAG AA)
- Keyboard navigation works
- Form labels properly associated
- Images have alt text
- Heading hierarchy correct
```

### Visual Regression Testing

```
After making changes, compare screenshots:

1. Take baseline screenshots of all pages (before changes)
2. Make code changes
3. Take new screenshots (after changes)
4. Use pixel-diff comparison to highlight differences
5. Report any unintended visual changes

Pages to compare:
- Homepage
- Domain analysis
- Wizard (all 4 steps)
- Results page (default and customized states)
```

---

## Debugging Tips

### View Browser in Headful Mode
If tests fail, run in headful mode to see what's happening:
```
Launch Puppeteer in headful mode (non-headless) so I can see the browser window
```

### Wait for Network Idle
For pages with heavy API calls:
```
Wait for network to be idle (no pending requests) before taking screenshots
```

### Extract Console Logs
To debug JavaScript errors:
```
Monitor and extract all console.log, console.error, and console.warn messages
from the browser during testing
```

### Take Screenshots on Failure
Always capture state when tests fail:
```
If any step fails, take a screenshot before closing the browser to help debug
```

---

## Test Report Generation

After all tests complete, generate summary:

```
Based on all Puppeteer tests run, generate a test summary report including:

1. Total tests run
2. Passed vs Failed count
3. Screenshots captured
4. Any bugs or issues found
5. Performance metrics
6. Accessibility issues
7. Overall assessment of application quality

Save to: test-reports/puppeteer-test-summary-[date].md
```

---

## Common Issues & Solutions

### Issue: Selectors Not Found
**Solution:** Use more flexible selectors
```javascript
// Instead of specific IDs/classes that might change:
await page.waitForSelector('button:has-text("Analyze Website")')
// Or:
await page.waitForSelector('[data-testid="analyze-button"]')
```

### Issue: Timeouts
**Solution:** Increase timeout for slow operations
```javascript
// Default timeout is 30s, increase for slow API calls:
await page.waitForSelector('.results', { timeout: 60000 })
```

### Issue: Elements Not Clickable
**Solution:** Scroll into view first
```javascript
await page.evaluate(() => {
  document.querySelector('.element').scrollIntoView()
})
await page.click('.element')
```

### Issue: Race Conditions
**Solution:** Wait for network idle
```javascript
await page.goto(url, { waitUntil: 'networkidle0' })
```

---

## Next Steps After Testing

1. ✅ Review all screenshots in `test-reports/screenshots/`
2. ✅ Read test summary report
3. ✅ Fix any bugs found during testing
4. ✅ Re-run tests to verify fixes
5. ✅ Add tests to CI/CD pipeline (GitHub Actions)
6. ✅ Schedule regular automated test runs

---

## Maintenance

### Update MCP Configuration
If you need to modify MCP settings:
```bash
# Edit configuration
nano ~/.config/claude-code/mcp.json

# Restart Claude Code to apply changes
```

### Update Puppeteer
Keep Puppeteer up to date:
```bash
# The -y flag in npx will always fetch latest version
npx -y puppeteer-mcp-server --version
```

### Clear Browser Cache
If tests behave inconsistently:
```
Launch Puppeteer with a fresh browser profile (incognito mode)
to avoid cached state affecting tests
```

---

**Document Version:** 1.0
**Created:** February 16, 2026
**Last Updated:** February 16, 2026
**Author:** Claude Code

**Status:** Ready to use after Claude Code restart
