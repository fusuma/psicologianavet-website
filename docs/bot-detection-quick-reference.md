# Bot Detection Quick Reference

**One-page cheat sheet for monitoring and adjusting bot detection.**

---

## 🚀 Quick Start

### 1. Set Admin Token (Required)

```bash
# Generate secure token
openssl rand -base64 32

# Add to .env.local
echo "ADMIN_API_TOKEN=<your-generated-token>" >> .env.local
```

### 2. View Bot Statistics

```bash
# View stats in terminal
curl -H "X-Admin-Token: YOUR_TOKEN" \
  http://localhost:3000/api/v1/bot-detection/stats | jq

# Export as CSV
curl -H "X-Admin-Token: YOUR_TOKEN" \
  "http://localhost:3000/api/v1/bot-detection/stats?export=csv" > bot-logs.csv

# View configuration
curl -H "X-Admin-Token: YOUR_TOKEN" \
  "http://localhost:3000/api/v1/bot-detection/stats?config=true" | jq
```

### 3. Monitor Server Logs

```bash
# In production, check logs for bot attempts
npm run dev | grep "BOT DETECTED"

# Or filter by reason
npm run dev | grep "TOO_FAST"
```

---

## ⚙️ Common Adjustments

### Problem: Legitimate Users Blocked

**Symptoms**: `botPercentage` is low but you're getting complaints

**Solution**: Loosen thresholds in `.env.local`

```bash
# Make it easier to pass
BOT_MIN_FORM_TIME_MS=1500       # Reduce from 2000ms
BOT_MIN_INTERACTIONS=1          # Reduce from 2
BOT_REQUIRE_MOUSE=false         # For mobile users
```

**Restart server**: `npm run dev` or `npm run start`

---

### Problem: Bots Getting Through

**Symptoms**: `botPercentage` is increasing, spam in Brevo lists

**Solution**: Tighten thresholds

```bash
# Make it harder to pass
BOT_MIN_FORM_TIME_MS=3000       # Increase from 2000ms
BOT_MIN_INTERACTIONS=3          # Increase from 2
BOT_REQUIRE_FOCUS=true          # Must focus on email field
BOT_REQUIRE_MOUSE=true          # Must move mouse
```

---

### Problem: Too Many "TOO_FAST" Detections

**Symptoms**: `reasonBreakdown.TOO_FAST` is highest count

**Solution**: Adjust minimum time

```bash
# If mostly bots: Keep or increase
BOT_MIN_FORM_TIME_MS=3000

# If legitimate users: Decrease
BOT_MIN_FORM_TIME_MS=1500
```

Check distribution:
```bash
curl -H "X-Admin-Token: YOUR_TOKEN" \
  http://localhost:3000/api/v1/bot-detection/stats | \
  jq '.stats.reasonBreakdown'
```

---

### Problem: Mobile Users Failing

**Symptoms**: High "NO_MOUSE_MOVEMENT" count

**Solution**: Disable mouse requirement

```bash
BOT_REQUIRE_MOUSE=false
```

---

## 📊 Interpreting Statistics

### Good Stats (Healthy System)

```json
{
  "botAttempts": 12,
  "legitimateSubmissions": 288,
  "botPercentage": 4.0,  // < 5% is excellent
  "reasonBreakdown": {
    "HONEYPOT_FILLED": 8,     // Classic bots
    "TOO_FAST": 4              // Speed bots
  }
}
```

### Warning Signs

```json
{
  "botPercentage": 25.0,  // > 10% needs attention
  "reasonBreakdown": {
    "NO_MOUSE_MOVEMENT": 50  // Possible false positives (mobile users?)
  }
}
```

**Action**: Review `recentAttempts` to see if legitimate users are being blocked.

---

## 🎛️ Configuration Reference

| Variable | Default | Description | When to Change |
|----------|---------|-------------|----------------|
| `BOT_MIN_FORM_TIME_MS` | 2000 | Min time (ms) | Users blocked for being "too fast" |
| `BOT_MAX_FORM_TIME_MS` | 3600000 | Max time (ms) | Session timeout issues |
| `BOT_MIN_INTERACTIONS` | 2 | Min interactions | False positives from copy-paste users |
| `BOT_REQUIRE_FOCUS` | true | Require focus | Never (keep enabled) |
| `BOT_REQUIRE_MOUSE` | true | Require mouse | Mobile-heavy traffic |
| `BOT_HONEYPOT_ENABLED` | true | Enable honeypot | Never (keep enabled) |
| `BOT_LOG_LEVEL` | warn | Log verbosity | Debugging (use `info`) |

---

## 📈 Monitoring Workflow

### Daily (First Week)

```bash
# Quick stats check
curl -H "X-Admin-Token: YOUR_TOKEN" \
  http://localhost:3000/api/v1/bot-detection/stats | \
  jq '{botPercentage: .stats.botPercentage, total: .stats.total}'
```

### Weekly (Ongoing)

```bash
# Export and analyze
curl -H "X-Admin-Token: YOUR_TOKEN" \
  "http://localhost:3000/api/v1/bot-detection/stats?export=csv" > \
  "weekly-report-$(date +%Y%m%d).csv"

# Open in Excel/Google Sheets for analysis
```

### Monthly (Review)

1. Check bot percentage trend
2. Review reason breakdown
3. Adjust thresholds if needed
4. Clear old logs: `DELETE /api/v1/bot-detection/stats`

---

## 🔧 Troubleshooting

### "Unauthorized" Error

**Problem**: `401 Unauthorized` when accessing stats endpoint

**Solution**:
```bash
# Verify token is set
grep ADMIN_API_TOKEN .env.local

# Use correct header name
curl -H "X-Admin-Token: YOUR_ACTUAL_TOKEN" ...
```

---

### No Logs Appearing

**Problem**: No `[BOT DETECTED]` logs in console

**Solution**:
```bash
# Enable logging
BOT_LOGGING_ENABLED=true
BOT_LOG_LEVEL=warn  # or 'info' for more verbose

# Restart server
npm run dev
```

---

### Stats Always Return Empty

**Problem**: `"total": 0` in stats response

**Solution**: Logs are in-memory and cleared on server restart. Submit test forms to populate data.

```bash
# Test submission (use staging environment)
curl -X POST http://localhost:3000/api/v1/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "listName": "tutors",
    "website": "",
    "phone": "",
    "company": "",
    "formLoadTime": 1696800000000,
    "formSubmitTime": 1696800003000,
    "interactionCount": 5,
    "hasFocusEvents": true,
    "hasMouseMovement": true
  }'
```

---

## 🎯 Optimization Goals

| Metric | Target | Action |
|--------|--------|--------|
| Bot Percentage | < 5% | System is working well |
| False Positive Rate | < 1% | Loosen thresholds if higher |
| Honeypot Detection | > 50% of bots | Keep honeypot enabled |
| Legitimate Submissions | Steady growth | Monitor for sudden drops |

---

## 📞 Getting Help

**Check these in order:**

1. **Console logs**: Look for `[BOT DETECTED]` patterns
2. **Stats endpoint**: Review `reasonBreakdown`
3. **Recent attempts**: Check last 50 in stats response
4. **Documentation**: See `docs/bot-detection-monitoring.md`
5. **Configuration**: Review `.env.local` values

---

## 🔗 Quick Links

- **Full Documentation**: `docs/bot-detection-monitoring.md`
- **CAPTCHA Design**: `docs/captcha-fallback-architecture.md`
- **Configuration File**: `src/config/botDetection.ts`
- **Logger Utility**: `src/utils/botDetectionLogger.ts`

---

**Last Updated**: 2025-10-08
**Version**: 1.0.0
