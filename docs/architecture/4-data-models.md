# 4. Data Models

The primary data structure is the payload sent from the client to our serverless API function. The Zod schema is the single source of truth for both validation and TypeScript typing.

## Schema and Type Definition (Single Source of Truth)

```typescript
// Located in the shared package: /shared/schemas.ts
import { z } from 'zod';

// Zod schema is the single source of truth for validation rules.
export const subscriptionPayloadSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  listName: z.enum(['tutors', 'vets']),
  honeypot: z.string().max(0, { message: "Bot submission detected." }).optional(),
});

// The TypeScript type is inferred directly from the schema, eliminating drift.
export type SubscriptionPayload = z.infer<typeof subscriptionPayloadSchema>;
```
