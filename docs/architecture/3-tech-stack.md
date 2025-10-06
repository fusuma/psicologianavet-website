# 3. Tech Stack

This table is the **DEFINITIVE** technology selection for the entire project. All development must use these specific choices and versions.

| Category | Technology | Version | Purpose | Rationale |
|:---|:---|:---|:---|:---|
| **Frontend Language** | TypeScript | \~5.x | Primary language for type safety. | Standard for modern Next.js development; ensures type safety. |
| **Frontend Framework** | Next.js (React) | \~14.x | Core framework for SSG and API Routes. | Enables SSG for performance; integrated architecture. |
| **UI Component Library** | Shadcn/UI | \~0.x | Foundation for all UI components. | Accelerates development with accessible, themeable components. |
| **UI Primitives** | Radix UI | \~1.x | Accessible, headless primitives. | Foundation of Shadcn/UI, providing best-in-class accessibility. |
| **State Management** | React Context/Hooks | (built-in) | Managing simple, localized UI state. | Sufficient for the MVP; avoids adding external libraries. |
| **Backend Language** | TypeScript | \~5.x | Language for the serverless API function. | Ensures end-to-end type safety when used with Next.js. |
| **Backend Framework** | Next.js API Routes | \~14.x | Framework for the serverless function. | Integrated directly into the Next.js project. |
| **API Style** | REST | n/a | Standard for the single API endpoint. | Simple RESTful endpoint is sufficient. |
| **Database** | None | n/a | No database is required for the MVP. | All data sent directly to the external Brevo API. |
| **Email API** | Brevo | (API) | External service for managing email lists. | Selected for its generous free tier. |
| **Email SDK** | @getbrevo/brevo | \~7.x | Official Node.js SDK for API communication. | Provides pre-built, typed methods for reliable integration. |
| **Validation** | Zod | \~3.x | Runtime and compile-time validation. | Single source of truth for schema validation across the full stack. |
| **Form Management** | React Hook Form | \~7.x | For managing form state and validation. | Robust and performant form handling. |
| **Frontend Testing** | Jest, React Testing Library, jest-axe | \~29.x | For unit and integration testing of UI components. | Standard for testing React applications. |
| **E2E Testing** | Cypress, cypress-axe | \~13.x | For end-to-end testing of user flows. | Ensures the signup flow works correctly in a real browser. |
| **CI/CD** | Vercel | (platform) | Automated builds and deployments from Git. | Seamless, zero-configuration CI/CD pipeline. |
| **CSS Framework** | Tailwind CSS | \~3.x | For utility-first styling. | Speed of development and maintainability. |
| **Animation** | Framer Motion | \~11.x | For page transitions and micro-interactions. | Powerful library that respects prefers-reduced-motion. |
