# PDF Personalization Integration - Quick Start Guide

This guide provides step-by-step instructions for implementing the PDF personalization and Brevo transactional email integration.

**Prerequisites**: Read [15-pdf-personalization-integration.md](./architecture/15-pdf-personalization-integration.md) for full architectural context.

---

## Table of Contents

1. [Environment Setup](#1-environment-setup)
2. [Brevo Configuration](#2-brevo-configuration)
3. [Schema Updates](#3-schema-updates)
4. [Service Implementation](#4-service-implementation)
5. [API Route Updates](#5-api-route-updates)
6. [Frontend Updates](#6-frontend-updates)
7. [Testing](#7-testing)
8. [Deployment](#8-deployment)

---

## 1. Environment Setup

### 1.1 Install Dependencies

```bash
npm install @getbrevo/brevo pdf-lib @pdf-lib/fontkit
```

**Verify versions**:
```json
// package.json
{
  "dependencies": {
    "@getbrevo/brevo": "^2.0.0",
    "pdf-lib": "^1.17.1",
    "@pdf-lib/fontkit": "^1.1.1"
  }
}
```

### 1.2 Update Environment Variables

Add to `.env.local`:

```bash
# Existing variables
BREVO_API_KEY=your-api-key
BREVO_TUTORS_LIST_ID=123
BREVO_VETS_LIST_ID=456

# New variables for PDF integration
BREVO_VET_WELCOME_TEMPLATE_ID=789  # Create in Brevo (step 2.1)
JWT_SECRET=your-32-byte-random-secret  # Generate: openssl rand -base64 32
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Update `.env.example` with the same variables (use placeholder values).

---

## 2. Brevo Configuration

### 2.1 Create Transactional Email Template

1. **Login to Brevo Dashboard** → Campaigns → Templates → Create New Template
2. **Template Name**: "Vet Welcome Email with PDF"
3. **Subject Line**: "Bem-vindo ao Quando um amor se vai, {{params.CLINIC_NAME}}!"

**Template HTML**:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Fira Sans', Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #269A9B; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px 20px; }
    h1 { margin: 0; font-size: 24px; }
    p { line-height: 1.6; color: #333; }
    .footer { background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Quando um amor se vai</h1>
    </div>
    <div class="content">
      <h2>Bem-vindo, {{params.CLINIC_NAME}}! 🐾</h2>

      <p>Obrigado por se juntar à nossa comunidade de veterinários dedicados.</p>

      <p><strong>Em anexo, você encontrará o material de apoio personalizado para a sua clínica.</strong></p>

      <p>Este material está pronto para ser compartilhado com tutores em momentos difíceis. Você pode imprimi-lo ou enviá-lo digitalmente.</p>

      <p>Caso não consiga visualizar o anexo, você pode baixar o material através deste link:
      <a href="{{params.DOWNLOAD_LINK}}">Baixar Material de Apoio</a></p>

      <p>Qualquer dúvida, estamos à disposição.</p>

      <p>Com carinho,<br>
      <strong>Equipe Quando um amor se vai</strong></p>
    </div>
    <div class="footer">
      <p>Este email foi enviado para {{contact.EMAIL}}</p>
    </div>
  </div>
</body>
</html>
```

4. **Save Template** and note the **Template ID** (e.g., `789`)
5. Add Template ID to `.env.local`: `BREVO_VET_WELCOME_TEMPLATE_ID=789`

### 2.2 Add Contact Attributes

1. **Brevo Dashboard** → Contacts → Settings → Contact Attributes
2. **Add New Attributes**:
   - `CLINIC_NAME` (Type: Text)
   - `PDF_SENT` (Type: Boolean)
   - `SUBSCRIBED_AT` (Type: Date)

---

## 3. Schema Updates

### 3.1 Update Subscription Payload Schema

Edit `src/shared/schemas.ts`:

```typescript
import { z } from 'zod';

export const subscriptionPayloadSchema = z.object({
  email: z.string().email({ message: "Email inválido." }),
  listName: z.enum(['tutors', 'vets']),

  // NEW: Clinic name - REQUIRED for vets, collected upfront
  clinicName: z.string()
    .min(2, { message: "Nome da clínica deve ter pelo menos 2 caracteres." })
    .max(100, { message: "Nome da clínica deve ter no máximo 100 caracteres." })
    .regex(/^[a-zA-ZÀ-ÿ0-9\s\-'\.]+$/, { message: "Nome da clínica contém caracteres inválidos." })
    .trim()
    .optional(), // Optional in schema, but enforced via refine for vets

  // Existing bot detection fields (honeypot)
  website: z.string().max(0).optional(),
  phone: z.string().max(0).optional(),
  company: z.string().max(0).optional(),

  // Bot detection timing fields
  formLoadTime: z.number().positive(),
  formSubmitTime: z.number().positive(),

  // Bot detection behavioral fields
  interactionCount: z.number().nonnegative(),
  hasFocusEvents: z.boolean(),
  hasMouseMovement: z.boolean(),
})
  .refine(
    (data) => {
      // CRITICAL: Clinic name is REQUIRED for vets to enable PDF personalization
      if (data.listName === 'vets') {
        return !!data.clinicName && data.clinicName.trim().length >= 2;
      }
      return true;
    },
    {
      message: "Nome da clínica é obrigatório para veterinários.",
      path: ['clinicName'],
    }
  );

export type SubscriptionPayload = z.infer<typeof subscriptionPayloadSchema>;
```

**Key Changes**:
- ✅ `clinicName` is **REQUIRED** for vets (enforced via `.refine()`)
- ✅ Validation: 2-100 characters, alphanumeric + Portuguese characters + spaces/hyphens
- ✅ Automatic trimming to prevent whitespace-only submissions
- ✅ Clear error messages in Portuguese

---

## 4. Service Implementation

### 4.1 Extend Subscription Service

Edit `src/services/subscriptionService.ts`:

**Add imports**:

```typescript
import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo';
import { personalizePDF } from './pdfPersonalization';
```

**Initialize Email API**:

```typescript
// Add after ContactsApi initialization
const emailApi = new TransactionalEmailsApi();
emailApi.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY as string
);
```

**Add email sending function**:

```typescript
/**
 * Send welcome email with personalized PDF attachment
 */
async function sendWelcomeEmailWithPDF(
  email: string,
  clinicName: string,
  pdfBuffer: Buffer
): Promise<void> {
  const emailPayload = new SendSmtpEmail();

  emailPayload.to = [{ email }];
  emailPayload.templateId = parseInt(
    process.env.BREVO_VET_WELCOME_TEMPLATE_ID as string,
    10
  );

  emailPayload.params = {
    CLINIC_NAME: clinicName,
    DOWNLOAD_LINK: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/pdf/download`, // Fallback
  };

  // Sanitize filename
  const safeFileName = clinicName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);

  emailPayload.attachment = [
    {
      content: pdfBuffer.toString('base64'),
      name: `material-apoio-${safeFileName}.pdf`,
    },
  ];

  await emailApi.sendTransacEmail(emailPayload);
}
```

**Update subscribe function**:

```typescript
export async function subscribe(payload: SubscriptionPayload): Promise<void> {
  // ... existing validation and bot detection ...

  // Map list name to Brevo list ID
  const listId = listIdMap[validated.listName];
  if (!listId) {
    throw new ValidationError(`Invalid list name: ${validated.listName}`);
  }

  // Create contact in Brevo
  const createContact = new brevo.CreateContact();
  createContact.email = validated.email;
  createContact.listIds = [parseInt(listId, 10)];

  // Add clinic name as attribute for vets
  if (validated.listName === 'vets' && validated.clinicName) {
    createContact.attributes = {
      CLINIC_NAME: validated.clinicName,
      SUBSCRIBED_AT: new Date().toISOString(),
      PDF_SENT: false,
    };
  }

  try {
    await apiInstance.createContact(createContact);

    // Log successful subscription
    logLegitimateSubmission({
      email: validated.email,
      listName: validated.listName,
      timeTaken,
      interactionCount: validated.interactionCount,
      hasFocusEvents: validated.hasFocusEvents,
      hasMouseMovement: validated.hasMouseMovement,
    });

    // Send PDF to vets
    if (validated.listName === 'vets' && validated.clinicName) {
      try {
        const pdfBuffer = await personalizePDF(validated.clinicName);
        await sendWelcomeEmailWithPDF(validated.email, validated.clinicName, pdfBuffer);

        // Update PDF_SENT attribute
        await apiInstance.updateContact(validated.email, {
          attributes: { PDF_SENT: true },
        });
      } catch (pdfError) {
        // Log error but don't fail subscription
        console.error('PDF generation/email failed:', pdfError);
        // TODO: Send email with download link as fallback
      }
    }
  } catch (error: unknown) {
    // ... existing error handling ...
  }
}
```

### 4.2 Verify PDF Service

Ensure `src/services/pdfPersonalization.ts` exists (should already be implemented). If not, copy from the architecture document.

---

## 5. API Route Updates

No changes needed to `src/app/api/v1/subscribe/route.ts` - it already delegates to the service layer.

**Verify existing implementation handles errors correctly**:

```typescript
// Should already exist
export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    await subscribe(body);
    return Response.json({ data: { success: true }, error: null });
  } catch (error) {
    // ... error mapping ...
  }
}
```

---

## 6. Frontend Updates

### 6.1 Update Signup Form

Edit `src/components/composite/SignupForm.tsx`:

**Add clinic name field for vets (REQUIRED)**:

```typescript
// Update form schema to include clinicName
const formSchema = subscriptionPayloadSchema.pick({
  email: true,
  clinicName: true, // NEW - Required for vets
});

// In the component JSX (for vets page only)
{theme === 'green' && ( // Assuming vets use green theme
  <FormField
    control={form.control}
    name="clinicName"
    render={({ field }) => (
      <FormItem>
        <FormLabel htmlFor="clinicName">
          Nome da Clínica *
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="ml-1 h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Será impresso no material de apoio personalizado</p>
            </TooltipContent>
          </Tooltip>
        </FormLabel>
        <FormControl>
          <Input
            {...field}
            id="clinicName"
            type="text"
            placeholder="Ex: Clínica Veterinária São Francisco"
            required
            aria-required="true"
            minLength={2}
            maxLength={100}
            autoComplete="organization"
          />
        </FormControl>
        <FormDescription>
          Você receberá o material com o nome da sua clínica
        </FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
)}
```

**Important UX Enhancements**:

1. **Tooltip**: Explains why clinic name is needed
2. **Placeholder**: Shows expected format
3. **Form Description**: Reinforces value proposition
4. **Auto-complete**: Uses `organization` for browser auto-fill
5. **Validation Feedback**: Real-time error messages

### 6.2 Update Success Message

For vets, update the success message to mention personalized PDF:

```typescript
const successMessage = listName === 'vets'
  ? `Cadastro realizado com sucesso! Verifique seu email para receber o material de apoio personalizado para ${clinicName}.`
  : 'Cadastro realizado com sucesso! Em breve você receberá nossas novidades.';
```

**Alternative with visual emphasis**:

```tsx
{isSuccess && (
  <Alert variant="success">
    <CheckCircleIcon className="h-4 w-4" />
    <AlertTitle>Cadastro realizado! 🎉</AlertTitle>
    <AlertDescription>
      {listName === 'vets' ? (
        <>
          Verifique seu email para receber o <strong>material de apoio personalizado</strong> para <strong>{clinicName}</strong>.
          <br />
          <small className="text-muted-foreground">
            Caso não encontre, verifique a caixa de spam.
          </small>
        </>
      ) : (
        'Em breve você receberá nossas novidades.'
      )}
    </AlertDescription>
  </Alert>
)}
```

---

## 7. Testing

### 7.1 Unit Tests

Create `src/services/pdfPersonalization.test.ts`:

```typescript
import { personalizePDF, addWatermark } from './pdfPersonalization';
import { PDFDocument } from 'pdf-lib';

describe('personalizePDF', () => {
  it('should generate PDF with clinic name', async () => {
    const clinicName = 'Clínica Teste';
    const pdfBuffer = await personalizePDF(clinicName);

    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(1000);

    // Verify PDF is valid
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    expect(pdfDoc.getPageCount()).toBeGreaterThan(0);
  });

  it('should throw error for empty clinic name', async () => {
    await expect(personalizePDF('')).rejects.toThrow();
  });
});
```

### 7.2 Integration Tests

Update `src/app/api/v1/subscribe/route.test.ts`:

```typescript
describe('POST /api/v1/subscribe - Vets with PDF', () => {
  it('should send email with PDF for vet subscriptions', async () => {
    const payload = {
      email: 'vet@clinic.com',
      listName: 'vets',
      clinicName: 'Clínica Esperança',
      formLoadTime: Date.now() - 5000,
      formSubmitTime: Date.now(),
      interactionCount: 3,
      hasFocusEvents: true,
      hasMouseMovement: true,
    };

    const response = await fetch('/api/v1/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    expect(response.status).toBe(200);
    // Add mocks to verify Brevo calls
  });
});
```

### 7.3 E2E Tests

Create `cypress/e2e/vet-subscription-pdf.cy.ts`:

```typescript
describe('Vet Subscription with PDF', () => {
  beforeEach(() => {
    cy.visit('/veterinarios');
  });

  it('should require clinic name for vets', () => {
    cy.get('input[name="email"]').type('vet@example.com');
    cy.get('button[type="submit"]').click();

    cy.contains('Nome da clínica é obrigatório').should('be.visible');
  });

  it('should successfully subscribe vet with clinic name', () => {
    cy.intercept('POST', '/api/v1/subscribe').as('subscribe');

    cy.get('input[name="email"]').type('vet@example.com');
    cy.get('input[name="clinicName"]').type('Clínica Teste');
    cy.get('button[type="submit"]').click();

    cy.wait('@subscribe').its('response.statusCode').should('eq', 200);
    cy.contains('Verifique seu email').should('be.visible');
  });
});
```

**Run tests**:

```bash
npm run test              # Unit tests
npm run test:integration  # Integration tests
npm run cypress:run       # E2E tests
```

---

## 8. Deployment

### 8.1 Pre-Deployment Checklist

- [ ] All environment variables set in Vercel project settings
- [ ] Brevo transactional email template created and tested
- [ ] Template PDF uploaded to `public/assets/`
- [ ] Font files present in `public/fonts/`
- [ ] All tests passing
- [ ] PDF generation tested locally with `npm run dev`

### 8.2 Vercel Configuration

Create `vercel.json` (if not exists):

```json
{
  "functions": {
    "app/api/v1/subscribe/route.ts": {
      "memory": 512,
      "maxDuration": 10
    }
  }
}
```

### 8.3 Deploy to Vercel

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### 8.4 Post-Deployment Testing

1. **Test Tutor Subscription** (should work as before, no PDF)
   ```bash
   curl -X POST https://your-domain.vercel.app/api/v1/subscribe \
     -H "Content-Type: application/json" \
     -d '{
       "email": "tutor@test.com",
       "listName": "tutors",
       "formLoadTime": 1234567890000,
       "formSubmitTime": 1234567892000,
       "interactionCount": 3,
       "hasFocusEvents": true,
       "hasMouseMovement": true
     }'
   ```

2. **Test Vet Subscription** (should receive email with PDF)
   ```bash
   curl -X POST https://your-domain.vercel.app/api/v1/subscribe \
     -H "Content-Type: application/json" \
     -d '{
       "email": "vet@test.com",
       "listName": "vets",
       "clinicName": "Clínica Teste",
       "formLoadTime": 1234567890000,
       "formSubmitTime": 1234567892000,
       "interactionCount": 3,
       "hasFocusEvents": true,
       "hasMouseMovement": true
     }'
   ```

3. **Check Email Inbox** for personalized PDF attachment

4. **Monitor Vercel Logs** for any errors

---

## 9. Troubleshooting

### Issue: PDF Generation Times Out

**Symptoms**: 504 Gateway Timeout errors

**Solutions**:
1. Increase function timeout in `vercel.json`: `"maxDuration": 15`
2. Increase function memory: `"memory": 1024`
3. Check template PDF size (should be < 5MB)

### Issue: Font Not Found

**Symptoms**: Error "Font file not found"

**Solutions**:
1. Verify font path: `public/fonts/FiraSans-Bold.ttf`
2. Check file permissions (must be readable)
3. Ensure fonts are included in deployment (check `vercel build` output)

### Issue: Email Not Received

**Symptoms**: Subscription succeeds but no email

**Solutions**:
1. Check Brevo dashboard → Transactional → Logs
2. Verify `BREVO_VET_WELCOME_TEMPLATE_ID` is correct
3. Check spam folder
4. Verify sender domain is configured in Brevo

### Issue: Attachment Too Large

**Symptoms**: Email received without attachment

**Solutions**:
1. Check PDF size in logs
2. Compress template PDF if > 1.5MB
3. Implement download link fallback (future enhancement)

---

## 10. Next Steps

After successful deployment:

1. **Monitor Metrics**:
   - Subscription success rate (should be > 95%)
   - PDF generation duration (target < 3s)
   - Email delivery rate (check Brevo dashboard)

2. **Gather Feedback**:
   - Survey vets about PDF quality
   - Track PDF opens/downloads (future enhancement)

3. **Iterate**:
   - Add more personalization options (logo, contact info)
   - Implement A/B testing for email templates
   - Add download analytics

---

## Resources

- **Full Architecture**: [15-pdf-personalization-integration.md](./architecture/15-pdf-personalization-integration.md)
- **Visual Diagrams**: [pdf-integration-diagrams.md](./architecture/pdf-integration-diagrams.md)
- **Brevo API Docs**: https://developers.brevo.com/
- **pdf-lib Docs**: https://pdf-lib.js.org/

---

**Document Version**: 1.0
**Last Updated**: 2025-10-09
**Status**: ✅ Ready for Implementation
