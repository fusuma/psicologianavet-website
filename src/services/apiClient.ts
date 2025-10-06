import type { ApiResponse, SubscriptionPayload } from '@/shared/schemas';

/**
 * API Client for frontend-to-backend communication.
 * Handles all HTTP requests to the backend API.
 */
export class ApiClient {
  private readonly baseUrl: string = '/api/v1';

  /**
   * Subscribe a user to a mailing list.
   *
   * @param payload - The subscription data (email, listName, honeypot)
   * @returns Promise resolving to ApiResponse
   */
  async subscribe(payload: SubscriptionPayload): Promise<ApiResponse<Record<string, never>>> {
    try {
      const response = await fetch(`${this.baseUrl}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Parse response as JSON
      const data: ApiResponse<Record<string, never>> = await response.json();

      return data;
    } catch (error: unknown) {
      // Handle network errors gracefully
      return {
        data: null,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Unable to connect to server',
          details: [],
        },
      };
    }
  }
}

/**
 * Singleton instance of ApiClient.
 * Use this instance throughout the application.
 */
export const apiClient = new ApiClient();
