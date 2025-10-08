# Ebook Distribution Security Strategy

## Executive Summary

This document outlines strategies to prevent unauthorized ebook sharing by veterinary partners while maintaining a positive professional relationship. The approach focuses on **incentivizing proper distribution** rather than purely restrictive measures.

**Key Principle:** Make it more valuable for vets to recommend the ebook properly than to share it directly.

---

## Problem Statement

**Risk:** Veterinarians who receive the ebook (free or via purchase) may share it directly with their clients, bypassing the Hotmart sales workflow and:
- Reducing revenue potential
- Undermining the business model
- Creating unfair advantage for non-purchasing customers
- Making attribution/tracking impossible

**Goal:** Protect the revenue stream while maintaining positive vet partnerships and enabling legitimate recommendations.

---

## Recommended Solutions

### 🥇 1. Affiliate/Referral Program (Primary Strategy)

**Why This Works:**
- Positive incentive vs. restrictive punishment
- Aligns vet interests with business interests
- Creates sustainable partnership model
- Provides tracking and analytics

**Implementation:**

#### A. Hotmart Affiliate Setup
1. Enable Hotmart Co-Production/Affiliate program
2. Set commission rate: **25-30%** per sale
3. Create dedicated vet onboarding page

#### B. Vet Partner Portal Features
```markdown
- Unique affiliate link generation
- Real-time commission dashboard
- Monthly payout tracking
- Promotional material download (banners, email templates)
- Client recommendation tracker
```

#### C. Update `/vets` Page
Add prominent affiliate CTA section:

```typescript
<section className="affiliate-program">
  <h2>Programa de Parceiros Veterinários</h2>

  <div className="benefits">
    <h3>Por que usar nosso programa de afiliados?</h3>
    <ul>
      <li>✅ Ganhe 30% de comissão por venda</li>
      <li>✅ Link personalizado com rastreamento</li>
      <li>✅ Dashboard com relatórios em tempo real</li>
      <li>✅ Material promocional profissional</li>
      <li>✅ Suporte dedicado para parceiros</li>
    </ul>
  </div>

  <div className="value-prop">
    <p><strong>Exemplo:</strong> Recomende o ebook para 10 clientes/mês = R$ XXX em comissão passiva</p>
  </div>

  <button>Tornar-se Parceiro Afiliado</button>
</section>
```

#### D. Promotional Materials for Affiliates
Provide ready-to-use assets:
- Email templates for client communication
- Social media graphics
- Printable flyers for clinic reception
- QR code cards with affiliate link

**Timeline:** 2-3 weeks to implement
**Cost:** Commission structure (variable)
**Maintenance:** Low (Hotmart handles payments)

---

### 🥈 2. Personalized PDF Watermarking (Secondary Strategy)

**Purpose:** Discourage sharing through traceability

**Implementation:**

#### A. Dynamic Watermarking System
Every PDF generated includes:
- Purchaser name
- Purchase email
- Transaction ID
- Purchase date
- Semi-transparent on every page

#### B. Technical Stack
```javascript
// Using pdf-lib for server-side watermarking
import { PDFDocument, rgb } from 'pdf-lib';

async function watermarkPDF(originalPDF, purchaseData) {
  const pdfDoc = await PDFDocument.load(originalPDF);
  const pages = pdfDoc.getPages();

  const watermarkText = `Comprado por: ${purchaseData.name} | ${purchaseData.email} | ${purchaseData.date}`;

  pages.forEach(page => {
    const { width, height } = page.getSize();
    page.drawText(watermarkText, {
      x: 50,
      y: 30,
      size: 8,
      color: rgb(0.5, 0.5, 0.5),
      opacity: 0.3,
    });
  });

  return await pdfDoc.save();
}
```

#### C. Integration Points
1. **Hotmart Webhook** → Capture purchase event
2. **API Endpoint** → Generate personalized PDF
3. **Storage** → Save to S3/Cloudinary
4. **Delivery** → Send unique download link

#### D. Legal Notice in PDF
First page includes:
```
LICENÇA INDIVIDUAL
Este exemplar foi licenciado para [NOME] ([EMAIL]).
A redistribuição não autorizada viola direitos autorais (Lei 9.610/98)
e está sujeita a medidas legais.

Para recomendar este ebook aos seus clientes, use nosso programa
de afiliados e ganhe comissão: [link]
```

**Timeline:** 1-2 weeks
**Cost:** Minimal (storage + processing)
**Maintenance:** Low (automated)

---

### 🥉 3. Tiered Access Model

**Create clear product differentiation:**

#### Product Tiers

| Tier | Audience | Access | Price |
|------|----------|--------|-------|
| **Preview** | Vets (free) | First 2 chapters + promotional kit | R$ 0 |
| **Individual** | Pet owners | Full ebook (personal use) | R$ XX |
| **Clinic License** | Vet clinics | Share with up to 50 clients/year | R$ XXX |
| **Enterprise** | Vet networks | Unlimited sharing + customization | R$ XXXX |

#### Benefits
- Monetizes vet distribution legally
- Provides legitimate sharing option
- Creates upsell opportunities
- Maintains control over distribution

**Implementation:** Update pricing page + Hotmart product variants

---

### 4. Time-Limited Download Links

**Prevent indefinite redistribution:**

#### Technical Implementation
```typescript
// API Route: /api/download/[purchaseId]
import { SignJWT } from 'jose';

export async function generateSecureDownloadLink(purchaseId: string) {
  const expiresAt = Date.now() + (48 * 60 * 60 * 1000); // 48 hours

  const token = await new SignJWT({ purchaseId, expiresAt })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('48h')
    .sign(secret);

  return `https://psicologianavet.com/download/${token}`;
}

// Download restrictions
const downloadLimits = {
  maxDownloads: 3,
  validityHours: 48,
};
```

#### User Experience
1. Purchase confirmed → Email with download link
2. Link valid for 48 hours
3. Max 3 downloads per purchase
4. After expiry → Request new link (verified)

**Pros:** Strong technical protection
**Cons:** Can frustrate legitimate users

---

### 5. Legal & Educational Messaging

**Clear communication on expectations:**

#### A. Terms of Use (Visible on Purchase)
```markdown
TERMOS DE USO - EBOOK "QUANDO UM AMOR SE VAI"

1. LICENÇA INDIVIDUAL
   Este ebook é licenciado para uso pessoal e intransferível.

2. PROIBIÇÕES
   - Compartilhar arquivos com terceiros
   - Revender ou redistribuir conteúdo
   - Publicar em sites/redes sociais

3. PROGRAMA DE AFILIADOS
   Veterinários podem recomendar legalmente através do
   programa de afiliados e ganhar comissão.

4. CONSEQUÊNCIAS
   Violação dos termos pode resultar em:
   - Revogação de acesso
   - Medidas legais (Lei 9.610/98)
```

#### B. Vet Education Section
Add to `/vets` page:

```typescript
<div className="professional-guidelines">
  <h3>⚖️ Recomendação Profissional e Ética</h3>

  <div className="do-dont">
    <div className="do">
      <h4>✅ Faça:</h4>
      <ul>
        <li>Use seu link de afiliado para recomendar</li>
        <li>Compartilhe o preview gratuito</li>
        <li>Distribua material promocional</li>
        <li>Considere licença para clínica</li>
      </ul>
    </div>

    <div className="dont">
      <h4>❌ Não faça:</h4>
      <ul>
        <li>Compartilhar seu PDF pessoal</li>
        <li>Fazer cópias do ebook</li>
        <li>Distribuir sem autorização</li>
      </ul>
    </div>
  </div>

  <p className="legal-note">
    <strong>Importante:</strong> O compartilhamento não autorizado
    viola direitos autorais e prejudica a autora, impedindo a
    criação de novos conteúdos de qualidade.
  </p>
</div>
```

---

## Monitoring & Enforcement

### Detection Strategies

#### 1. Analytics Tracking
Monitor for suspicious patterns:
```typescript
// Red flags to track
const suspiciousPatterns = {
  // Same IP downloading multiple different purchases
  multipleDownloadsPerIP: true,

  // Unusual geographic distribution
  // (e.g., all purchases from one vet clinic city)
  geographicClustering: true,

  // Rapid successive purchases from same affiliate
  affiliateVelocity: true,

  // Same device fingerprint across purchases
  deviceFingerprinting: true,
};
```

#### 2. Watermark Tracking System
If watermarked PDF found publicly:
1. Extract watermark data
2. Identify original purchaser
3. Automated email notification
4. Revoke access if confirmed violation

#### 3. Community Reporting
Add "Report Piracy" button:
```markdown
Encontrou este ebook compartilhado ilegalmente?
Reporte: piracy@psicologianavet.com
(Sua identidade será protegida)
```

### Enforcement Ladder

**Level 1: Education (First Offense)**
- Friendly email explaining terms
- Offer affiliate program as alternative
- No penalty

**Level 2: Warning (Second Offense)**
- Formal warning letter
- Affiliate privileges suspended
- Access revoked

**Level 3: Legal (Repeated Violations)**
- Cease & desist letter
- Legal action under Lei 9.610/98
- Public statement (if necessary)

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Set up Hotmart affiliate program
- [ ] Design affiliate dashboard mockups
- [ ] Draft legal terms and conditions
- [ ] Create watermark template design

### Phase 2: Development (Week 3-4)
- [ ] Build PDF watermarking system
- [ ] Implement secure download links
- [ ] Create affiliate onboarding flow
- [ ] Develop monitoring dashboard

### Phase 3: Content (Week 5)
- [ ] Write vet education content
- [ ] Design promotional materials
- [ ] Create email templates
- [ ] Produce preview chapters (free tier)

### Phase 4: Launch (Week 6)
- [ ] Update `/vets` page with affiliate program
- [ ] Send announcement to existing vet contacts
- [ ] Monitor initial performance
- [ ] Gather feedback and iterate

### Phase 5: Optimization (Ongoing)
- [ ] Analyze affiliate performance
- [ ] Refine commission structure
- [ ] Improve conversion rates
- [ ] Scale successful strategies

---

## Success Metrics

### Key Performance Indicators (KPIs)

#### Business Metrics
- **Affiliate Signup Rate:** Target 30% of vets who download preview
- **Affiliate Conversion:** Target 5% conversion from vet recommendations
- **Revenue Attribution:** Track % of sales from affiliate channel
- **Clinic License Adoption:** Target 10 clinic licenses in first 6 months

#### Security Metrics
- **Piracy Incidents:** Track reported/detected unauthorized sharing
- **Watermark Effectiveness:** Monitor if watermarks deter sharing
- **Link Abuse:** Track download link sharing/reuse attempts
- **Compliance Rate:** % of vets using proper channels

#### Engagement Metrics
- **Affiliate Activity:** Monthly active affiliates
- **Commission Earnings:** Average earnings per vet affiliate
- **Material Downloads:** Promotional material usage
- **Support Tickets:** Vet-related questions/issues

---

## Budget Estimate

### One-Time Costs
| Item | Cost | Notes |
|------|------|-------|
| PDF Watermarking Dev | R$ 2.000 | 2 weeks dev time |
| Secure Links System | R$ 1.500 | Token generation + validation |
| Affiliate Dashboard | R$ 3.000 | Frontend + backend |
| Legal Review | R$ 800 | Terms validation |
| Promotional Materials | R$ 1.200 | Design + copywriting |
| **Total** | **R$ 8.500** | |

### Recurring Costs
| Item | Monthly Cost | Notes |
|------|--------------|-------|
| Affiliate Commissions | Variable (30%) | Per sale |
| Cloud Storage | R$ 50 | PDF storage (S3) |
| Monitoring Tools | R$ 100 | Analytics + alerts |
| **Total** | **R$ 150 + commissions** | |

### ROI Calculation
```
Scenario: 100 vet affiliates, each refers 2 sales/month
- Sales: 200/month
- Price: R$ 47
- Revenue: R$ 9.400
- Commission (30%): R$ 2.820
- Net: R$ 6.580/month

Break-even: ~1.3 months
Annual net revenue: R$ 78.960
```

---

## Risks & Mitigations

### Risk Matrix

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Vets ignore affiliate program | High | Medium | Strong education + high commission |
| Technical bypass of watermarks | Medium | Low | Multiple security layers |
| Negative vet perception | High | Low | Clear value proposition + communication |
| Low affiliate conversion | Medium | Medium | Optimize promotional materials |
| Legal enforcement backlash | Low | Very Low | Education-first approach |

### Contingency Plans

**If Affiliate Adoption is Low (<20%):**
- Increase commission to 35-40%
- Add performance bonuses
- Create case studies of successful affiliates
- Simplify onboarding process

**If Piracy Persists:**
- Implement device-limited DRM
- Require online authentication to read
- Consider platform-based delivery (e.g., app-only)

**If Vet Relations Damaged:**
- Survey vets for feedback
- Adjust policies based on input
- Offer grandfather clause for early adopters

---

## Alternative Approaches (Long-Term)

### 1. Platform-Based Distribution
Instead of PDF downloads, create a web/app-based reading experience:
- No downloadable files
- Online-only access
- Screenshot protection
- Copy-paste disabled

**Pros:** Maximum control
**Cons:** Worse user experience, development cost

### 2. Blockchain/NFT Licensing
Issue NFT-based licenses for each purchase:
- Verifiable ownership
- Transferable (with fee)
- Smart contract enforcement

**Pros:** Innovative, traceable
**Cons:** Complex, niche audience unfamiliarity

### 3. Subscription Model
Convert from one-time purchase to subscription:
- Monthly access to ebook library
- Continuous content updates
- Recurring revenue

**Pros:** Recurring revenue, reduces piracy incentive
**Cons:** Business model shift, may reduce conversions

---

## Conclusion

### Recommended Strategy

**Primary Focus:** Affiliate/Referral Program
- Highest ROI
- Positive relationship building
- Sustainable long-term

**Secondary Layer:** Personalized Watermarking
- Low-cost deterrent
- Traceability for enforcement
- Minimal user friction

**Tertiary Support:** Clear Legal/Educational Messaging
- Sets expectations
- Provides alternatives
- Reduces accidental violations

### Success Factors

1. **Make compliance easy and profitable** - Affiliate program must be simple and lucrative
2. **Communicate value, not restrictions** - Focus on partnership benefits
3. **Monitor with empathy** - Assume good intent, educate before enforcing
4. **Iterate based on data** - Track metrics and adjust strategy

### Next Steps

1. **Immediate (This Week):**
   - Get stakeholder approval on strategy
   - Set up Hotmart affiliate program
   - Draft legal terms

2. **Short-term (This Month):**
   - Implement watermarking system
   - Update `/vets` page with affiliate CTA
   - Create promotional materials

3. **Long-term (Next Quarter):**
   - Launch clinic license tier
   - Build monitoring dashboard
   - Scale affiliate network

---

## Appendix

### A. Legal References
- **Lei 9.610/98** (Brazilian Copyright Law)
- **Marco Civil da Internet** (Data collection considerations)
- **LGPD Compliance** (Personal data in watermarks)

### B. Technical Specifications
- Watermarking: pdf-lib v1.17+
- Token Generation: jose (JWT)
- Storage: AWS S3 or Cloudinary
- Monitoring: Custom dashboard + Google Analytics

### C. Hotmart Integration
- Webhook endpoint: `/api/webhooks/hotmart`
- Events to capture: `PURCHASE_COMPLETE`, `REFUND_REQUESTED`
- Affiliate tracking: UTM parameters + Hotmart Tracker

### D. Contact Information
- **Implementation Questions:** dev@psicologianavet.com
- **Vet Partnership Inquiries:** parceiros@psicologianavet.com
- **Legal/Compliance:** legal@psicologianavet.com
- **Piracy Reports:** piracy@psicologianavet.com

---

**Document Version:** 1.0
**Last Updated:** 2025-10-08
**Next Review:** 2025-11-08
**Owner:** Product & Security Team
