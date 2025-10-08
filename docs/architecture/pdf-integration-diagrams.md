# PDF Personalization Integration - Visual Diagrams

This document contains detailed visual diagrams for the PDF personalization and Brevo integration system. These diagrams complement the main architecture document ([15-pdf-personalization-integration.md](./15-pdf-personalization-integration.md)).

## System Context Diagram

```mermaid
graph TB
    subgraph External Users
        V[Veterinarian]
        T[Tutor/Pet Owner]
    end

    subgraph Next.js Application
        subgraph Frontend
            VF[Vets Page]
            TF[Tutors Page]
            SF[Signup Form Component]
        end

        subgraph API Layer
            SUB[POST /api/v1/subscribe]
            DL[GET /api/v1/pdf/download]
        end

        subgraph Services
            SS[Subscription Service]
            PS[PDF Personalization Service]
        end
    end

    subgraph External Services
        BC[Brevo Contacts API]
        BE[Brevo Transactional Email API]
    end

    subgraph Assets
        TPL[Template PDF]
        FNT[Fira Sans Fonts]
    end

    V --> VF
    T --> TF
    VF --> SF
    TF --> SF
    SF --> SUB
    SUB --> SS
    SS --> PS
    SS --> BC
    SS --> BE
    PS --> TPL
    PS --> FNT
    BE -.email with PDF.-> V
    DL --> PS
    DL -.fallback PDF.-> V

    style V fill:#269A9B,color:#fff
    style PS fill:#ff6b6b
    style BE fill:#4ecdc4
    style BC fill:#4ecdc4
```

## Detailed Subscription Flow - Vets with PDF

```mermaid
sequenceDiagram
    autonumber
    actor Vet as Veterinarian
    participant Form as SignupForm.tsx
    participant API as /api/v1/subscribe
    participant Svc as subscriptionService
    participant Bot as Bot Detection
    participant PDF as pdfPersonalization
    participant FS as File System
    participant BrevC as Brevo Contacts
    participant BrevE as Brevo Email

    Vet->>+Form: Enter email + clinic name
    Form->>Form: Track interactions<br/>(mouse, focus, time)
    Vet->>Form: Click Submit

    Form->>+API: POST {email, clinicName,<br/>listName: 'vets', ...botData}
    API->>+Svc: subscribe(payload)

    %% Validation Phase
    rect rgb(240, 240, 255)
        Note over Svc,Bot: Validation & Bot Detection Phase
        Svc->>Svc: Validate schema (Zod)
        Svc->>+Bot: Check honeypot fields
        Bot-->>-Svc: ✓ Pass
        Svc->>+Bot: Check timing (2s-1h)
        Bot-->>-Svc: ✓ Pass
        Svc->>+Bot: Check interactions
        Bot-->>-Svc: ✓ Pass
    end

    %% Contact Creation Phase
    rect rgb(240, 255, 240)
        Note over Svc,BrevC: Contact Creation Phase
        Svc->>+BrevC: createContact({<br/>  email,<br/>  listId: VETS_LIST,<br/>  attributes: {CLINIC_NAME}<br/>})
        BrevC->>BrevC: Check duplicate
        BrevC-->>-Svc: 201 Created
    end

    %% PDF Generation Phase
    rect rgb(255, 240, 240)
        Note over Svc,FS: PDF Generation Phase
        Svc->>+PDF: personalizePDF(clinicName)
        PDF->>+FS: Read template PDF
        FS-->>-PDF: PDF bytes
        PDF->>+FS: Read Fira Sans Bold font
        FS-->>-PDF: Font bytes
        PDF->>PDF: Load PDF with pdf-lib
        PDF->>PDF: Register fontkit
        PDF->>PDF: Embed custom font
        PDF->>PDF: Get page 7 (last page)
        PDF->>PDF: Calculate text position
        PDF->>PDF: Draw white rectangle<br/>(cover original)
        PDF->>PDF: Draw clinic name<br/>(centered, 40px bold)
        PDF->>PDF: Save modified PDF
        PDF-->>-Svc: Buffer (personalized PDF)
    end

    %% Email Sending Phase
    rect rgb(255, 255, 240)
        Note over Svc,BrevE: Email Delivery Phase
        Svc->>Svc: Convert PDF to base64
        Svc->>+BrevE: sendTransacEmail({<br/>  to: email,<br/>  templateId,<br/>  params: {CLINIC_NAME},<br/>  attachment: [{<br/>    content: base64PDF,<br/>    name: 'material-apoio-{clinic}.pdf'<br/>  }]<br/>})
        BrevE->>BrevE: Queue email
        BrevE-->>-Svc: 200 Queued
    end

    Svc-->>-API: Success
    API-->>-Form: 200 OK
    Form->>Form: Show success message
    Form-->>Vet: "Cadastro realizado!<br/>Verifique seu email."

    %% Async Email Delivery
    rect rgb(220, 220, 220)
        Note over BrevE,Vet: Async Email Delivery (5-30s)
        BrevE->>BrevE: Render template
        BrevE->>BrevE: Attach PDF
        BrevE->>Vet: 📧 Welcome email +<br/>personalized PDF attachment
    end
```

## Error Handling Flow

```mermaid
flowchart TD
    Start([Subscribe Request]) --> Validate{Validate<br/>Payload}

    Validate -->|Invalid| E1[❌ 400 Bad Request]
    Validate -->|Valid| BotCheck{Bot Detection<br/>Pass?}

    BotCheck -->|Fail| E2[❌ 400 Bot Detected]
    BotCheck -->|Pass| CreateContact[Create Brevo Contact]

    CreateContact -->|Success| ListCheck{List Name?}
    CreateContact -->|Duplicate| E3[❌ 409 Conflict]
    CreateContact -->|API Error| E4[❌ 500 Brevo Error]

    ListCheck -->|tutors| SimpleEmail[Send Simple<br/>Welcome Email]
    ListCheck -->|vets| GenPDF[Generate<br/>Personalized PDF]

    GenPDF -->|Success| CheckSize{PDF Size<br/>< 2MB?}
    GenPDF -->|Font Error| Fallback1[Create Download<br/>JWT Token]
    GenPDF -->|Template Error| Fallback1

    CheckSize -->|Yes| AttachPDF[Attach PDF<br/>to Email]
    CheckSize -->|No| Fallback1

    AttachPDF -->|Success| SendEmail[Send via<br/>Brevo Email API]

    Fallback1 --> FallbackEmail[Send Email<br/>with Download Link]

    SendEmail -->|Success| Success[✅ 200 OK]
    SendEmail -->|Retry| Retry{Retry Count<br/>< 3?}
    SendEmail -->|Fatal Error| E5[❌ 500 Email Failed]

    Retry -->|Yes| Wait[Wait 1-5s<br/>exponential backoff]
    Retry -->|No| E5
    Wait --> SendEmail

    FallbackEmail --> Success
    SimpleEmail --> Success

    Success --> UpdateAttr[Update Brevo<br/>PDF_SENT = true]
    UpdateAttr --> End([End])

    E1 --> End
    E2 --> End
    E3 --> End
    E4 --> End
    E5 --> End

    style Success fill:#90EE90
    style E1 fill:#FFB6C1
    style E2 fill:#FFB6C1
    style E3 fill:#FFA07A
    style E4 fill:#FFB6C1
    style E5 fill:#FFB6C1
    style Fallback1 fill:#FFE4B5
    style FallbackEmail fill:#FFE4B5
```

## PDF Generation Process Detail

```mermaid
flowchart LR
    subgraph Inputs
        CN[Clinic Name<br/>String]
        TPL[Template PDF<br/>apoio-momentos-dificeis.pdf]
        FONT[Fira Sans Bold<br/>FiraSans-Bold.ttf]
    end

    subgraph PDF Processing
        direction TB
        L1[Load PDF<br/>PDFDocument.load] --> L2[Register Fontkit<br/>pdfDoc.registerFontkit]
        L2 --> L3[Embed Font<br/>pdfDoc.embedFont]
        L3 --> L4[Get Page 7<br/>pages.length - 1]
        L4 --> L5[Calculate Position<br/>centered X, fixed Y=135]
        L5 --> L6[Draw White Rectangle<br/>Cover original text]
        L6 --> L7[Draw Clinic Name<br/>40px bold, centered]
        L7 --> L8[Save PDF<br/>pdfDoc.save]
    end

    subgraph Optimization
        direction TB
        Cache{{Font Cache<br/>Module Level}}
        Cache -.reuse on warm start.-> L3
    end

    subgraph Output
        BUF[PDF Buffer<br/>Ready for email]
    end

    CN --> L5
    TPL --> L1
    FONT --> L3
    L8 --> BUF

    style L6 fill:#ffcccc
    style L7 fill:#ccffcc
    style Cache fill:#ffffcc
    style BUF fill:#ccccff
```

## Deployment Architecture

```mermaid
graph TB
    subgraph Vercel Global Edge Network
        direction TB

        subgraph Region: Global CDN
            CDN[Static Pages<br/>Tutors, Vets, Home]
        end

        subgraph Serverless Functions<br/>Region: Auto-selected
            SF1[/api/v1/subscribe<br/>512MB, 10s timeout]
            SF2[/api/v1/pdf/download<br/>256MB, 10s timeout]
        end

        subgraph Assets<br/>Bundled in Deployment
            A1[Template PDF<br/>public/assets/]
            A2[Fonts<br/>public/fonts/]
        end
    end

    subgraph External Services
        B1[Brevo Contacts API<br/>api.brevo.com]
        B2[Brevo Email API<br/>api.brevo.com]
    end

    subgraph Vercel Environment
        ENV[Environment Variables<br/>BREVO_API_KEY<br/>BREVO_VET_WELCOME_TEMPLATE_ID<br/>JWT_SECRET]
    end

    CDN -.serves.-> Users
    SF1 --> A1
    SF1 --> A2
    SF1 --> B1
    SF1 --> B2
    SF2 --> A1
    SF2 --> A2
    ENV -.config.-> SF1
    ENV -.config.-> SF2

    B2 -.email delivery.-> Users[End Users]

    style SF1 fill:#ff6b6b
    style SF2 fill:#feca57
    style ENV fill:#48dbfb
    style B1 fill:#4ecdc4
    style B2 fill:#4ecdc4
```

## Data Flow - Brevo Contact Attributes

```mermaid
erDiagram
    SUBSCRIPTION_PAYLOAD ||--|| BREVO_CONTACT : creates
    BREVO_CONTACT ||--o| PDF_METADATA : generates

    SUBSCRIPTION_PAYLOAD {
        string email
        string listName
        string clinicName_optional
        string website_honeypot
        string phone_honeypot
        string company_honeypot
        number formLoadTime
        number formSubmitTime
        number interactionCount
        boolean hasFocusEvents
        boolean hasMouseMovement
    }

    BREVO_CONTACT {
        string EMAIL PK
        string CLINIC_NAME "vets only"
        datetime SUBSCRIBED_AT
        boolean PDF_SENT "vets only"
        number LIST_ID FK
    }

    PDF_METADATA {
        string clinicName
        string email
        datetime generatedAt
        string watermarkText
        number fileSizeBytes
    }
```

## Performance Optimization - Cold vs Warm Start

```mermaid
gantt
    title Serverless Function Performance Timeline
    dateFormat SSS
    axisFormat %Lms

    section Cold Start (First Request)
    Function Init :a1, 000, 200ms
    Font Load :a2, after a1, 300ms
    Template Load :a3, after a1, 150ms
    PDF Processing :a4, after a2, 400ms
    Brevo Email API :a5, after a4, 500ms
    Total Cold Start :milestone, after a5

    section Warm Start (Cached)
    Function Init :b1, 000, 50ms
    Font (Cached) :b2, after b1, 10ms
    Template Load :b3, after b1, 150ms
    PDF Processing :b4, after b2, 400ms
    Brevo Email API :b5, after b4, 500ms
    Total Warm Start :milestone, after b5
```

## Integration Options Comparison

```mermaid
quadrantChart
    title Integration Strategy Evaluation
    x-axis Low Complexity --> High Complexity
    y-axis Low Value --> High Value
    quadrant-1 "Worth Considering"
    quadrant-2 "Quick Wins"
    quadrant-3 "Avoid"
    quadrant-4 "Strategic Investment"

    "Immediate Transactional": [0.3, 0.85]
    "On-Demand Download": [0.5, 0.65]
    "Brevo Automation + Webhook": [0.8, 0.70]
    "Pre-generated PDFs": [0.2, 0.40]
    "Batch Processing": [0.6, 0.50]
    "CDN-hosted Downloads": [0.4, 0.55]
```

## Security Layers

```mermaid
flowchart TD
    U[User Request] --> L1{Layer 1:<br/>Input Validation}

    L1 -->|Reject| R1[❌ 400 Invalid Input]
    L1 -->|Pass| L2{Layer 2:<br/>Honeypot Check}

    L2 -->|Reject| R2[❌ 400 Bot Detected]
    L2 -->|Pass| L3{Layer 3:<br/>Temporal Validation}

    L3 -->|Reject| R3[❌ 400 Too Fast/Slow]
    L3 -->|Pass| L4{Layer 4:<br/>Behavioral Check}

    L4 -->|Reject| R4[❌ 400 No Human Behavior]
    L4 -->|Pass| L5{Layer 5:<br/>Rate Limiting}

    L5 -->|Reject| R5[❌ 429 Rate Limited]
    L5 -->|Pass| L6{Layer 6:<br/>API Key Auth}

    L6 -->|Reject| R6[❌ 401 Unauthorized]
    L6 -->|Pass| L7[✅ Process Request]

    L7 --> L8{Layer 7:<br/>Output Sanitization}
    L8 --> Success[✅ Secure Response]

    style L1 fill:#e3f2fd
    style L2 fill:#e3f2fd
    style L3 fill:#e3f2fd
    style L4 fill:#e3f2fd
    style L5 fill:#e3f2fd
    style L6 fill:#e3f2fd
    style L8 fill:#e3f2fd
    style Success fill:#c8e6c9
    style R1 fill:#ffcdd2
    style R2 fill:#ffcdd2
    style R3 fill:#ffcdd2
    style R4 fill:#ffcdd2
    style R5 fill:#ffcdd2
    style R6 fill:#ffcdd2
```

## Testing Strategy Pyramid

```mermaid
graph TB
    subgraph Testing Layers
        direction TB
        E2E[E2E Tests<br/>Cypress<br/>~5 critical paths]
        INT[Integration Tests<br/>API Routes + Services<br/>~20 scenarios]
        UNIT[Unit Tests<br/>Pure Functions<br/>~50 test cases]
    end

    subgraph Test Scope
        direction TB
        TE2E[Full User Journey<br/>Browser Automation]
        TINT[API Contracts<br/>Service Integration]
        TUNIT[Function Logic<br/>Edge Cases]
    end

    E2E -.covers.-> TE2E
    INT -.covers.-> TINT
    UNIT -.covers.-> TUNIT

    style E2E fill:#ff6b6b,color:#fff
    style INT fill:#feca57
    style UNIT fill:#48dbfb
```

---

## Quick Reference: Component Locations

| Component | File Path | Responsibility |
|-----------|-----------|----------------|
| **Subscription API** | `src/app/api/v1/subscribe/route.ts` | HTTP handler, error mapping |
| **Subscription Service** | `src/services/subscriptionService.ts` | Business logic, Brevo integration |
| **PDF Service** | `src/services/pdfPersonalization.ts` | PDF generation, watermarking |
| **Shared Schemas** | `src/shared/schemas.ts` | Zod validation schemas |
| **Bot Detection Config** | `src/config/botDetection.ts` | Bot detection thresholds |
| **Template PDF** | `public/assets/apoio-momentos-dificeis.pdf` | Original PDF template |
| **Fonts** | `public/fonts/FiraSans-*.ttf` | Custom fonts for PDF |

---

**Document Version**: 1.0
**Last Updated**: 2025-10-09
**Related**: [PDF Personalization Architecture](./15-pdf-personalization-integration.md)
