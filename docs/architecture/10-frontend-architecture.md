# 10. Frontend Architecture

## Component Architecture

* **Component Organization:** Uses a clean `src/components/ui` (for Shadcn/UI) and `src/components/composite` (for feature components) structure.
* **Component Template:** Components default to **React Server Components (RSC)**. The `"use client";` directive must be added only when client-side interactivity (hooks, event handlers) is required.

## Routing Architecture

* **Pattern:** Next.js **App Router** (`/app` directory) based routing.
* **Organization:** Routes are defined by `page.tsx` and API endpoints by `route.ts` files within the `app` directory.

## Frontend Services Layer

The API Client is designed to be robust, handling network errors and the unified `ApiResponse` envelope gracefully.
