# 11. Backend Architecture

## Service Architecture

* **Pattern:** **Serverless Architecture** using Next.js API Routes.
* **Separation of Concerns:** Logic is strictly separated:
  * **Controller (**`route.ts`): Handles HTTP I/O, error mapping, and calls the service.
  * **Service (**`subscriptionService.ts`): Contains all business logic (validation, honeypot, Brevo call).
