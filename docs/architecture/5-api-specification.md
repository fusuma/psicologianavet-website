# 5. API Specification

The API uses a unified `ApiResponse` envelope and is versioned at `/api/v1` for future scalability.

## REST API Specification

```yaml
openapi: 3.0.0
info:
  title: "Quando um amor se vai API"
  version: "1.0.0"
  description: "API for handling email subscriptions."
servers:
  - url: "/api/v1"
    description: "Version 1 of the API"
paths:
  /subscribe:
    post:
      summary: "Subscribes a user to a mailing list (Tutors or Vets)."
      operationId: subscribeUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SubscriptionPayload'
      responses:
        '200':
          description: "Subscription successful."
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ApiResponse'
        '400':
          description: "Bad Request - Validation or Honeypot failed."
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ApiResponse'
        '409':
          description: "Conflict - The email address is already subscribed."
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ApiResponse'
        '500':
          description: "Internal Server Error - Unexpected failure."
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ApiResponse'
components:
  schemas:
    SubscriptionPayload:
      type: object
      required: [email, listName]
      properties:
        email:
          type: string
          format: email
        listName:
          type: string
          enum: [tutors, vets]
        honeypot:
          type: string
          maxLength: 0
    ApiResponse:
      type: object
      properties:
        data:
          type: object
          nullable: true
        error:
          $ref: '#/components/schemas/ApiError'
          nullable: true
    ApiError:
      type: object
      properties:
        code:
          type: string
        message:
          type: string
        details:
          type: array
          items:
            type: object
          nullable: true
```
