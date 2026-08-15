# SMART MINDS: Comprehensive Walkthrough & Technical Implementation Document

> **AI-Powered Assistive Platform for Visually Impaired People**  
> *Final Year BE Computer Science Major Project*  
> **Repository Path:** `c:/Users/Admin/Downloads/smart-minds/smart-minds/`

---

## 1. Executive Summary & Project Overview

**SMART MINDS** is a voice-first, software-only assistive web application engineered to enable visually impaired users to interact with smart devices independently. The application completely eliminates reliance on physical hardware sticks, sensors, or microcontroller modules (such as Arduino/ESP32). Instead, it utilizes modern web standards, browser capabilities (Web Speech API, Geolocation API, MediaDevices), cloud-hosted database persistence (MongoDB Atlas), and multimodal artificial intelligence (Anthropic Claude 3.5 / 4.6 Sonnet).

### 1.1 Project Objectives
- **Voice-First Paradigm:** Primary interaction via spoken commands and text-to-speech audio feedback.
- **Independence & Safety:** Real-time GPS location tracking, quick-turn turn-by-turn navigation, emergency SOS dispatching, and contact management.
- **AI Multimodal Assistance:** Camera-based Optical Character Recognition (OCR) for document/label reading and AI Vision for 5-mode scene/hazard description.
- **Universal Accessibility:** Strict adherence to WCAG 2.1 AA guidelines, feature-rich accessibility controls (High Contrast, Large Text, Extra Large Touch Targets, Reduced Motion, Speech Rate adjustments).

### 1.2 Current Implementation Status
The project is currently delivered as a fully functioning **Single-File Frontend Application + Monolithic Express Backend Architecture**.

- **Frontend Monolith:** Located at [`client/src/App.jsx`](file:///c:/Users/Admin/Downloads/smart-minds/smart-minds/client/src/App.jsx) (1,814 lines, ~97 KB). It contains the entire CSS design system, speech synthesis/recognition hooks, shared UI primitives, state management, custom client-side router, and 13 fully developed functional pages.
- **Backend Monolith:** Located at [`server/server.js`](file:///c:/Users/Admin/Downloads/smart-minds/smart-minds/server/server.js) (284 lines, ~15.8 KB). It contains express middleware, rate limiters, 6 Mongoose database schemas, JWT authentication, 20 RESTful API endpoints, and Anthropic SDK AI integrations.
- **Directory Scaffolding:** Subdirectories such as `client/src/components/`, `client/src/pages/`, `server/controllers/`, `server/models/`, `server/routes/` are scaffolded for future MVC refactoring, while the current active codebase runs out of `App.jsx` and `server.js`.
- **PWA & Offline Infrastructure:** Installed via [`client/public/manifest.json`](file:///c:/Users/Admin/Downloads/smart-minds/smart-minds/client/public/manifest.json) and service worker [`client/public/sw.js`](file:///c:/Users/Admin/Downloads/smart-minds/smart-minds/client/public/sw.js).

---

## 2. System Architecture

Smart Minds operates on a multi-tier web architecture integrating browser APIs, client-side state, a Node.js/Express application server, MongoDB Atlas cloud storage, and Anthropic Claude AI services.

```mermaid
graph TD
    subgraph Client [Client Tier - Browser / Mobile Web]
        App[App.jsx - React SPA Monolith]
        State[React State & Hooks]
        WebSpeech[Web Speech API - SpeechRecognition & Synthesis]
        GeoAPI[Browser Geolocation API]
        CameraAPI[HTML5 Media / File API]
        PWA_SW[Service Worker - sw.js]
    end

    subgraph Server [Application Server Tier - Node.js / Express]
        Express[server.js - Express App]
        AuthMW[JWT Auth Middleware]
        RateLimiter[express-rate-limit]
        Helmet[Helmet Security Headers]
    end

    subgraph Database [Database Tier]
        Mongo[(MongoDB Atlas Cloud DB)]
    end

    subgraph AIService [AI Service Tier]
        Claude[Anthropic Claude API - claude-sonnet-4-6]
    end

    App --> WebSpeech
    App --> GeoAPI
    App --> CameraAPI
    PWA_SW --> App

    App -- REST HTTP Requests --> Express
    App -- Direct Multimodal API Calls --> Claude

    Express --> RateLimiter
    Express --> Helmet
    Express --> AuthMW
    AuthMW --> Mongo
    Express -- Backend AI Integration --> Claude
```

---

## 3. Directory Structure & File Map

| File Path | Size | Description | Key Contents / Exports |
|---|---|---|---|
| [`client/src/App.jsx`](file:///c:/Users/Admin/Downloads/smart-minds/smart-minds/client/src/App.jsx) | 97.3 KB | Monolithic React Frontend | STYLES, speak(), useVoiceRecognition(), 13 Page Components, App Root Component |
| [`client/src/main.jsx`](file:///c:/Users/Admin/Downloads/smart-minds/smart-minds/client/src/main.jsx) | 213 B | React Entry Point | Mounts `<App />` onto `#root` with `React.StrictMode` |
| [`client/index.html`](file:///c:/Users/Admin/Downloads/smart-minds/smart-minds/client/index.html) | 1.1 KB | Single Page HTML Shell | Meta viewport, theme-color `#00b894`, manifest link |
| [`client/public/manifest.json`](file:///c:/Users/Admin/Downloads/smart-minds/smart-minds/client/public/manifest.json) | 932 B | PWA Web App Manifest | App identity, standalone display, SVG shortcuts (SOS, Voice, Location) |
| [`client/public/sw.js`](file:///c:/Users/Admin/Downloads/smart-minds/smart-minds/client/public/sw.js) | 951 B | Service Worker | Cache name `smart-minds-v1`, offline fallback, API bypass |
| [`client/vite.config.js`](file:///c:/Users/Admin/Downloads/smart-minds/smart-minds/client/vite.config.js) | 277 B | Vite Build Configuration | React plugin, dev server port `5173`, `/api` proxy to `http://localhost:5000` |
| [`client/package.json`](file:///c:/Users/Admin/Downloads/smart-minds/smart-minds/client/package.json) | 337 B | Frontend Manifest | React 18.3, React DOM, Vite 5.2 |
| [`server/server.js`](file:///c:/Users/Admin/Downloads/smart-minds/smart-minds/server/server.js) | 15.8 KB | Monolithic Express Server | Express setup, 6 Mongoose models, JWT middleware, 20 API endpoints |
| [`server/.env.example`](file:///c:/Users/Admin/Downloads/smart-minds/smart-minds/server/.env.example) | 812 B | Server Environment Template | MONGODB_URI, JWT_SECRET, PORT, ANTHROPIC_API_KEY, CLIENT_URL |
| [`server/package.json`](file:///c:/Users/Admin/Downloads/smart-minds/smart-minds/server/package.json) | 563 B | Backend Manifest | express, mongoose, cors, helmet, express-rate-limit, bcryptjs, jsonwebtoken, @anthropic-ai/sdk, nodemon |
| [`package.json`](file:///c:/Users/Admin/Downloads/smart-minds/smart-minds/package.json) | 480 B | Root Concurrently Runner | `npm run dev` script running client and server simultaneously |
| [`SETUP.md`](file:///c:/Users/Admin/Downloads/smart-minds/smart-minds/SETUP.md) | 6.3 KB | Beginner Setup Guide | Node.js, MongoDB Atlas creation, Anthropic API keys, execution commands |
| [`README.md`](file:///c:/Users/Admin/Downloads/smart-minds/smart-minds/README.md) | 4.8 KB | Project Overview | Features table, quick start, API endpoints, accessibility details |

---

## 4. Frontend Deep Dive (`client/src/App.jsx`)

The frontend application consists of 1,814 lines of code structured into discrete functional modules:

### 4.1 CSS Design System & Theme Engine (Lines 1–414)
The CSS styling is embedded as a template literal (`STYLES`) and injected into the DOM. It provides a complete design system:
- **Typography:** Uses Google Fonts `Inter` (body) and `Space Grotesk` (headings/branding).
- **Default Dark Palette:**
  - Background (`--bg`): `#0d1117`
  - Surfaces (`--surface`, `--surface2`): `#161b22`, `#1c2128`
  - Borders (`--border`): `#30363d`
  - Primary Accent (`--primary`, `--primary-dark`): `#00b894`, `#00856e`
  - Text Colors (`--text`, `--text-muted`, `--text-dim`): `#e6edf3`, `#8b949e`, `#6e7681`
- **Accessibility Class Toggles:**
  - `body.high-contrast`: Pure black background (`#000000`), high-contrast green (`#00ff99`), white text (`#ffffff`), thick white borders (`#ffffff`).
  - `body.large-text`: Base font size increased from `16px` to `20px`.
  - `body.extra-large-btn`: Button padding expanded to `22px 28px`, touch target minimum set to `70px`.
  - `body.reduced-motion`: Disables all transitions and keyframe animations globally.
- **Component Classes:** Layout containers, topbar, bottom navigation, cards, buttons (`btn-primary`, `btn-secondary`, `btn-danger`, `btn-ghost`), input fields, pulsing Voice Orb, 190×190px pulsing SOS button, modal bottom-sheets, AI chat bubbles, loading dot animations, toast alerts, skip links, and screen reader utility classes (`.sr-only`).

### 4.2 Web Speech Synthesis & Recognition Helpers (Lines 415–441)
- `speak(text, rate = 1, lang = "en-US")`: Cancels any active utterance on `window.speechSynthesis`, instantiates a new `SpeechSynthesisUtterance`, configures `rate`, `lang`, and `volume = 1`, and initiates vocal playback.
- `useVoiceRecognition(onResult)`: React custom hook. Instantiates `window.SpeechRecognition` or `window.webkitSpeechRecognition`. Sets `interimResults = false`, `maxAlternatives = 1`, handles `onresult` callbacks, and tracks listening status via React state.

### 4.3 Demo Data Initialization (Lines 443–460)
- `INIT_CONTACTS`: Pre-seeded emergency contacts (Mother: Priya Sharma, Father: Rajan Sharma).
- `INIT_PLACES`: Pre-seeded landmarks (Home, College, Hospital, Market near Hassan, Karnataka).
- `INIT_HISTORY`: Pre-seeded activity log containing past location, navigation, AI, SOS, and OCR events.

### 4.4 Shared Layout Components (Lines 462–479)
- `<Toast msg onClose />`: Accessible notification toast (`role="alert"`, `aria-live="assertive"`) that automatically dismisses after 3 seconds.
- `<TopBar title sub />`: Sticky top header presenting the application title, section name, and live status badge.

---

### 4.5 Comprehensive Page Component Inventory

#### 1. `HomePage` (Lines 480–644)
- **Role:** Central accessible dashboard.
- **Key Elements:** System live badge, greeting header, stats grid (12 features, 24 voice commands, 4 saved places, 97% accessibility score), quick action cards, usage trend bar chart, system readiness progress bars (Voice 92%, GPS 86%, AI 94%), recent activity feed, demo mode banner, and a 12-card grid linking to all functional modules.
- **Voice Behavior:** Automatically speaks welcome announcement upon mounting.

#### 2. `VoiceAssistantPage` (Lines 645–741)
- **Role:** Voice-first control hub.
- **Key Elements:** Interactive 130px Voice Orb with pulsing CSS animation (`orbPulse`), live listening status, transcript boxes ("You said" and "Response"), 8 quick example command buttons, scrollable conversation log.
- **Intent Recognition System:** Supports 15 intent categories via keyword matching:
  1. `LOCATION`: "where am i", "my location", "current location" → Opens Location Page.
  2. `NAVIGATION`: "navigate", "directions", "take me", "go to" → Opens Navigation Page.
  3. `EMERGENCY`: "emergency", "sos", "help me", "danger" → Opens Emergency SOS Page.
  4. `TEXT_READING`: "read text", "read this", "ocr", "scan" → Opens OCR Read Text Page.
  5. `AI_ASSISTANT`: "ai", "assistant", "ask", "question" → Opens AI Assistant Page.
  6. `SAVED_PLACES`: "saved places", "my places", "home", "college" → Opens Saved Places Page.
  7. `CONTACTS`: "contacts", "call", "emergency contact" → Opens Contacts Page.
  8. `SETTINGS`: "settings", "accessibility" → Opens Settings Page.
  9. `VISION`: "vision", "scene", "around me", "describe" → Opens Scene Vision Page.
  10. `PROFILE`: "profile", "my profile" → Opens Profile Page.
  11. `HISTORY`: "history", "activity" → Opens History Page.
  12. `TIME`: "time", "what time" → Reads current localized time aloud.
  13. `DATE`: "date", "what day" → Reads current localized date aloud.
  14. `GREETING`: "hello", "hi", "hey" → Spoken friendly welcome.
  15. `HELP`: "help", "commands" → Reads available voice commands.

#### 3. `LocationPage` (Lines 743–811)
- **Role:** Real-time GPS location readout.
- **Key Elements:** Map container placeholder, location status cards (Idle, Loading, Success, Denied, Unavailable, Unsupported), coordinate displays (Latitude, Longitude, Accuracy in meters), reverse geocoded address display, "Get My Location" refresh button, "Read Location Aloud" voice trigger.

#### 4. `NavigationPage` (Lines 813–897)
- **Role:** Step-by-step navigation assistant.
- **Key Elements:** Destination text input, saved places quick-select buttons, 5-step demo navigation progress bar, step card with active instruction readout, estimated time (~8 min) and distance (1.2 km) badges, "Repeat Step", "Next Step", and "Stop Navigation" controls.

#### 5. `EmergencyPage` (Lines 899–1003)
- **Role:** Emergency assistance dispatch hub.
- **Key Elements:** 190×190px central SOS button (red, pulsing animation in active state), pre-activation warning card, automated GPS coordinate fetch on trigger, primary contact summary card, "Call Primary Contact" (`tel:` URI handler), "Copy Location to Share" (generates Google Maps URL string copied to clipboard), emergency cancellation button.

#### 6. `AIAssistantPage` (Lines 1005–1097)
- **Role:** Conversational AI query engine powered by Anthropic Claude 3.5 / 4.6 Sonnet.
- **Key Elements:** Scrollable chat history, user/AI message bubbles, message input bar with text send and voice microphone triggers, loading dot indicator, 6 quick-question suggestion buttons.
- **Voice Output:** Spoken readout of AI replies via `speak()`.

#### 7. `OCRPage` (Lines 1099–1198)
- **Role:** Optical Character Recognition for document and label reading.
- **Key Elements:** Image file upload button, direct camera capture button (`capture="environment"`), image preview container (max height 240px), "Extract & Read Text" action button, loading overlay, extracted text display card, "Read Aloud Again" button, "Copy Text" button.

#### 8. `VisionPage` (Lines 1200–1305)
- **Role:** Multimodal Scene Description and Hazard Assessment.
- **Key Elements:** 5 Analysis Mode Selector Buttons:
  1. *Describe Scene:* General spatial layout, objects, colors, hazards.
  2. *List Objects:* Comprehensive inventory of visible items, sizes, positions, and obstacles.
  3. *Safety Check:* Dedicated hazard scan (uneven surfaces, stairs, vehicles, safe paths).
  4. *Find People:* People count, positions, activities, and approach movement.
  5. *Read All Signs:* Structured extraction of street signs, labels, numbers, and notices.
- Image input (upload/camera), image preview, AI analysis run button, spoken readout.

#### 9. `ContactsPage` (Lines 1307–1390)
- **Role:** Trusted emergency contact management.
- **Key Elements:** Contact list items with avatars, names, relationships, phone numbers, primary status badge; one-tap call button (`tel:`), edit button, delete button; slide-up modal form with primary contact toggle.

#### 10. `PlacesPage` (Lines 1392–1474)
- **Role:** Frequent destination manager.
- **Key Elements:** Saved place list with custom emoji icon containers, names, addresses, "Navigate-to" button, edit/delete actions, slide-up modal with 15 emoji picker buttons.

#### 11. `HistoryPage` (Lines 1476–1511)
- **Role:** Activity log audit trail.
- **Key Elements:** Categorized activity items with color-coded type badges (LOCATION, NAVIGATION, AI, EMERGENCY, OCR, VISION, CONTACT), activity descriptions, timestamps, "Clear All History" button, local storage privacy disclaimer.

#### 12. `ProfilePage` (Lines 1513–1570)
- **Role:** User identity and language settings.
- **Key Elements:** Profile avatar, name, email, phone number, language selector (English US, English India, Kannada, Hindi, Tamil, Telugu), inline edit form, privacy statement card.

#### 13. `SettingsPage` (Lines 1572–1649)
- **Role:** Comprehensive accessibility customization panel.
- **Key Elements:**
  - Speech Rate Slider: Range `0.5×` to `2.0×` with "Test Voice" preview.
  - Voice Language Selector: Select dropdown for 6 supported locales.
  - Accessibility Toggles:
    1. *High Contrast Mode* (body class `high-contrast`)
    2. *Large Text Mode* (body class `large-text`)
    3. *Extra Large Buttons* (body class `extra-large-btn`)
    4. *Reduce Motion* (body class `reduced-motion`)
    5. *Voice Feedback* (global voice state switch)
    6. *Auto-Read Location* (automatic location speech on page load)

#### 14. `AuthPage` (Lines 1651–1721)
- **Role:** User authentication and onboarding.
- **Key Elements:** Sign In / Register tab switcher, name, email, password fields, validation error banner, "Try Demo Mode" button allowing instant access without account registration or backend server connection.

#### 15. Root `App` Component (Lines 1723–1814)
- **Role:** Main application entry container, state holder, and page router.
- **State Managed:** `authed`, `user`, `page`, `contacts`, `places`, `history`, `toast`, `settings`.
- **Effects:** Syncs accessibility settings object to `document.body` CSS classes.
- **Layout Shell:** Renders `<TopBar>`, page router switch, persistent `<nav className="bottom-nav">` (Home, Voice, SOS, AI, More), skip-to-content accessibility link, and `<Toast>` alerts.

---

## 5. Backend Deep Dive (`server/server.js`)

The backend is built with Node.js, Express.js, Mongoose ODM, and security middlewares:

### 5.1 Server Configuration & Security Middleware (Lines 1–25)
- **Security Headers:** `helmet()` sets standard HTTP security headers.
- **CORS Configuration:** `cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true })`.
- **Payload Parsing:** `express.json({ limit: "10mb" })` allows handling base64-encoded image payloads for OCR and Scene Vision APIs.
- **Rate Limiting:**
  - Global API Limiter (`/api/`): Maximum 100 requests per 15-minute window.
  - Auth Limiter (`/api/auth/`): Maximum 10 requests per 15-minute window to block brute-force attempts.

### 5.2 MongoDB Schemas & Mongoose Models (Lines 26–85)

```mermaid
erDiagram
    User ||--o{ EmergencyContact : "owns"
    User ||--o{ SavedPlace : "saves"
    User ||--o{ Activity : "generates"
    User ||--o{ EmergencyEvent : "triggers"
    User ||--|| UserSettings : "configures"

    User {
        ObjectId _id PK
        String name
        String email UK
        String passwordHash
        String phone
        String preferredLanguage
    }

    EmergencyContact {
        ObjectId _id PK
        ObjectId userId FK
        String name
        String phone
        String relationship
        Boolean isPrimary
    }

    SavedPlace {
        ObjectId _id PK
        ObjectId userId FK
        String name
        String address
        String icon
        Number latitude
        Number longitude
    }

    Activity {
        ObjectId _id PK
        ObjectId userId FK
        String type
        String description
        Mixed metadata
        Date timestamp
    }

    EmergencyEvent {
        ObjectId _id PK
        ObjectId userId FK
        Number latitude
        Number longitude
        String address
        String contactNotified
        String status
        Date timestamp
    }

    UserSettings {
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

### 5.3 Authentication & Activity Logger Middleware (Lines 86–99)
- `auth`: Extracts token from `Authorization: Bearer <token>` header, verifies signature via `jwt.verify` against `process.env.JWT_SECRET`, attaches `req.userId`. Returns HTTP 401 on missing or invalid tokens.
- `log(userId, type, description, metadata)`: Non-blocking asynchronous helper that creates an `Activity` document in MongoDB for auditing user operations.

### 5.4 API Route Endpoints Summary (20 Endpoints)

| HTTP Method | Route Endpoint | Middleware | Functionality Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | RateLimit | Hashes password with `bcrypt` (12 rounds), creates User & UserSettings, returns JWT token (7d expiry). |
| `POST` | `/api/auth/login` | RateLimit | Verifies credentials via `bcrypt.compare`, signs JWT token, returns user object. |
| `GET` | `/api/auth/me` | Auth | Returns authenticated user profile excluding `passwordHash`. |
| `GET` | `/api/contacts` | Auth | Returns all contacts for `req.userId`, sorted with primary contacts first. |
| `POST` | `/api/contacts` | Auth | Creates new emergency contact; if `isPrimary` is true, unsets previous primary contacts. |
| `PUT` | `/api/contacts/:id` | Auth | Updates specified contact by ID; handles primary contact status updates. |
| `DELETE` | `/api/contacts/:id` | Auth | Removes contact owned by `req.userId`. |
| `GET` | `/api/places` | Auth | Returns all saved places for `req.userId` sorted chronologically. |
| `POST` | `/api/places` | Auth | Creates new saved place (name, address, icon, lat, lng). |
| `PUT` | `/api/places/:id` | Auth | Updates specified place by ID. |
| `DELETE` | `/api/places/:id` | Auth | Removes saved place by ID. |
| `POST` | `/api/location/log` | Auth | Logs user GPS coordinates and reverse geocoded address to Activity schema. |
| `POST` | `/api/emergency` | Auth | Logs an SOS activation in `EmergencyEvent` schema and creates an emergency activity record. |
| `GET` | `/api/emergency/history` | Auth | Retrieves the 20 most recent emergency events for the user. |
| `POST` | `/api/ai/chat` | Auth | Interfaces with Anthropic SDK (`claude-sonnet-4-6`) using accessibility system prompt. |
| `POST` | `/api/ai/read-text` | Auth | Multimodal OCR endpoint; sends base64 image payload to Claude for text extraction. |
| `POST` | `/api/ai/describe` | Auth | Multimodal vision endpoint; sends base64 image + custom prompt for spatial hazard assessment. |
| `GET` | `/api/settings` | Auth | Fetches user accessibility settings (upserts default document if absent). |
| `PUT` | `/api/settings` | Auth | Updates user accessibility settings in MongoDB. |
| `GET` | `/api/activity` | Auth | Retrieves 50 most recent activity logs for `req.userId`. |
| `DELETE` | `/api/activity` | Auth | Clears all activity records for `req.userId`. |
| `GET` | `/health` | None | System health check endpoint returning server status and timestamp. |

---

## 6. Sequence Diagrams & Key Data Flows

### 6.1 Voice Command Execution Flow
```mermaid
sequenceDiagram
    participant User
    participant Frontend as React App (App.jsx)
    participant SpeechRec as Web Speech Recognition API
    participant SpeechSyn as Web Speech Synthesis API

    User->>Frontend: Taps Voice Orb
    Frontend->>SpeechRec: start()
    SpeechRec-->>User: Listening audio cue
    User->>SpeechRec: Speaks "Where am I?"
    SpeechRec-->>Frontend: Returns transcript "Where am I?"
    Frontend->>Frontend: Process command (matches LOCATION intent)
    Frontend->>SpeechSyn: speak("Opening your current location.")
    SpeechSyn-->>User: Spoken voice audio
    Frontend->>Frontend: setPage("location")
```

### 6.2 Emergency SOS Trigger & Contact Dispatch Flow
```mermaid
sequenceDiagram
    participant User
    participant App as React App (EmergencyPage)
    participant Geo as Geolocation API
    participant Device as Phone Subsystem / Clipboard

    User->>App: Taps SOS Button
    App->>App: Transition state to 'activating'
    App->>Geo: getCurrentPosition()
    Geo-->>App: Return coordinates (Lat, Lng)
    App->>App: Transition state to 'active'
    App->>Device: Speak "Emergency mode activated."
    
    par Call Dispatch
        User->>App: Taps "Call Primary Contact"
        App->>Device: Triggers tel:+919876543210
    and Location Sharing
        User->>App: Taps "Copy Location to Share"
        App->>Device: Writes SOS message + Google Maps link to Clipboard
    end
```

### 6.3 Multimodal AI Vision Flow (OCR / Scene Description)
```mermaid
sequenceDiagram
    participant User
    participant App as React App (VisionPage / OCRPage)
    participant Camera as Device Camera / File System
    participant Claude as Anthropic Claude API (claude-sonnet-4-6)
    participant TTS as Web Speech Synthesis

    User->>App: Selects mode (e.g. Safety Check) & captures image
    App->>Camera: Reads binary photo
    Camera-->>App: Base64 Data URL
    App->>Claude: POST /v1/messages (Base64 Image + Safety System Prompt)
    Claude-->>App: Returns detailed text response (hazards, safe paths)
    App->>App: Renders response text in UI card
    App->>TTS: speak(AI Analysis Output)
    TTS-->>User: Reads scene description aloud
```

---

## 7. Progressive Web App (PWA) Configuration

Smart Minds meets all PWA installation requirements:

1. **Manifest File ([`client/public/manifest.json`](file:///c:/Users/Admin/Downloads/smart-minds/smart-minds/client/public/manifest.json)):**
   - Application Name: `Smart Minds` (Short Name: `SmartMinds`)
   - Start URL: `/`
   - Display Mode: `standalone`
   - Background Color: `#0d1117`, Theme Color: `#00b894`
   - Orientation: `portrait-primary`
   - SVG Maskable Icon embedded via Data URI.
   - App Shortcuts: Direct URL links to `Emergency SOS`, `Voice Assistant`, and `My Location`.

2. **Service Worker Script ([`client/public/sw.js`](file:///c:/Users/Admin/Downloads/smart-minds/smart-minds/client/public/sw.js)):**
   - Cache Name: `smart-minds-v1`
   - Static Asset Caching: Pre-caches `/`, `/index.html`, `/manifest.json` on installation (`install` event).
   - Activation Cleanup: Purges stale cache keys on `activate` event.
   - Fetch Interception Strategy:
     - API requests (`/api/`) are explicitly excluded from caching to prevent stale data.
     - Navigation requests (`navigate` mode) use a **Network-First with Cache Fallback** strategy to support offline rendering of `index.html`.
     - Static assets use a **Cache-First** strategy.

---

## 8. Technical Architecture & Solved API Integration

During analysis and testing of the codebase, the AI integration architecture was optimized for security and browser compatibility:

1. **Secure Backend API Proxying (CORS Resolved):**
   - *Initial State:* In [`App.jsx`](file:///c:/Users/Admin/Downloads/smart-minds/smart-minds/client/src/App.jsx), AI features (`AIAssistantPage`, `OCRPage`, `VisionPage`) attempted direct `fetch` calls to `https://api.anthropic.com/v1/messages`. Browsers blocked these requests due to CORS policies.
   - *Resolution Implemented:* The frontend calls were refactored to route through the Express backend endpoints (`/api/ai/chat`, `/api/ai/read-text`, `/api/ai/describe`). The Node.js server securely executes requests using `@anthropic-ai/sdk` and `claude-3-5-sonnet-latest`, eliminating CORS errors and preventing client-side API key leakage.

2. **Client-Side Auth State vs Backend Authentication:**
   - *Finding:* The `AuthPage` in `App.jsx` performs local client-side validation and sets `authed = true` for instant presentation demo access without requiring password entry.
   - *Backend Readiness:* The backend server contains bcrypt password hashing and 7-day JWT token issuance (`/api/auth/login` and `/api/auth/register`) ready for persistent multi-tenant deployments.

3. **Monolithic Code Placement vs Scaffolded Directories:**
   - *Finding:* Frontend components are consolidated in `App.jsx` and server logic in `server.js` for rapid execution, while subdirectories (`components/`, `controllers/`, etc.) provide scaffolding for future modular refactoring.

---

## 9. Environment Setup & Execution Guide

### 9.1 Prerequisites
- **Node.js:** v18.x or v20.x LTS installed.
- **Browser:** Google Chrome (recommended for full Web Speech API recognition support).

### 9.2 Step-by-Step Installation

```bash
# 1. Clone or extract the project directory
cd c:\Users\Admin\Downloads\smart-minds\smart-minds

# 2. Install all dependencies across root, client, and server
npm run install-all
```

### 9.3 Environment Configuration
Create a file named `.env` inside the `server/` directory (copied from [`server/.env.example`](file:///c:/Users/Admin/Downloads/smart-minds/smart-minds/server/.env.example)):

```env
MONGODB_URI=mongodb+srv://smartminds:YOUR_PASSWORD@cluster0.mongodb.net/smartminds
JWT_SECRET=smartminds_super_secret_key_2024_be_cs_major_project
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
ANTHROPIC_API_KEY=sk-ant-api03-YOUR_ACTUAL_KEY_HERE
```

### 9.4 Running the Application

To launch both frontend (Vite) and backend (Express) concurrently:

```bash
npm run dev
```

- **Frontend Client:** Accessible at `http://localhost:5173`
- **Backend API:** Running at `http://localhost:5000`

---

## 10. Major Project Presentation & Demo Guide

For project evaluators and college presentations:

1. Launch the application via `npm run dev` and open Chrome to `http://localhost:5173`.
2. Click **"Try Demo Mode"** on the Auth screen to bypass login instantly.
3. **Voice Assistant Demo:** Tap the Voice Orb and say *"Where am I?"* or *"Read text"*.
4. **Emergency SOS Demo:** Open Emergency mode to demonstrate the 190px pulsing SOS button, automated GPS capture, `tel:` calling, and clipboard location sharing.
5. **AI Vision & OCR Demo:** Upload any prescription, document, or sign photo to demonstrate live Claude text extraction and spoken readout.
6. **Accessibility Demo:** Toggle High Contrast mode, Large Text, and Speech Rate sliders in Settings to showcase WCAG 2.1 AA compliance.
