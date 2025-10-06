import { NextRequest, NextResponse } from 'next/server';
import { subscribe, ValidationError, EmailExistsError } from '@/services/subscriptionService';
import type { ApiResponse } from '@/shared/schemas';

/**
 * POST /api/v1/subscribe
 *
 * Handles email subscription requests.
 *
 * @param request - The Next.js request object
 * @returns NextResponse with ApiResponse structure
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    const body = await request.json();

    // Call subscription service
    await subscribe(body);

    // Return success response
    const successResponse: ApiResponse<Record<string, never>> = {
      data: {},
      error: null,
    };

    return NextResponse.json(successResponse, { status: 200 });
  } catch (error: unknown) {
    // Handle ValidationError (includes honeypot detection)
    if (error instanceof ValidationError) {
      const errorResponse: ApiResponse<null> = {
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: [],
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Handle EmailExistsError
    if (error instanceof EmailExistsError) {
      const errorResponse: ApiResponse<null> = {
        data: null,
        error: {
          code: 'EMAIL_EXISTS',
          message: 'Email already subscribed',
          details: [],
        },
      };
      return NextResponse.json(errorResponse, { status: 409 });
    }

    // Handle generic/unknown errors
    // Never expose internal error details to client
    const genericErrorResponse: ApiResponse<null> = {
      data: null,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        details: [],
      },
    };
    return NextResponse.json(genericErrorResponse, { status: 500 });
  }
}
