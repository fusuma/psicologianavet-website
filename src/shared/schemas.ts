import { z } from 'zod';

/**
 * Zod schema for subscription payload validation.
 * This is the single source of truth for subscription data validation.
 */
export const subscriptionPayloadSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  listName: z.enum(['tutors', 'vets']),
  honeypot: z.string().max(0, { message: "Bot submission detected." }).optional(),
});

/**
 * TypeScript type inferred from subscriptionPayloadSchema.
 * Do not define this type separately - always infer from Zod schema.
 */
export type SubscriptionPayload = z.infer<typeof subscriptionPayloadSchema>;

/**
 * Standard API error structure.
 */
export interface ApiError {
  code: string;
  message: string;
  details?: unknown[];
}

/**
 * Generic API response envelope.
 * All API endpoints return this structure for consistency.
 *
 * @template T - The type of data returned on success
 */
export interface ApiResponse<T = unknown> {
  data: T | null;
  error: ApiError | null;
}
