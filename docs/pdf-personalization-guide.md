# PDF Personalization Guide

## Overview

This system allows you to programmatically create personalized versions of the "Apoio para Momentos Difíceis" PDF for veterinary clinic partners.

**Original text (page 7):**
```
Material gentilmente fornecido por
Clínica RosaVet
```

**Becomes:**
```
Material gentilmente fornecido por
[Clinic Name Here]
```

---

## How It Works

### 1. **Template PDF**
- Located at: `public/assets/apoio-momentos-dificeis.pdf`
- Contains placeholder: "Clínica RosaVet" on last page

### 2. **Personalization Process**
1. Load template PDF
2. Replace "Clínica RosaVet" with actual clinic name
3. Add invisible watermark with tracking data (clinic name, email, date)
4. Return personalized PDF

### 3. **Tracking & Security**
- Each PDF has unique watermark on every page
- Contains: `Clinic Name | email@clinic.com | DD/MM/YYYY`
- Watermark is subtle (small, gray, semi-transparent)
- Helps track unauthorized sharing

---

## API Endpoint

### `POST /api/v1/personalize-pdf`

Generate a personalized PDF for a specific clinic.

**Request:**
```json
{
  "clinicName": "Clínica PetCare Premium",
  "email": "contato@petcare.com.br"
}
```

**Response:**
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="apoio-momentos-dificeis-clinica-petcare-premium.pdf"`
- Body: PDF binary data

**Example (curl):**
```bash
curl -X POST http://localhost:3000/api/v1/personalize-pdf \
  -H "Content-Type: application/json" \
  -d '{"clinicName":"Clínica Exemplo","email":"exemplo@clinica.com"}' \
  --output personalized.pdf
```

---

## Testing

### Using the Test Script

```bash
# Basic test
node test-pdf-personalization.js "Clínica Amor Pet" "contato@amorpet.com"

# With default values
node test-pdf-personalization.js
```

### Manual Testing

1. Start dev server: `npm run dev`
2. Run test script (see above)
3. Check `public/assets/personalized-*.pdf`
4. Open PDF and verify:
   - Page 7 shows new clinic name (not "Clínica RosaVet")
   - Bottom of each page has subtle watermark

---

## Integration with Affiliate Program

### Workflow

1. **Vet signs up for affiliate program**
   - Provides clinic name and email

2. **System generates personalized PDF**
   ```typescript
   const pdfBuffer = await personalizeAndWatermark(
     'Clínica do Veterinário',
     'vet@clinica.com.br'
   );
   ```

3. **PDF is sent via email or stored**
   - Email it directly to the vet
   - Store in S3/Cloudinary with unique URL
   - Provide download link in affiliate dashboard

4. **Tracking**
   - If PDF is shared without authorization, watermark reveals source
   - Can be combined with unique download links

### Example Integration

```typescript
// In affiliate signup handler
import { personalizeAndWatermark } from '@/services/pdfPersonalization';
import { uploadToS3 } from '@/services/storage';
import { sendEmail } from '@/services/email';

async function handleAffiliateSignup(data: {
  clinicName: string;
  email: string;
  // ... other fields
}) {
  // Generate personalized PDF
  const pdfBuffer = await personalizeAndWatermark(
    data.clinicName,
    data.email
  );

  // Option 1: Store in cloud
  const pdfUrl = await uploadToS3(
    pdfBuffer,
    `pdfs/personalized/${data.email}-${Date.now()}.pdf`
  );

  // Option 2: Send via email
  await sendEmail({
    to: data.email,
    subject: 'Seu Material Personalizado - Psicologia na Vet',
    body: 'Segue em anexo seu material personalizado...',
    attachments: [
      {
        filename: `apoio-momentos-dificeis-${data.clinicName}.pdf`,
        content: pdfBuffer,
      },
    ],
  });

  // Save affiliate record with PDF URL
  await saveAffiliate({
    ...data,
    personalizedPdfUrl: pdfUrl,
  });
}
```

---

## Advanced: Fine-Tuning Position

The clinic name position is controlled in `pdfPersonalization.ts`:

```typescript
const textY = 160; // Distance from bottom (adjust if needed)
const textX = width / 2 - 100; // Horizontal centering
```

To adjust:
1. Open the template PDF
2. Measure exact position of "Clínica RosaVet"
3. Update `textY` and `textX` values
4. Test with different clinic names

---

## Cost Considerations

### Performance
- PDF processing: ~1-2 seconds per PDF
- PDF size: ~3.4 MB
- Memory usage: ~10-20 MB per request

### Storage
- **Option A: Generate on-demand** (no storage cost)
  - Generate PDF when requested
  - Higher server CPU usage

- **Option B: Pre-generate and cache** (storage cost)
  - Generate once, store in S3
  - Serve cached version
  - Recommended for high-traffic

### Recommended Approach

```typescript
// Hybrid: Cache personalized PDFs
async function getPersonalizedPDF(clinicName: string, email: string) {
  const cacheKey = `${email}-${clinicName}`;

  // Check cache first
  const cached = await getCachedPDF(cacheKey);
  if (cached) return cached;

  // Generate if not cached
  const pdfBuffer = await personalizeAndWatermark(clinicName, email);

  // Cache for future requests
  await cachePDF(cacheKey, pdfBuffer, { ttl: '30d' });

  return pdfBuffer;
}
```

---

## Security Best Practices

### 1. Access Control
- Protect `/api/v1/personalize-pdf` endpoint
- Require authentication (API key or JWT)
- Rate limit requests (max 10/hour per clinic)

### 2. Input Validation
```typescript
// Validate clinic name
if (clinicName.length > 50 || !/^[\w\s]+$/.test(clinicName)) {
  throw new Error('Invalid clinic name');
}
```

### 3. Watermark Tracking
- Log all PDF generations
- Track which PDFs are shared
- Monitor for unauthorized distribution

### 4. Legal Notice
Add to personalized PDFs:
```
LICENÇA PESSOAL
Este material foi personalizado para [Clinic Name].
A redistribuição não autorizada é proibida.
Para distribuir aos seus clientes, use nosso sistema de afiliados.
```

---

## Troubleshooting

### PDF Text Not Centered
**Solution:** Adjust `textX` calculation based on clinic name length:
```typescript
const fontSize = 14;
const approxCharWidth = fontSize * 0.6;
const textWidth = clinicName.length * approxCharWidth;
const textX = (width - textWidth) / 2;
```

### Watermark Not Visible
**Solution:** Increase opacity or size:
```typescript
page.drawText(watermarkText, {
  size: 10, // Increase from 7
  opacity: 0.7, // Increase from 0.5
});
```

### PDF Generation Slow
**Solution:** Implement caching (see "Cost Considerations" above)

### Font Not Rendering Correctly
**Solution:** Embed custom font:
```typescript
import fontkit from '@pdf-lib/fontkit';

pdfDoc.registerFontkit(fontkit);
const fontBytes = await fs.readFile('path/to/font.ttf');
const customFont = await pdfDoc.embedFont(fontBytes);

page.drawText(text, {
  font: customFont,
  // ...
});
```

---

## Future Enhancements

### 1. Logo Addition
Add clinic logo to PDF:
```typescript
const logoImage = await pdfDoc.embedPng(logoBytes);
lastPage.drawImage(logoImage, {
  x: 50,
  y: height - 100,
  width: 100,
  height: 100,
});
```

### 2. Multiple Templates
Support different PDF templates:
- Template for vets
- Template for tutors
- Custom designs per clinic tier

### 3. QR Code Generation
Add QR code linking to affiliate dashboard:
```typescript
import QRCode from 'qrcode';

const qrCodeDataUrl = await QRCode.toDataURL(affiliateUrl);
const qrImage = await pdfDoc.embedPng(qrCodeDataUrl);
// Draw QR code on PDF
```

### 4. Analytics Integration
Track PDF effectiveness:
- Views (if hosted)
- Downloads
- Time to first download
- Conversion from PDF to ebook purchase

---

## Related Documentation

- `docs/ebook-distribution-security.md` - Overall security strategy
- `docs/vercel-setup.md` - Environment configuration
- Affiliate program implementation (TBD)

---

## Support

For issues with PDF personalization:
1. Check server logs for detailed errors
2. Verify `pdf-lib` is installed: `npm list pdf-lib`
3. Test with simple clinic name first
4. Check file permissions on template PDF

**Technical Contact:** dev@psicologianavet.com

---

**Document Version:** 1.0
**Last Updated:** 2025-10-08
**Author:** Development Team
