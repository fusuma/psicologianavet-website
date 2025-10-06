# 6. Components

The architecture is divided into three logical groups: Base UI (Shadcn/UI), Composite UI (Feature-specific), and Services/Shared.

## Base UI Components (via Shadcn/UI)

* **Button**: A polymorphic button component.
* **Form Primitives (Input, Label)**: Accessible foundation for forms.

## Composite UI Components (Frontend)

* **<Layout />**: Provides the primary, themeable page structure, including the header and footer.
* **<SignupForm />**: Manages the email subscription process. Built from Base UI components and uses React Hook Form.
* **<Analytics />**: Integrates and manages the Google Analytics script and page view tracking.

## Services & Shared Packages

* **ApiServiceClient (Frontend Service)**: A dedicated client-side module for all communication with the backend API. It handles the `fetch` call and response parsing.
* **Subscribe API Route (Backend Controller)**: The HTTP layer that handles request I/O and calls the subscription service.
* **Subscription Service (Backend Service)**: The business logic layer that performs validation, honeypot check, and Brevo SDK call.
* **Shared Schemas & Types (Shared Package)**: The single source of truth for data structures and validation schemas.

## Component Interaction Diagram (Refined)

```mermaid
graph TD
subgraph Frontend (Browser)
Composite["<SignupForm />"] -->|Built With| Base["<Input />, <Button />"]
Composite -->|Uses for API Calls| Service["ApiServiceClient"]
Composite -->|Uses for Validation| Shared["Shared Schemas & Types"]
Service -->|Imports Types| Shared
end

subgraph Backend (Vercel)
    Controller["Subscribe API Route"] -->|Imports Schemas| Shared
    Controller -->|Calls Business Logic| SubsService["Subscription Service"]
    SubsService -->|Uses SDK| SDK["@getbrevo/brevo"]
end

subgraph External
    Brevo["Brevo API"]
end

Service --"POST /api/v1/subscribe"--> Controller
SDK --> Brevo
```
