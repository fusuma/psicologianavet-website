# PDF Personalization Integration - Executive Summary

**Status**: 📋 **Documented & Ready for Implementation**
**Estimated Implementation Time**: 4-6 hours
**Business Impact**: High-value offering for veterinarian audience

---

## What This Feature Does

Veterinarians who subscribe receive a **personalized PDF** via email with their **clinic name printed** on the support material. This creates immediate value and differentiation from generic content.

**User Journey**:
1. Vet visits `/veterinarios` page
2. Fills form: Email + Clinic Name (2 fields)
3. Submits form
4. Receives email within seconds with personalized PDF attached
5. PDF has clinic name printed on page 7 (ready to share with clients)

---

## Key Architectural Decisions

### ✅ Collect Clinic Name Upfront (Not After Signup)

**Why**:
- Instant personalization (no follow-up steps)
- Simpler architecture (single API call)
- Higher perceived value ("Wow, already has my name!")

**Trade-off**:
- Slightly higher form friction (~10% conversion impact)
- Justified by 10x increase in deliverable value

### ✅ Ephemeral PDF Storage (Not Persistent)

**Why**:
- Zero storage costs
- GDPR-friendly (no PII on servers)
- Stateless serverless architecture

**How It Works**:
- Generate PDF in-memory (300-500ms)
- Attach to email via Brevo
- Discard buffer after send
- PDF lives in vet's email inbox

### ✅ Immediate Transactional Email (Not Two-Step)

**Why**:
- Best user experience (instant gratification)
- Leverages existing serverless stack
- No state management needed

**Performance**:
- 2-4s total response time (acceptable with async UX)

---

## Implementation Breakdown

### 1. Required Data Collection (Frontend)

**Current State**: Vet form collects only `email`

**New State**: Vet form collects:
- `email` (existing)
- `clinicName` ✨ **NEW - Required field**

**Form Changes**:
```tsx
// Add to vets signup form
<Input name="clinicName" required placeholder="Ex: Clínica Veterinária São Francisco" />
```

**UX Enhancements**:
- Tooltip explaining personalization
- Preview image showing personalized PDF
- Character counter (2-100 chars)
- Auto-capitalize each word

### 2. Schema Updates (Shared)

**File**: `src/shared/schemas.ts`

**Changes**:
- Add `clinicName` field to schema
- Validate: 2-100 chars, alphanumeric + Portuguese chars
- Make required via `.refine()` for `listName === 'vets'`

### 3. Service Layer (Backend)

**File**: `src/services/subscriptionService.ts`

**Changes**:
- Branch logic: tutors vs vets
- For vets: Generate PDF → Send email with attachment
- Store clinic name as Brevo contact attribute
- Graceful degradation if PDF generation fails

**Dependencies**:
- `pdf-lib` (PDF manipulation)
- `@pdf-lib/fontkit` (custom font support)
- `@getbrevo/brevo` TransactionalEmailsApi (email sending)

### 4. Brevo Configuration (External Service)

**Required Setup**:
1. Create transactional email template
2. Add contact attributes: `CLINIC_NAME`, `PDF_SENT`
3. Get template ID → Add to env vars

**Template ID**: Store as `BREVO_VET_WELCOME_TEMPLATE_ID`

---

## Technical Specifications

### PDF Generation

**Library**: `pdf-lib` + `@pdf-lib/fontkit`

**Process**:
1. Load template PDF from `public/assets/apoio-momentos-dificeis.pdf`
2. Load font: `public/fonts/FiraSans-Bold.ttf`
3. Get page 7 (last page)
4. Draw white rectangle over original text
5. Draw clinic name centered (40px bold)
6. Return Buffer

**Performance**:
- Cold start: ~2000ms (first invocation)
- Warm: ~300-500ms (font cached)

**Memory**: 512MB Vercel function (increased from default 256MB)

### Email Delivery

**Via**: Brevo TransactionalEmailsApi

**Attachment**:
- PDF as base64 string
- Filename: `material-apoio-{sanitized-clinic-name}.pdf`
- Max size: 2MB (Brevo limit)

**Template Variables**:
- `{{params.CLINIC_NAME}}` - Clinic name
- `{{contact.EMAIL}}` - Recipient email
- `{{params.DOWNLOAD_LINK}}` - Fallback link (if needed)

---

## File Inventory

### New Files Created

| File | Purpose | Lines |
|------|---------|-------|
| `docs/architecture/15-pdf-personalization-integration.md` | Main architecture document | ~450 |
| `docs/architecture/pdf-integration-diagrams.md` | Visual diagrams (Mermaid) | ~300 |
| `docs/pdf-integration-quickstart.md` | Implementation guide | ~400 |
| `docs/ux-vet-signup-form.md` | UX/UI guidance | ~350 |

**Total Documentation**: ~1,500 lines of comprehensive guidance

### Existing Files to Modify

| File | Changes Required |
|------|------------------|
| `src/shared/schemas.ts` | Add `clinicName` field with validation |
| `src/services/subscriptionService.ts` | Add PDF generation + email sending logic |
| `src/components/composite/SignupForm.tsx` | Add clinic name input field (vets only) |
| `.env.example` | Add `BREVO_VET_WELCOME_TEMPLATE_ID` |
| `package.json` | Add `pdf-lib` and `@pdf-lib/fontkit` dependencies |

---

## Environment Variables

### New Variables Required

```bash
# Add to .env.local and Vercel
BREVO_VET_WELCOME_TEMPLATE_ID=123  # From Brevo dashboard
JWT_SECRET=your-secret-here         # For download links (fallback)
NEXT_PUBLIC_BASE_URL=https://quandoumamorsevai.com.br
```

### Existing Variables (No Changes)

```bash
BREVO_API_KEY=xxx
BREVO_TUTORS_LIST_ID=xxx
BREVO_VETS_LIST_ID=xxx
```

---

## Cost Analysis

### Current Costs (Email Only)

| Service | Usage | Cost |
|---------|-------|------|
| Vercel Functions | ~500ms per request | $0 (free tier) |
| Brevo Emails | 300/day limit | $0 (free tier) |
| **Total** | | **$0/month** |

### New Costs (With PDF)

| Service | Usage (1000 vets/month) | Cost |
|---------|------------------------|------|
| Vercel Functions | ~3s @ 512MB per request | $0.00 (within free tier) |
| Brevo Transactional Emails | 1000 emails | $0.00 (within 300/day) |
| PDF Generation Compute | ~300-500ms warm | $0.00 (within free tier) |
| Storage | $0 (ephemeral, no storage) | $0.00 |
| **Total** | | **$0.00/month** |

**At Scale** (10,000 vets/month):
- Vercel: ~$5-10/month
- Brevo: Upgrade to Lite plan ($25/month for 20k emails)
- **Total**: ~$30-35/month

---

## Risk Assessment

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| PDF generation timeout | Low | High | Increase function timeout to 10s |
| Font file missing | Low | High | Include in deployment, add error handling |
| Brevo rate limits | Medium | Medium | Queue system for high volume |
| Attachment too large | Low | Low | Compress template PDF if needed |

### Business Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Lower conversion (extra field) | High | Medium | A/B test, strong value proposition |
| Vets don't see value | Low | High | Preview image, social proof |
| Email deliverability issues | Low | Medium | SPF/DKIM records, monitor bounces |

---

## Success Metrics

### Primary KPIs

1. **Conversion Rate**: Vet signup form conversion
   - Target: > 25%
   - Benchmark: Email-only forms typically 30-40%

2. **Email Delivery Rate**: % of emails successfully delivered
   - Target: > 95%
   - Monitor: Brevo dashboard

3. **PDF Generation Success Rate**: % of PDFs generated without errors
   - Target: > 99%
   - Monitor: Vercel logs

### Secondary Metrics

- Email open rate (indicates subject line effectiveness)
- PDF download/view rate (if tracking implemented)
- User feedback (qualitative)

---

## Implementation Timeline

### Phase 1: Core Implementation (4-6 hours)

- [ ] **Hour 1-2**: Brevo setup + schema updates
  - Create email template
  - Update `subscriptionPayloadSchema`
  - Add environment variables

- [ ] **Hour 3-4**: Service layer implementation
  - Extend `subscriptionService.ts`
  - Add email sending function
  - Error handling

- [ ] **Hour 5**: Frontend updates
  - Add clinic name field to vet form
  - Update success messages
  - Add preview image

- [ ] **Hour 6**: Testing & deployment
  - Unit tests
  - E2E tests
  - Deploy to preview
  - Test end-to-end
  - Deploy to production

### Phase 2: Optimization (Future)

- [ ] A/B test form variations
- [ ] Add download analytics
- [ ] Implement advanced personalization (logo, contact info)
- [ ] Add self-service re-download portal

---

## Quick Links

### Documentation

- 📖 [Full Architecture](./architecture/15-pdf-personalization-integration.md)
- 📊 [Visual Diagrams](./architecture/pdf-integration-diagrams.md)
- 🚀 [Quick Start Guide](./pdf-integration-quickstart.md)
- 🎨 [UX/UI Guide](./ux-vet-signup-form.md)

### External Resources

- [Brevo API Documentation](https://developers.brevo.com/)
- [pdf-lib Documentation](https://pdf-lib.js.org/)
- [Vercel Functions Documentation](https://vercel.com/docs/functions)

---

## Decision Summary

| Question | Decision | Rationale |
|----------|----------|-----------|
| **When to collect clinic name?** | Upfront | Instant personalization, simpler UX |
| **Where to store PDFs?** | Nowhere (ephemeral) | Zero cost, GDPR-friendly |
| **How to deliver?** | Email attachment | Best UX, leverages Brevo |
| **What if PDF fails?** | Graceful degradation | Send email with download link |
| **Performance target?** | < 5s response | Acceptable with loading UI |

---

## Next Steps

1. **Read Quick Start Guide**: [pdf-integration-quickstart.md](./pdf-integration-quickstart.md)
2. **Set up Brevo**: Create transactional email template
3. **Update Schema**: Add `clinicName` validation
4. **Implement Service**: PDF generation + email sending
5. **Update Frontend**: Add clinic name field
6. **Test**: Unit, integration, E2E
7. **Deploy**: Preview → Production

---

**Document Status**: ✅ **Ready for Implementation**
**Last Updated**: 2025-10-09
**Prepared by**: Winston (Architect)
