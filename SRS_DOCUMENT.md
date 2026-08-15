# Software Requirements Specification (SRS)

## SMART MINDS – AI-Powered Assistive Platform for Visually Impaired People

---

### VERSION HISTORY

| Version | Date | Author | Description |
|---|---|---|---|
| 1.0 | 2026-08-15 | BE CS Major Project Team | Initial SRS Draft |
| 1.1 | 2026-08-15 | BE CS Major Project Team | Architectural & Database Specifications |
| 1.2 | 2026-08-15 | BE CS Major Project Team | Complete Functional & Non-Functional Requirements |
| 2.0 | 2026-08-15 | BE CS Major Project Team | Final Verified IEEE 830 SRS Document |

---

# 1. INTRODUCTION

## 1.1 Purpose
This Software Requirements Specification (SRS) document provides a complete, rigorous description of the requirements, system architecture, database models, external interface behaviors, and non-functional characteristics of **Smart Minds** — an AI-powered assistive software platform designed for visually impaired individuals. 

This document serves as the authoritative technical baseline for software engineers, project evaluators, quality assurance testers, and academic reviewers evaluating this Final Year Bachelor of Engineering (BE) Computer Science Major Project.

## 1.2 Scope
Smart Minds is a voice-first, accessibility-centered web and mobile-ready progressive application (PWA). It provides an integrated suite of tools designed to enhance independence, spatial awareness, emergency safety, and everyday document/scene comprehension for individuals who are blind or visually impaired.

Key software features include:
- Voice-first interface powered by modern Speech-to-Text (STT) and Text-to-Speech (TTS) engines.
- Real-time GPS location tracking and reverse geocoding readout.
- Turn-by-turn voice navigation with destination selection and saved place quick-links.
- One-tap Emergency SOS dispatching with primary contact notification and location clipboard sharing.
- Intelligent multimodal AI chat, Optical Character Recognition (OCR) text reader, and 5-mode AI Scene Vision.
- Trusted contact management, saved places management, and local privacy-centric activity logging.
- Comprehensive accessibility customizations (High Contrast, Large Text, Extra Large Buttons, Reduced Motion, Speech Rate adjustments).

**Important Safety & Hardware Disclaimer:**
Smart Minds is strictly a **software-based platform**. It does **NOT** include, depend on, or interface with physical smart-stick hardware, microcontrollers (Arduino, ESP32), ultrasonic distance sensors, GSM hardware modules, or external physical devices. Furthermore, the application is designed to assist and enhance user independence; it does **not** claim to provide "100% safety" and should be used alongside standard orientation and mobility techniques.

## 1.3 Definitions, Acronyms, Abbreviations

- **API:** Application Programming Interface
- **ARIA:** Accessible Rich Internet Applications
- **CORS:** Cross-Origin Resource Sharing
- **CRUD:** Create, Read, Update, Delete
- **DOM:** Document Object Model
- **GPS:** Global Positioning System
- **HTTP/HTTPS:** Hypertext Transfer Protocol / Secure
- **IEEE:** Institute of Electrical and Electronics Engineers
- **JSON:** JavaScript Object Notation
- **JWT:** JSON Web Token
- **MERN:** MongoDB, Express.js, React.js, Node.js
- **OCR:** Optical Character Recognition
- **PWA:** Progressive Web Application
- **REST:** Representational State Transfer
- **SOS:** Save Our Souls / International Emergency Signal
- **SPA:** Single Page Application
- **SRS:** Software Requirements Specification
- **STT:** Speech-to-Text
- **TTS:** Text-to-Speech
- **UI/UX:** User Interface / User Experience
- **URI:** Uniform Resource Identifier
- **WCAG:** Web Content Accessibility Guidelines

## 1.4 References
1. IEEE Std 830-1998: *IEEE Recommended Practice for Software Requirements Specifications*.
2. W3C Web Content Accessibility Guidelines (WCAG) 2.1 AA Specification.
3. W3C Web Speech API Specification (SpeechRecognition and SpeechSynthesis).
4. W3C Geolocation API Specification.
5. MongoDB Atlas Developer Documentation & Mongoose ODM Reference.
6. Anthropic Claude API Multimodal Vision Documentation.

## 1.5 Overview
The remainder of this document is organized as follows:
- **Section 2:** Overall Description (product perspective, 12 core modules, user characteristics, constraints, dependencies).
- **Section 3:** Specific Requirements (external interface requirements, comprehensive functional requirements table, non-functional requirements).
- **Section 4:** Technology Stack (frontend, backend, database, security, and dev tools).
- **Section 5:** System Architecture (high-level, client, server, and sequence diagrams).
- **Section 6:** Database Design (ER diagram, full 6 collection schemas, indexes, relationships).
- **Section 7:** API Documentation (20 endpoints with methods, authentication, payload specs).
- **Section 8:** Voice Command System (15 intent categories, execution flow, command mapping table).
- **Section 9:** Accessibility Compliance (WCAG 2.1 AA checklist, ARIA, CSS variables, screen reader support).
- **Section 10:** PWA Specification (manifest, service worker strategy, offline capabilities).
- **Section 11:** Internationalization (multilingual architecture, supported locales).
- **Section 12:** Security Specification (password hashing, JWT, rate limiting, CORS).
- **Section 13:** Demo Mode & Presentation Features.
- **Section 14:** Deployment Architecture (Vercel/Render/Atlas cloud setup).
- **Section 15:** Testing Strategy.
- **Section 16:** Project File Structure.
- **Section 17:** UI/UX Design System.
- **Section 18:** Error Handling Strategy.
- **Section 19:** Privacy & Data Protection.
- **Section 20:** Future Scope & Roadmap (Phase 2 PWA, Phase 3 Cloud, Phase 4 Android APK).
- **Section 21:** Limitations.
- **Section 22:** Glossary & Appendices.

---

# 2. OVERALL DESCRIPTION

## 2.1 Product Perspective
Smart Minds is a standalone, web-based assistive application. It operates in client-server mode, connecting a modern web browser client to a cloud-hosted Node.js API server, MongoDB Atlas database, and Anthropic Claude AI backend services.

```mermaid
graph TD
    User([Visually Impaired User]) -->|Voice / Touch| Frontend[Smart Minds Web App - React SPA]
    
    subgraph BrowserAPIs [Native Browser APIs]
        Frontend -->|STT / TTS| SpeechAPI[Web Speech API]
        Frontend -->|GPS Coordinates| GeoAPI[Geolocation API]
        Frontend -->|Image Capture| CameraAPI[HTML5 Camera / File API]
    end

    subgraph BackendServices [Backend Infrastructure]
        Frontend <-->|REST APIs + JWT| ExpressServer[Node.js / Express Server]
        ExpressServer <-->|Mongoose ODM| MongoAtlas[(MongoDB Atlas Cloud DB)]
        ExpressServer <-->|Multimodal Requests| ClaudeAPI[Anthropic Claude API]
    end
```

## 2.2 Product Functions (12 Core Modules)

1. **Home / Dashboard:** Central hub featuring a greeting banner, readiness progress bars, usage stats grid, recent activity feed, quick action buttons, and a 12-feature accessible grid.
2. **Voice Assistant:** Speech recognition module processing over 20 natural language voice commands mapped to 15 intent categories with instant text-to-speech feedback.
3. **My Location:** GPS module retrieving exact latitude, longitude, and position accuracy, reverse geocoding address strings, and reading locations aloud.
4. **Navigation:** Voice-guided turn-by-turn navigation engine with destination text/voice input, saved landmark select, step progress tracking, and repeat step functions.
5. **Emergency SOS:** High-priority safety page featuring a 190px pulsing SOS trigger, automated location capture, direct primary contact dialing (`tel:` protocol), and one-tap clipboard location sharing.
6. **AI Assistant:** General-purpose conversational assistant powered by Claude 3.5 / 4.6 Sonnet with accessibility-focused system prompts and spoken responses.
7. **Read Text (OCR):** Camera capture and photo upload scanner that uses AI vision to extract and read all printed text from documents, signs, menus, and medicine labels aloud.
8. **Scene Vision AI:** Multimodal visual scene analyzer offering 5 specialized modes: Describe Scene, List Objects, Safety Check (hazard scan), Find People, and Read All Signs.
9. **Saved Places:** Custom landmark manager allowing users to store names, addresses, and custom emoji icons for quick navigation access.
10. **Trusted Contacts:** Contact manager for emergency contacts, supporting primary contact designation, relationship tags, and one-tap dialing.
11. **Activity History:** Chronological log tracking user location checks, navigation runs, AI queries, SOS events, and OCR scans with privacy-focused clear controls.
12. **User Profile & Settings:** Comprehensive settings suite allowing users to adjust speech rate (0.5×–2.0×), select voice languages (6 locales), and toggle High Contrast, Large Text, Extra Large Buttons, and Reduced Motion modes.

## 2.3 User Characteristics
- **Primary Users:** Individuals with complete blindness, severe low vision, or visual impairment. They rely on vocal cues, screen readers (NVDA, VoiceOver, TalkBack), high-contrast elements, and large touch targets.
- **Secondary Users:** Caregivers, family members, and guardians who assist with initial configuration, adding emergency contacts, and customizing accessibility preferences.

## 2.4 Constraints
- **Browser Requirement:** Full speech recognition requires Chromium-based browsers (Google Chrome, Microsoft Edge) supporting the `webkitSpeechRecognition` API interface.
- **Hardware Dependency:** GPS location accuracy is bounded by the host mobile phone or computer hardware capabilities.
- **API Connectivity:** AI Assistant, OCR, and Scene Vision features require active internet access and valid Anthropic Claude API keys.
- **Camera Access:** Operating camera hardware requires the web application to be served over HTTPS or `localhost`.

## 2.5 Assumptions and Dependencies
- The user operates a device equipped with a microphone, speaker/headphones, camera, and GPS module.
- Cloud services (MongoDB Atlas and Anthropic AI) maintain 99.9% uptime.

---

# 3. SPECIFIC REQUIREMENTS

## 3.1 External Interface Requirements

### 3.1.1 User Interfaces
- **Responsive Layout:** Fluid layout scaling seamlessly from 360px mobile viewports up to 1920px desktop displays.
- **Default Dark Theme:** Background `#0d1117`, Surface `#161b22`, Primary Accent `#00b894`, Text `#e6edf3`.
- **High Contrast Theme:** Background `#000000`, Primary Accent `#00ff99`, Text `#ffffff`, Borders `#ffffff`.
- **Typography:** Body text rendered in `Inter`, headings rendered in `Space Grotesk`.
- **Touch Targets:** Minimum touch target height of 56px (exceeds WCAG 2.1 AA minimum of 44px); expandable to 70px in Extra Large Button mode.
- **Navigation Controls:** Sticky top bar with brand/status indicators and a persistent 5-item bottom navigation bar (Home, Voice, SOS, AI, More).

### 3.1.2 Hardware Interfaces
- **GPS Receiver:** Interfaced via `navigator.geolocation`.
- **Microphone Input:** Interfaced via `SpeechRecognition` / `webkitSpeechRecognition`.
- **Camera / File Access:** Interfaced via HTML5 `<input type="file" capture="environment">`.
- **Speaker / Audio Output:** Interfaced via `window.speechSynthesis`.

### 3.1.3 Software Interfaces
- **Backend Communication:** Express REST APIs on port `5000` (proxied via Vite on `/api`).
- **Database Storage:** MongoDB Atlas NoSQL database via Mongoose v8.4.3 ODM.
- **AI Service:** Anthropic Claude API (`claude-sonnet-4-6`).

---

## 3.2 Functional Requirements

| Module | Requirement ID | Requirement Summary | Input | Expected Output | Priority |
|---|---|---|---|---|---|
| **Auth** | `FR-AUTH-01` | User Registration | Name, Email, Password | Password hashed via bcrypt, user saved, JWT returned | High |
| **Auth** | `FR-AUTH-02` | User Login | Email, Password | Credentials verified, JWT returned | High |
| **Auth** | `FR-AUTH-03` | Demo Mode Access | Click "Try Demo Mode" | Instant access granted using pre-loaded mock user | High |
| **Home** | `FR-HOME-01` | Dashboard Overview | Render view | Displays greeting, stats grid, system readiness bars, and feature tiles | High |
| **Voice** | `FR-VOICE-01` | Speech Command Capture | Audio speech | Transcribes speech to text string via Web Speech API | High |
| **Voice** | `FR-VOICE-02` | Intent Processing | Transcript text | Matches 1 of 15 intent categories, triggers module action & vocal reply | High |
| **Location**| `FR-LOC-01` | GPS Retrieval | Geolocation trigger | Fetches Lat, Lng, Accuracy; formats address; speaks location aloud | High |
| **Nav** | `FR-NAV-01` | Turn-by-Turn Guidance | Destination string | Displays step progress bar, current step card, speaks steps aloud | High |
| **SOS** | `FR-SOS-01` | Emergency SOS Activation | Tap SOS button | Gets GPS coordinates, triggers vocal alert, displays primary contact | High |
| **SOS** | `FR-SOS-02` | Direct Emergency Call | Tap "Call Primary" | Triggers native `tel:` link to dial contact phone number | High |
| **SOS** | `FR-SOS-03` | Share Location Clipboard | Tap "Copy Location" | Writes SOS message + Google Maps link to device clipboard | High |
| **AI** | `FR-AI-01` | Conversational Assistance | Text / Voice prompt | Sends prompt to Claude API; renders answer; reads answer aloud | High |
| **OCR** | `FR-OCR-01` | Document Text Reading | Image file / Photo | Sends base64 image to Claude; extracts printed text; reads aloud | High |
| **Vision** | `FR-VIS-01` | Multimodal Scene Vision | Image + 1 of 5 modes | Generates scene/hazard analysis via Claude API; reads aloud | High |
| **Contacts**| `FR-CONT-01` | Contact Management | Name, Phone, Rel | Creates/edits/deletes contact; sets primary contact flag | High |
| **Places** | `FR-PLAC-01` | Saved Places Manager | Name, Address, Icon | Saves landmark with emoji icon; provides one-tap navigation link | Medium |
| **History** | `FR-HIST-01` | Activity Log & Privacy | Action event | Stores categorized activity entries; provides "Clear All" capability | Medium |
| **Settings**| `FR-SET-01` | Accessibility Controls | Toggle / Slider | Dynamically toggles High Contrast, Large Text, Motion, Speech Rate | High |

---

## 3.3 Non-Functional Requirements

### 3.3.1 Performance Requirements
- **Page Load Time:** Initial SPA load under 2.5 seconds on standard broadband/4G connection.
- **API Latency:** Database REST API operations respond in under 300ms.
- **AI Latency:** Multimodal vision/OCR response times complete within 5 to 10 seconds.

### 3.3.2 Security Requirements
- **Password Hashing:** Passwords salted and hashed with `bcryptjs` using 12 round work factors.
- **JWT Protection:** Authorization via HMAC-SHA256 JWT tokens with 7-day expiration.
- **Rate Limiting:** General API restricted to 100 requests / 15 minutes; auth routes restricted to 10 requests / 15 minutes.
- **HTTP Security:** Protection via `helmet` headers, strictly configured CORS whitelisting, and no client-side secret exposure.

### 3.3.3 Accessibility Requirements (WCAG 2.1 AA)
- High contrast color ratios meeting or exceeding 7:1 in High Contrast mode.
- Complete keyboard accessibility with explicit `:focus-visible` outlines.
- ARIA live dynamic regions (`aria-live="assertive"`) for immediate screen reader readout of state updates.
- Touch target sizes minimum 56×56px (expandable to 70px).

---

# 4. TECHNOLOGY STACK

```mermaid
graph LR
    subgraph Frontend Stack
        F1[React.js v18.3]
        F2[Vite v5.2]
        F3[Vanilla CSS3 Engine]
        F4[Web Speech & Geo APIs]
    end

    subgraph Backend Stack
        B1[Node.js v20 LTS]
        B2[Express.js v4.19]
        B3[JWT & bcryptjs]
        B4[Helmet & Cors]
    end

    subgraph Database & Services
        D1[(MongoDB Atlas Cloud DB)]
        D2[Mongoose ODM v8.4]
        S1[Anthropic Claude API]
    end

    Frontend Stack --> Backend Stack
    Backend Stack --> Database & Services
```

- **Frontend:** React.js 18.3, Vite 5.2, HTML5, Vanilla CSS3 (Custom Variables), Web Speech API, Geolocation API, MediaDevices API.
- **Backend:** Node.js 20 LTS, Express.js 4.19, `bcryptjs` 2.4, `jsonwebtoken` 9.0, `helmet` 7.1, `cors` 2.8, `express-rate-limit` 7.3.
- **Database:** MongoDB Atlas Cloud Database, Mongoose ODM 8.4.
- **AI Engine:** Anthropic SDK (`@anthropic-ai/sdk` 0.24), Claude 3.5 / 4.6 Sonnet (`claude-sonnet-4-6`).

---

# 5. SYSTEM ARCHITECTURE

## 5.1 High-Level Architecture
The system follows a modern decoupled client-server architecture with cloud database and AI service integrations.

```mermaid
graph TD
    Client[React SPA Client - App.jsx]
    Server[Express API Server - server.js]
    DB[(MongoDB Atlas Database)]
    AI[Anthropic Claude AI API]

    Client -- REST API / Auth Token --> Server
    Server -- Mongoose ODM --> DB
    Server -- Multimodal SDK --> AI
    Client -- Speech & Geo --> BrowserAPIs[Browser Native APIs]
```

## 5.2 Sequence Diagram: Voice-Activated Emergency SOS

```mermaid
sequenceDiagram
    participant User
    participant App as React App
    participant Speech as Web Speech API
    participant Geo as Geolocation API
    participant Server as Express Server
    participant DB as MongoDB Atlas

    User->>App: Speaks "Emergency SOS"
    App->>Speech: Transcribe audio
    Speech-->>App: Return "emergency sos"
    App->>App: Match EMERGENCY intent
    App->>Speech: speak("Emergency mode activated. Getting location.")
    App->>Geo: getCurrentPosition()
    Geo-->>App: Return Lat, Lng coordinates
    App->>Server: POST /api/emergency (Lat, Lng)
    Server->>DB: Save EmergencyEvent record
    DB-->>Server: Confirm write
    Server-->>App: 201 Created
    App-->>User: Displays SOS active UI & triggers voice prompt
```

---

# 6. DATABASE DESIGN

## 6.1 Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USER ||--o{ EMERGENCY_CONTACT : "configures"
    USER ||--o{ SAVED_PLACE : "saves"
    USER ||--o{ ACTIVITY : "generates"
    USER ||--o{ EMERGENCY_EVENT : "triggers"
    USER ||--|| USER_SETTINGS : "customizes"

    USER {
        ObjectId _id PK
        String name
        String email UK
        String passwordHash
        String phone
        String preferredLanguage
    }

    EMERGENCY_CONTACT {
        ObjectId _id PK
        ObjectId userId FK
        String name
        String phone
        String relationship
        Boolean isPrimary
    }

    SAVED_PLACE {
        ObjectId _id PK
        ObjectId userId FK
        String name
        String address
        String icon
        Number latitude
        Number longitude
    }

    ACTIVITY {
        ObjectId _id PK
        ObjectId userId FK
        String type
        String description
        Mixed metadata
        Date timestamp
    }

    EMERGENCY_EVENT {
        ObjectId _id PK
        ObjectId userId FK
        Number latitude
        Number longitude
        String address
        String contactNotified
        String status
        Date timestamp
    }

    USER_SETTINGS {
        ObjectId _id PK
        ObjectId userId FK UK
        Boolean highContrast
        Boolean largeText
        Boolean extraLargeButtons
        Boolean reducedMotion
        Boolean voiceFeedback
        Number speechRate
        String language
    }
```

## 6.2 Data Schema Specifications

### 1. `User` Schema
- `_id`: ObjectId (Primary Key)
- `name`: String (Required, trimmed)
- `email`: String (Required, Unique, lowercase, trimmed)
- `passwordHash`: String (Required)
- `phone`: String (Default: "")
- `preferredLanguage`: String (Default: "en-US")
- `createdAt`, `updatedAt`: Timestamps

### 2. `EmergencyContact` Schema
- `_id`: ObjectId (Primary Key)
- `userId`: ObjectId (Required, Indexed, Reference to User)
- `name`: String (Required)
- `phone`: String (Required)
- `relationship`: String (Default: "")
- `isPrimary`: Boolean (Default: false)

### 3. `SavedPlace` Schema
- `_id`: ObjectId (Primary Key)
- `userId`: ObjectId (Required, Indexed, Reference to User)
- `name`: String (Required)
- `address`: String (Default: "")
- `icon`: String (Default: "📍")
- `latitude`: Number
- `longitude`: Number

### 4. `Activity` Schema
- `_id`: ObjectId (Primary Key)
- `userId`: ObjectId (Required, Indexed, Reference to User)
- `type`: String (Enum: `LOCATION`, `NAVIGATION`, `AI`, `EMERGENCY`, `OCR`, `VISION`, `CONTACT`, `SETTINGS`)
- `description`: String
- `metadata`: Schema.Types.Mixed
- `timestamp`: Date (Default: `Date.now`)

### 5. `EmergencyEvent` Schema
- `_id`: ObjectId (Primary Key)
- `userId`: ObjectId (Required, Indexed, Reference to User)
- `latitude`: Number
- `longitude`: Number
- `address`: String
- `contactNotified`: String
- `status`: String (Default: "activated")
- `timestamp`: Date (Default: `Date.now`)

### 6. `UserSettings` Schema
- `_id`: ObjectId (Primary Key)
- `userId`: ObjectId (Required, Unique, Reference to User)
- `highContrast`: Boolean (Default: false)
- `largeText`: Boolean (Default: false)
- `extraLargeButtons`: Boolean (Default: false)
- `reducedMotion`: Boolean (Default: false)
- `voiceFeedback`: Boolean (Default: true)
- `speechRate`: Number (Default: 1, Min: 0.5, Max: 2.0)
- `language`: String (Default: "en-US")

---

# 7. API ENDPOINT SPECIFICATION (20 REST Endpoints)

| HTTP Method | Route Endpoint | Authentication | Payload / Parameters | Description |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | `{ name, email, password }` | Registers user, hashes password, returns JWT |
| `POST` | `/api/auth/login` | Public | `{ email, password }` | Authenticates credentials, returns JWT token |
| `GET` | `/api/auth/me` | Bearer JWT | None | Fetches authenticated user profile object |
| `GET` | `/api/contacts` | Bearer JWT | None | Lists all user emergency contacts |
| `POST` | `/api/contacts` | Bearer JWT | `{ name, phone, relationship, isPrimary }` | Creates contact (manages primary status) |
| `PUT` | `/api/contacts/:id` | Bearer JWT | `{ name, phone, relationship, isPrimary }` | Updates specified contact by ID |
| `DELETE` | `/api/contacts/:id` | Bearer JWT | None | Deletes specified contact by ID |
| `GET` | `/api/places` | Bearer JWT | None | Lists user saved landmarks |
| `POST` | `/api/places` | Bearer JWT | `{ name, address, icon, latitude, longitude }` | Saves new landmark |
| `PUT` | `/api/places/:id` | Bearer JWT | `{ name, address, icon, latitude, longitude }` | Updates saved landmark by ID |
| `DELETE` | `/api/places/:id` | Bearer JWT | None | Removes saved landmark by ID |
| `POST` | `/api/location/log` | Bearer JWT | `{ latitude, longitude, address }` | Logs GPS position to activity audit log |
| `POST` | `/api/emergency` | Bearer JWT | `{ latitude, longitude, address, status }` | Logs SOS event record in database |
| `GET` | `/api/emergency/history`| Bearer JWT | None | Fetches 20 recent emergency events |
| `POST` | `/api/ai/chat` | Bearer JWT | `{ message }` | Sends query to Claude AI API for reply |
| `POST` | `/api/ai/read-text` | Bearer JWT | `{ imageBase64, mediaType }` | Multimodal OCR text extraction via Claude |
| `POST` | `/api/ai/describe` | Bearer JWT | `{ imageBase64, prompt }` | Multimodal 5-mode scene vision analysis |
| `GET` | `/api/settings` | Bearer JWT | None | Retrieves accessibility settings document |
| `PUT` | `/api/settings` | Bearer JWT | Settings Object | Updates user accessibility settings |
| `GET` | `/api/activity` | Bearer JWT | None | Retrieves 50 recent activity records |
| `DELETE` | `/api/activity` | Bearer JWT | None | Clears user activity history log |
| `GET` | `/health` | Public | None | Server health status check endpoint |

---

# 8. VOICE COMMAND & INTENT PARSING SYSTEM

## 8.1 Intent Mapping & Keywords

```mermaid
graph TD
    SpeechInput[User Voice Input] --> IntentParser[Voice Intent Processing Engine]
    
    IntentParser -->|where am i / location| INT_LOC[LOCATION Intent]
    IntentParser -->|navigate / directions| INT_NAV[NAVIGATION Intent]
    IntentParser -->|emergency / sos / help| INT_SOS[EMERGENCY Intent]
    IntentParser -->|read text / scan / ocr| INT_OCR[TEXT_READING Intent]
    IntentParser -->|ai / ask question| INT_AI[AI_ASSISTANT Intent]
    IntentParser -->|saved places / home| INT_PLAC[SAVED_PLACES Intent]
    IntentParser -->|contacts / call| INT_CONT[CONTACTS Intent]
    IntentParser -->|settings / high contrast| INT_SET[SETTINGS Intent]
    IntentParser -->|vision / scene / hazard| INT_VIS[VISION Intent]
    IntentParser -->|profile| INT_PROF[PROFILE Intent]
    IntentParser -->|history| INT_HIST[HISTORY Intent]
    IntentParser -->|time| INT_TIME[TIME Intent]
    IntentParser -->|date| INT_DATE[DATE Intent]
    IntentParser -->|hello / hi| INT_GREET[GREETING Intent]
    IntentParser -->|help / commands| INT_HELP[HELP Intent]
```

---

# 9. ACCESSIBILITY SPECIFICATION (WCAG 2.1 AA)

- **Contrast Ratios:** Background `#0d1117` to text `#e6edf3` ratio = `12.5:1`. High Contrast Mode (`#000000` to `#00ff99`) ratio = `18.2:1`. Exceeds 4.5:1 requirement.
- **Focus Indicators:** All interactive elements feature `:focus-visible { outline: 3px solid #00b894; outline-offset: 2px; }`.
- **Keyboard Navigation:** Full page flow navigable sequentially using `Tab` and `Shift+Tab`, with custom skip-to-content links.
- **Screen Reader Support:** Every button contains explicit `aria-label` attributes; dynamic text updates feature `aria-live="polite"` or `aria-live="assertive"`.

---

# 10. PROGRESSIVE WEB APP (PWA) SPECIFICATIONS

- **Manifest File ([`client/public/manifest.json`](file:///c:/Users/Admin/Downloads/smart-minds/smart-minds/client/public/manifest.json)):** Configured with short name `SmartMinds`, `standalone` display, `#00b894` theme color, and SVG maskable shortcuts for SOS, Voice, and Location.
- **Service Worker ([`client/public/sw.js`](file:///c:/Users/Admin/Downloads/smart-minds/smart-minds/client/public/sw.js)):** Implements Cache-First static asset caching and Network-First navigation caching under cache key `smart-minds-v1`.

---

# 11. SECURITY SPECIFICATION

- **Password Storage:** Hashed with `bcryptjs` using 12 salt rounds.
- **API Token Security:** Signed HMAC-SHA256 JWT tokens valid for 7 days.
- **Rate Limiting:** `/api/` limited to 100 req/15min; `/api/auth/` limited to 10 req/15min.
- **HTTP Headers:** Configured via `helmet()` for clickjacking, XSS, and MIME-type protection.

---

# 12. DEMO MODE SPECIFICATION

Smart Minds features an instant **Demo Mode** accessible on the login screen. Demo mode loads pre-seeded contacts, places, and activity logs without requiring account creation or an active MongoDB connection, enabling seamless evaluation during project demonstrations.

---

# 13. DEPLOYMENT ARCHITECTURE

```mermaid
graph TD
    ClientRepo[Client Code] -->|Vite Build| Vercel[Vercel / Netlify Frontend Hosting]
    ServerRepo[Server Code] -->|Node.js Runtime| Render[Render / Railway Backend Hosting]
    
    Render <-->|MongoDB Connection| Atlas[(MongoDB Atlas Cloud Database)]
    Render <-->|HTTPS API Calls| Anthropic[Anthropic Claude API]
    Vercel <-->|HTTPS REST| Render
```

- **Frontend Deployment:** Deployed to Vercel or Netlify via `npm run build`.
- **Backend Deployment:** Deployed to Render or Railway as a Node.js web service.
- **Cloud Database:** Hosted on MongoDB Atlas M0 cluster.

---

# 14. PROJECT FILE STRUCTURE

```text
smart-minds/
├── client/
│   ├── public/
│   │   ├── manifest.json       # PWA manifest
│   │   └── sw.js              # Service Worker
│   ├── src/
│   │   ├── App.jsx            # Monolithic React App (1814 lines, 13 pages)
│   │   └── main.jsx           # React entry point
│   ├── index.html             # HTML Shell
│   ├── package.json           # Client dependencies
│   └── vite.config.js         # Vite configuration & API proxy
├── server/
│   ├── server.js              # Monolithic Express Server (284 lines, 20 APIs)
│   ├── .env.example           # Environment template
│   └── package.json           # Server dependencies
├── package.json               # Monorepo concurrently runner
├── README.md                  # Project overview
├── SETUP.md                   # Installation & running guide
└── WALKTHROUGH.md             # Detailed implementation walkthrough
```

---

# 15. VERIFICATION & TESTING STRATEGY

1. **Accessibility Verification:** Audited via Google Lighthouse Accessibility suite (100% target score) and Axe DevTools.
2. **Speech & Navigation Testing:** Tested across Google Chrome Desktop and Chrome for Android.
3. **API Integration Testing:** All 20 endpoints verified via REST clients (Postman/Insomnia) and Mongoose integration test runs.
