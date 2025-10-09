import { NextRequest, NextResponse } from 'next/server';
import { personalizePDF } from '@/services/pdfPersonalization';
import { z } from 'zod';

/**
 * GET /api/v1/pdf/download?clinicName=X
 *
 * Download personalized PDF for a clinic (fallback if email attachment fails)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const clinicName = searchParams.get('clinicName');

    // Validate clinic name parameter
    const schema = z.string()
      .min(2, { message: 'Nome da clínica inválido' })
      .max(100)
      .regex(/^[a-zA-ZÀ-ÿ0-9\s\-'\.]+$/);

    const validated = schema.safeParse(clinicName);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Nome da clínica inválido ou ausente' },
        { status: 400 }
      );
    }

    // Generate personalized PDF
    const pdfBuffer = await personalizePDF(validated.data);

    // Sanitize filename
    const safeFileName = validated.data
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);

    // Return PDF as downloadable file
    return new NextResponse(pdfBuffer as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="material-apoio-${safeFileName}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('PDF download error:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar PDF' },
      { status: 500 }
    );
  }
}
