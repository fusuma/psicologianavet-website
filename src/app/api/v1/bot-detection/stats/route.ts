import { NextRequest, NextResponse } from 'next/server';
import {
  getBotDetectionStats,
  exportBotDetectionLogs,
} from '@/utils/botDetectionLogger';
import { getBotDetectionConfig } from '@/config/botDetection';

/**
 * GET /api/v1/bot-detection/stats
 *
 * Returns bot detection statistics and recent attempts.
 * Protected endpoint - should require authentication in production.
 *
 * Query Parameters:
 * - export=csv : Download logs as CSV file
 * - config=true : Include current configuration
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  // SECURITY WARNING: This endpoint exposes sensitive data
  // TODO: Add authentication middleware before deploying to production
  // Example: Check for admin API key or session token
  const authToken = request.headers.get('x-admin-token');
  const expectedToken = process.env.ADMIN_API_TOKEN;

  if (expectedToken && authToken !== expectedToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const exportCsv = searchParams.get('export') === 'csv';
  const includeConfig = searchParams.get('config') === 'true';

  // Export as CSV
  if (exportCsv) {
    const csv = exportBotDetectionLogs();
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="bot-detection-logs-${Date.now()}.csv"`,
      },
    });
  }

  // Return JSON stats
  const stats = getBotDetectionStats();
  const response: Record<string, unknown> = {
    stats,
    timestamp: new Date().toISOString(),
  };

  if (includeConfig) {
    response.config = getBotDetectionConfig();
  }

  return NextResponse.json(response, { status: 200 });
}

/**
 * DELETE /api/v1/bot-detection/stats
 *
 * Clear bot detection logs (admin only).
 * Requires authentication.
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  // SECURITY: Require authentication
  const authToken = request.headers.get('x-admin-token');
  const expectedToken = process.env.ADMIN_API_TOKEN;

  if (!expectedToken || authToken !== expectedToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Import clearBotDetectionLogs here to avoid circular dependencies
  const { clearBotDetectionLogs } = await import('@/utils/botDetectionLogger');
  clearBotDetectionLogs();

  return NextResponse.json(
    { message: 'Bot detection logs cleared successfully' },
    { status: 200 }
  );
}
