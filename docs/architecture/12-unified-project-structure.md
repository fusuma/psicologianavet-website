# 12. Unified Project Structure

```plaintext
/quandounamorsevai
├── src/
│   ├── app/                      # Next.js App Router (FE/BE entry points)
│   │   ├── layout.tsx            # Root Layout
│   │   └── api/
│   │       └── v1/
│   │           └── subscribe/
│   │               └── route.ts  # API Controller
│   ├── components/               # All reusable FE components
│   │   ├── ui/                   # Shadcn/UI primitives
│   │   └── composite/            # Feature-specific components
│   ├── services/                 # FE/BE Business Logic & API Clients
│   │   ├── subscriptionService.ts# Backend Service
│   │   └── apiClient.ts          # Frontend API Client
│   ├── utils/                    # Generic utilities (e.g., error handling)
│   └── shared/                   # Monorepo boundary for shared types
│       └── schemas.ts            # Zod & TypeScript Schemas/Types (CRITICAL)
├── .env.example                  # Documents required environment variables
├── package.json                  
└── tsconfig.json                 
```
