import { NextRequest, NextResponse } from 'next/server';
import { personalizeAndWatermark } from '@/services/pdfPersonalization';

/**
 * POST /api/v1/personalize-pdf
 *
 * Generate a personalized PDF with clinic branding
 *
 * Body: { clinicName: string, email: string }
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { clinicName, email } = body;

    if (!clinicName || !email) {
      return NextResponse.json(
        { error: 'clinicName and email are required' },
        { status: 400 }
      );
    }

    // Generate personalized PDF
    const pdfBuffer = await personalizeAndWatermark(clinicName, email);

    // Return PDF as downloadable file
    return new NextResponse(pdfBuffer as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="apoio-momentos-dificeis-${clinicName.replace(/\s+/g, '-').toLowerCase()}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('PDF personalization error:', error);
    return NextResponse.json(
      { error: 'Failed to generate personalized PDF' },
      { status: 500 }
    );
  }
}
