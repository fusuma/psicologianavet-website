import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs/promises';
import path from 'path';

/**
 * Personalize the support material PDF with clinic name
 */
export async function personalizePDF(clinicName: string): Promise<Buffer> {
  // Load the template PDF
  const templatePath = path.join(process.cwd(), 'public/assets/apoio-momentos-dificeis.pdf');
  const existingPdfBytes = await fs.readFile(templatePath);

  // Load PDF document
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Register fontkit for custom font support
  pdfDoc.registerFontkit(fontkit);

  // Load Fira Sans Bold font
  const fontPath = path.join(process.cwd(), 'public/fonts/FiraSans-Bold.ttf');
  const fontBytes = await fs.readFile(fontPath);
  const firaSansBold = await pdfDoc.embedFont(fontBytes);

  // Get the last page (page 7 where the clinic name appears)
  const pages = pdfDoc.getPages();
  const lastPage = pages[pages.length - 1];

  // Get page dimensions
  const { width, height } = lastPage.getSize();

  // Remove the existing "Clínica RosaVet" text by drawing a white rectangle over it
  // Position based on PDF layout (bottom center of page 7)
  const textY = 135; // Distance from bottom (adjusted for larger font)
  const fontSize = 40; // Bold 40px as requested

  // Calculate exact text width using the actual font
  const textWidth = firaSansBold.widthOfTextAtSize(clinicName, fontSize);
  const centeredX = (width - textWidth) / 2;

  // Draw larger white rectangle to cover original text
  lastPage.drawRectangle({
    x: centeredX - 10,
    y: textY - 10,
    width: textWidth + 20,
    height: fontSize + 20,
    color: rgb(1, 1, 1), // White
  });

  // Draw the new clinic name with Fira Sans Bold 40px
  lastPage.drawText(clinicName, {
    x: centeredX,
    y: textY,
    size: fontSize,
    font: firaSansBold,
    color: rgb(0.2, 0.2, 0.2), // Dark gray
  });

  // Save the modified PDF
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

/**
 * Alternative: Add watermark to all pages for tracking
 */
export async function addWatermark(
  pdfBytes: Buffer,
  metadata: {
    clinicName: string;
    email: string;
    date: string;
  }
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // Register fontkit and load Fira Sans Regular for watermark
  pdfDoc.registerFontkit(fontkit);
  const fontPath = path.join(process.cwd(), 'public/fonts/FiraSans-Regular.ttf');
  const fontBytes = await fs.readFile(fontPath);
  const firaSansRegular = await pdfDoc.embedFont(fontBytes);

  const pages = pdfDoc.getPages();
  const watermarkText = `${metadata.clinicName} | ${metadata.email} | ${metadata.date}`;

  pages.forEach((page) => {
    const { width, height } = page.getSize();

    // Add subtle watermark at bottom of each page
    page.drawText(watermarkText, {
      x: 50,
      y: 20,
      size: 7,
      font: firaSansRegular,
      color: rgb(0.7, 0.7, 0.7),
      opacity: 0.5,
    });
  });

  const modifiedPdfBytes = await pdfDoc.save();
  return Buffer.from(modifiedPdfBytes);
}

/**
 * Full personalization: Replace clinic name + add tracking watermark
 */
export async function personalizeAndWatermark(
  clinicName: string,
  email: string
): Promise<Buffer> {
  // Step 1: Replace clinic name
  let pdfBuffer = await personalizePDF(clinicName);

  // Step 2: Add tracking watermark
  pdfBuffer = await addWatermark(pdfBuffer, {
    clinicName,
    email,
    date: new Date().toLocaleDateString('pt-BR'),
  });

  return pdfBuffer;
}
