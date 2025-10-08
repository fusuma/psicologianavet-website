import { z } from 'zod';

/**
 * Zod schema for subscription payload validation.
 * This is the single source of truth for subscription data validation.
 */
export const subscriptionPayloadSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  listName: z.enum(['tutors', 'vets']),

  // Multi-layer bot detection fields
  // Layer 1: Decoy fields (should remain empty)
  website: z.string().max(0).optional(), // Primary honeypot
  phone: z.string().max(0).optional(),   // Secondary honeypot
  company: z.string().max(0).optional(), // Tertiary honeypot

  // Layer 2: Temporal validation
  formLoadTime: z.number().int().positive(), // Unix timestamp when form loaded
  formSubmitTime: z.number().int().positive().optional(), // Unix timestamp when submitted (set at submit time)

  // Layer 3: Behavioral fingerprinting
  interactionCount: z.number().int().min(0), // Number of user interactions
  hasFocusEvents: z.boolean(), // Did user focus on email field?
  hasMouseMovement: z.boolean(), // Was mouse movement detected?
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
