import { PDFDocument, rgb } from 'pdf-lib';
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

  // Get the last page (page 7 where the clinic name appears)
  const pages = pdfDoc.getPages();
  const lastPage = pages[pages.length - 1];

  // Get page dimensions
  const { width, height } = lastPage.getSize();

  // Remove the existing "Clínica RosaVet" text by drawing a white rectangle over it
  // Approximate position based on PDF layout
  const textY = 160; // Distance from bottom
  const textX = width / 2 - 100; // Centered

  lastPage.drawRectangle({
    x: textX,
    y: textY - 5,
    width: 200,
    height: 25,
    color: rgb(1, 1, 1), // White
  });

  // Draw the new clinic name
  lastPage.drawText(clinicName, {
    x: width / 2 - (clinicName.length * 4), // Rough centering
    y: textY,
    size: 14,
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
  const pages = pdfDoc.getPages();

  const watermarkText = `${metadata.clinicName} | ${metadata.email} | ${metadata.date}`;

  pages.forEach((page) => {
    const { width, height } = page.getSize();

    // Add subtle watermark at bottom of each page
    page.drawText(watermarkText, {
      x: 50,
      y: 20,
      size: 7,
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
