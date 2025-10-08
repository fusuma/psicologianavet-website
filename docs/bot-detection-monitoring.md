# Bot Detection Monitoring & Configuration

Comprehensive guide for monitoring bot attempts and adjusting detection thresholds.

---

## 📊 Monitoring Bot Detection

### View Real-Time Statistics

Access bot detection stats via the monitoring API:

```bash
# Get current statistics (requires authentication)
curl -H "X-Admin-Token: YOUR_ADMIN_TOKEN" \
  http://localhost:3000/api/v1/bot-detection/stats

# Include current configuration
curl -H "X-Admin-Token: YOUR_ADMIN_TOKEN" \
  "http://localhost:3000/api/v1/bot-detection/stats?config=true"

# Export logs as CSV
curl -H "X-Admin-Token: YOUR_ADMIN_TOKEN" \
  "http://localhost:3000/api/v1/bot-detection/stats?export=csv" \
  > bot-logs.csv
```

### Response Format

```json
{
  "stats": {
    "total": 150,
    "botAttempts": 45,
    "legitimateSubmissions": 105,
    "botPercentage": 30.0,
    "reasonBreakdown": {
      "HONEYPOT_FILLED": 12,
      "TOO_FAST": 28,
      "NO_MOUSE_MOVEMENT": 5
    },
    "recentAttempts": [
      {
        "isBot": true,
        "reason": "TOO_FAST",
        "details": { "timeTaken": 450, "threshold": 2000 },
        "timestamp": 1696800000000
      }
    ]
  },
  "timestamp": "2025-10-08T12:00:00.000Z"
}
```

---

## 🔧 Adjusting Detection Thresholds

### Environment Variables

Configure thresholds via `.env.local`:

```bash
# Temporal Validation (milliseconds)
BOT_MIN_FORM_TIME_MS=2000        # Minimum time: 2 seconds (default)
BOT_MAX_FORM_TIME_MS=3600000     # Maximum time: 1 hour (default)

# Behavioral Validation
BOT_MIN_INTERACTIONS=2           # Minimum interactions (default: 2)
BOT_REQUIRE_FOCUS=true           # Require focus events (default: true)
BOT_REQUIRE_MOUSE=true           # Require mouse movement (default: true)

# Honeypot Validation
BOT_HONEYPOT_ENABLED=true        # Enable honeypot (default: true)

# Logging Configuration
BOT_LOGGING_ENABLED=true         # Enable logging (default: true)
BOT_LOG_LEVEL=warn               # Log level: info|warn|error (default: warn)

# CAPTCHA Fallback (future feature)
BOT_CAPTCHA_ENABLED=false        # Enable CAPTCHA fallback (default: false)
BOT_CAPTCHA_THRESHOLD=3          # Failed attempts before CAPTCHA (default: 3)

# Admin API Access
ADMIN_API_TOKEN=your-secret-token-here  # Required for stats endpoint
```

### Common Adjustments

#### 1. **Too Many Legitimate Users Blocked**

If real users are getting blocked, **loosen** the thresholds:

```bash
# Reduce minimum time (allow faster typers)
BOT_MIN_FORM_TIME_MS=1500        # 1.5 seconds instead of 2

# Reduce interaction requirement
BOT_MIN_INTERACTIONS=1           # Allow fewer interactions

# Disable mouse movement check (for mobile users)
BOT_REQUIRE_MOUSE=false
```

#### 2. **Bots Still Getting Through**

If bots are bypassing detection, **tighten** the thresholds:

```bash
# Increase minimum time
BOT_MIN_FORM_TIME_MS=3000        # 3 seconds minimum

# Increase interaction requirement
BOT_MIN_INTERACTIONS=3           # Require more interactions

# Enable all checks
BOT_REQUIRE_FOCUS=true
BOT_REQUIRE_MOUSE=true
```

#### 3. **Mobile User Optimization**

Mobile users may not trigger mouse movement:

```bash
# Disable mouse movement check
BOT_REQUIRE_MOUSE=false

# Keep other checks strict
BOT_MIN_FORM_TIME_MS=2000
BOT_REQUIRE_FOCUS=true
```

---

## 📈 Analysis & Optimization

### Step 1: Monitor for 7 Days

Let the system collect data for a week:

```bash
# Check stats daily
curl -H "X-Admin-Token: YOUR_TOKEN" \
  http://localhost:3000/api/v1/bot-detection/stats
```

### Step 2: Analyze Patterns

Look for patterns in `reasonBreakdown`:

- **High `TOO_FAST` count**: Adjust `BOT_MIN_FORM_TIME_MS`
- **High `NO_MOUSE_MOVEMENT`**: Consider disabling `BOT_REQUIRE_MOUSE` for mobile
- **High `HONEYPOT_FILLED`**: Keep honeypot enabled (working as intended)

### Step 3: Export & Analyze Logs

```bash
# Export CSV for deeper analysis
curl -H "X-Admin-Token: YOUR_TOKEN" \
  "http://localhost:3000/api/v1/bot-detection/stats?export=csv" \
  > bot-logs.csv

# Import into Excel, Google Sheets, or data analysis tool
```

### Step 4: Adjust & Re-Monitor

After adjusting thresholds:

1. Restart the server to apply changes
2. Clear old logs: `DELETE /api/v1/bot-detection/stats`
3. Monitor for another 7 days
4. Compare bot percentages before/after

---

## 🚨 Alert Configuration

### Console Logs

Bot attempts are logged to console with structured data:

```
[BOT DETECTED] TOO_FAST {
  reason: 'TOO_FAST',
  details: { timeTaken: 342, threshold: 2000 },
  timestamp: '2025-10-08T12:00:00.000Z'
}
```

### Log Levels

- **`info`**: Logs all submissions (legitimate + bot)
- **`warn`**: Logs only bot attempts (recommended)
- **`error`**: Logs only critical bot attempts

Set via: `BOT_LOG_LEVEL=warn`

---

## 🔐 Security Best Practices

### 1. Protect the Monitoring Endpoint

**CRITICAL**: Set `ADMIN_API_TOKEN` in production:

```bash
# .env.local (never commit to git)
ADMIN_API_TOKEN=$(openssl rand -base64 32)
```

### 2. Restrict Access by IP (Optional)

In production, restrict monitoring endpoint to admin IPs:

```typescript
// src/middleware.ts
if (request.nextUrl.pathname.startsWith('/api/v1/bot-detection')) {
  const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
  const allowedIps = process.env.ADMIN_IPS?.split(',') || [];

  if (!allowedIps.includes(clientIp)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
```

### 3. Rate Limit the Monitoring Endpoint

Prevent abuse of the stats endpoint:

```typescript
// Use a rate limiting library like 'rate-limiter-flexible'
```

---

## 📊 Dashboard (Future Enhancement)

For a visual dashboard, consider building:

1. **Real-time Chart**: Bot attempts over time
2. **Reason Breakdown**: Pie chart of detection reasons
3. **Success Rate**: Gauge showing legitimate vs bot percentage
4. **Recent Attempts**: Table with filterable columns

**Tech Stack Suggestion**:
- Chart.js or Recharts for visualizations
- Next.js Server Components for real-time data
- TailwindCSS for styling

---

## 🧪 Testing Thresholds

### Simulate Bot Behavior

Test your thresholds using Cypress:

```typescript
// cypress/e2e/bot-detection-thresholds.cy.ts
it('should block submissions under min time', () => {
  cy.visit('/tutores');
  cy.contains('label', /e-mail/i).parent().find('input').type('test@example.com');

  // Submit immediately (< 2 seconds)
  cy.contains('button[type="submit"]', /baixar/i).click();

  // Should be blocked
  cy.contains(/algo deu errado/i).should('be.visible');
});
```

---

## 📞 Support

If you encounter issues:

1. Check console logs for `[BOT DETECTED]` warnings
2. Review `reasonBreakdown` in stats endpoint
3. Adjust thresholds incrementally (don't make drastic changes)
4. Monitor for at least 3-7 days after each adjustment

---

**Last Updated**: 2025-10-08
**Version**: 1.0.0
