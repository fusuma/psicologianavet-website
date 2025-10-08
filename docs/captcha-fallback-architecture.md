# CAPTCHA Fallback System Architecture

**Status**: Optional Future Enhancement
**Priority**: Low (current bot detection is highly effective)
**Implementation Estimate**: 4-6 hours

---

## 📋 Overview

A CAPTCHA fallback provides an additional security layer for edge cases where:
1. Sophisticated bots bypass behavioral detection
2. Legitimate users trigger false positives repeatedly
3. High-value forms need extra security

---

## 🎯 When to Implement

Consider implementing CAPTCHA fallback when:

- **Bot attempts exceed 10% of total submissions** (currently monitoring)
- **False positive rate > 1%** (legitimate users blocked)
- **High-value conversions** require extra security
- **Regulatory compliance** mandates CAPTCHA

---

## 🏗️ Architecture Design

### Option 1: Google reCAPTCHA v3 (Recommended)

**Why reCAPTCHA v3?**
- ✅ Invisible to users (no checkbox/puzzle)
- ✅ Returns risk score (0.0 = bot, 1.0 = human)
- ✅ No UX interruption for legitimate users
- ✅ Free tier: 1M assessments/month

**Integration Points:**

```typescript
// 1. Client-side: Add to SignupForm.tsx
useEffect(() => {
  const loadRecaptcha = () => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    document.body.appendChild(script);
  };
  loadRecaptcha();
}, []);

// 2. Execute on form submit
const onSubmit = async (data: SubscriptionPayload) => {
  // Get reCAPTCHA token
  const token = await window.grecaptcha.execute(
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    { action: 'subscribe' }
  );

  // Include token in submission
  await apiClient.subscribe({ ...data, recaptchaToken: token });
};
```

```typescript
// 3. Server-side: Verify in subscriptionService.ts
async function verifyRecaptcha(token: string): Promise<number> {
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
  });

  const data = await response.json();
  return data.score; // 0.0 - 1.0
}

// In subscribe() function:
if (config.captcha.enabled) {
  const score = await verifyRecaptcha(payload.recaptchaToken);

  if (score < 0.5) {
    logBotDetection(BotDetectionReason.RECAPTCHA_LOW_SCORE, { score });
    throw new ValidationError('Failed security check');
  }
}
```

---

### Option 2: Cloudflare Turnstile (Privacy-Focused)

**Why Turnstile?**
- ✅ Privacy-focused (no personal data tracking)
- ✅ GDPR compliant out of the box
- ✅ Free unlimited usage
- ✅ Faster than reCAPTCHA

**Integration:**

```typescript
// Client-side
import { Turnstile } from '@marsidev/react-turnstile';

<Turnstile
  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
  onSuccess={(token) => setCaptchaToken(token)}
/>
```

---

### Option 3: hCaptcha (Open Source Alternative)

**Why hCaptcha?**
- ✅ Pays websites (cryptocurrency rewards)
- ✅ Accessibility-focused
- ✅ EU/GDPR compliant

---

## 🔄 Adaptive CAPTCHA Flow

**Smart CAPTCHA triggering based on risk assessment:**

```typescript
interface RiskAssessment {
  honeypotScore: number;      // 0-100
  temporalScore: number;      // 0-100
  behavioralScore: number;    // 0-100
  overallRisk: 'low' | 'medium' | 'high';
}

function assessRisk(payload: SubscriptionPayload): RiskAssessment {
  let honeypotScore = 100;
  if (payload.website || payload.phone || payload.company) {
    honeypotScore = 0; // Definite bot
  }

  const timeTaken = payload.formSubmitTime - payload.formLoadTime;
  const temporalScore = Math.min(
    100,
    (timeTaken / config.temporal.minFormTimeMs) * 100
  );

  const behavioralScore = (
    (payload.hasFocusEvents ? 40 : 0) +
    (payload.hasMouseMovement ? 30 : 0) +
    (payload.interactionCount >= 2 ? 30 : 0)
  );

  const averageScore = (honeypotScore + temporalScore + behavioralScore) / 3;

  return {
    honeypotScore,
    temporalScore,
    behavioralScore,
    overallRisk: averageScore >= 70 ? 'low' : averageScore >= 40 ? 'medium' : 'high',
  };
}

// Adaptive response:
const risk = assessRisk(payload);

if (risk.overallRisk === 'high') {
  // Block immediately
  throw new ValidationError('Bot detected');
}

if (risk.overallRisk === 'medium' && config.captcha.enabled) {
  // Require CAPTCHA verification
  if (!payload.recaptchaToken) {
    throw new ValidationError('CAPTCHA required', { requiresCaptcha: true });
  }
  const score = await verifyRecaptcha(payload.recaptchaToken);
  if (score < 0.7) {
    throw new ValidationError('Failed CAPTCHA');
  }
}

// Low risk: Allow through
```

---

## 📊 Implementation Phases

### Phase 1: Preparation (1 hour)
- [ ] Choose CAPTCHA provider (reCAPTCHA v3 recommended)
- [ ] Register account and get API keys
- [ ] Add keys to `.env.local` and `.env.example`

### Phase 2: Schema Updates (30 minutes)
```typescript
// schemas.ts
export const subscriptionPayloadSchema = z.object({
  // ... existing fields
  recaptchaToken: z.string().optional(),
});
```

### Phase 3: Client Integration (1.5 hours)
- [ ] Install reCAPTCHA library: `npm install react-google-recaptcha-v3`
- [ ] Update `SignupForm.tsx` to load reCAPTCHA script
- [ ] Execute reCAPTCHA on form submit
- [ ] Include token in API request

### Phase 4: Server Verification (1.5 hours)
- [ ] Create `src/utils/recaptchaVerifier.ts`
- [ ] Add verification logic to `subscriptionService.ts`
- [ ] Implement adaptive risk assessment
- [ ] Update error handling for CAPTCHA failures

### Phase 5: Testing (1 hour)
- [ ] Test with valid CAPTCHA tokens
- [ ] Test with invalid/expired tokens
- [ ] Test adaptive triggering (low/medium/high risk)
- [ ] Update Cypress tests

### Phase 6: Monitoring (30 minutes)
- [ ] Add CAPTCHA stats to monitoring endpoint
- [ ] Log CAPTCHA scores for analysis
- [ ] Set up alerts for high failure rates

---

## 🧪 Testing Strategy

```typescript
// cypress/e2e/captcha-fallback.cy.ts
describe('CAPTCHA Fallback', () => {
  it('should not require CAPTCHA for low-risk submissions', () => {
    // Normal human-like behavior
    cy.visit('/tutores');
    cy.wait(3000); // Wait > min time
    cy.get('input[type="email"]').focus().type('human@example.com');
    cy.contains('button', /baixar/i).click();

    // Should succeed without CAPTCHA
    cy.contains(/obrigado/i).should('be.visible');
  });

  it('should require CAPTCHA for medium-risk submissions', () => {
    // Slightly suspicious behavior (fast but has interactions)
    cy.visit('/tutores');
    cy.wait(1500); // Just below min time
    cy.get('input[type="email"]').type('suspicious@example.com');
    cy.contains('button', /baixar/i).click();

    // Should prompt for CAPTCHA
    cy.get('.recaptcha-checkbox').should('be.visible');
  });

  it('should block high-risk submissions even with CAPTCHA', () => {
    // Definite bot behavior
    cy.visit('/tutores');
    cy.get('input[name="website"]').invoke('val', 'spam.com'); // Honeypot
    cy.get('input[type="email"]').type('bot@example.com');
    cy.contains('button', /baixar/i).click();

    // Should block regardless of CAPTCHA
    cy.contains(/algo deu errado/i).should('be.visible');
  });
});
```

---

## 💰 Cost Analysis

### reCAPTCHA v3
- **Free tier**: 1M assessments/month
- **Cost**: $0 (for most small-to-medium websites)
- **Overage**: $1/1K assessments (rarely needed)

### Cloudflare Turnstile
- **Free tier**: Unlimited
- **Cost**: $0

### hCaptcha
- **Free tier**: Unlimited
- **Bonus**: Earn crypto for each solve (~$0.0001 per solve)

---

## 🎛️ Configuration Example

```bash
# .env.local
BOT_CAPTCHA_ENABLED=true
BOT_CAPTCHA_THRESHOLD=0.5  # reCAPTCHA score threshold (0.0-1.0)

# reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lc...your-site-key
RECAPTCHA_SECRET_KEY=6Lc...your-secret-key

# Adaptive triggering
BOT_CAPTCHA_RISK_THRESHOLD=medium  # low|medium|high
```

---

## 📈 Success Metrics

After implementing CAPTCHA:

- **Bot detection rate should increase** (catching sophisticated bots)
- **False positive rate should decrease** (legitimate users get through)
- **User friction should remain minimal** (reCAPTCHA v3 is invisible)

Monitor via:
```bash
curl -H "X-Admin-Token: YOUR_TOKEN" \
  "http://localhost:3000/api/v1/bot-detection/stats?config=true"
```

---

## 🚦 Decision Matrix: Do You Need CAPTCHA?

| Scenario | Current Detection | CAPTCHA Needed? |
|----------|-------------------|-----------------|
| Bot rate < 5% | ✅ Working well | ❌ No |
| Bot rate 5-15% | ⚠️ Moderate | 🤔 Monitor closely |
| Bot rate > 15% | ❌ Needs improvement | ✅ Yes |
| False positives > 1% | ❌ Too strict | ✅ Use as fallback |
| High-value conversions | N/A | ✅ Yes (extra security) |

---

## 🎯 Recommendation

**Current Status**: Your multi-layer bot detection (honeypot + temporal + behavioral) is **highly effective** for most use cases.

**Next Steps**:
1. ✅ Monitor bot detection stats for 2-4 weeks
2. ⏳ If bot rate exceeds 10%, implement reCAPTCHA v3
3. ⏳ If false positives occur, use CAPTCHA as fallback (not primary)

**Don't implement CAPTCHA yet** unless monitoring reveals a need. Current system is sufficient.

---

**Last Updated**: 2025-10-08
**Status**: Design Complete - Awaiting Monitoring Data
