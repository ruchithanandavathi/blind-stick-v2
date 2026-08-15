# 🧠 Smart Minds
## AI-Powered Assistive Platform for Visually Impaired People

> A voice-first, accessibility-focused web application that helps visually impaired users
> navigate, communicate, and stay safe — powered by Claude AI.

**Final Year BE Computer Science Major Project**

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎙️ Voice Assistant | 20+ voice commands — navigate, locate, call, ask AI |
| 📍 My Location | Real GPS with voice readout and accuracy display |
| 🗺️ Navigation | Turn-by-turn voice navigation (demo + Maps API ready) |
| 🆘 Emergency SOS | One-tap SOS, GPS share, direct contact call |
| 🤖 AI Assistant | Full Claude AI chat — ask anything, spoken responses |
| 📖 Read Text (OCR) | Photo/upload → AI reads all text aloud |
| 👁️ Scene Vision AI | 5 modes: describe scene, objects, safety, people, signs |
| 📌 Saved Places | Home, College, Hospital + unlimited custom places |
| 👥 Trusted Contacts | Emergency contact management with one-tap calling |
| 📋 Activity History | Full log with privacy controls and clear option |
| 👤 User Profile | Name, language, preferences |
| ⚙️ Accessibility | High contrast, large text, speech rate, reduced motion |

---

## 🛠️ Technology Stack

- **Frontend:** React.js, Vite, HTML5, CSS3, Web Speech API, Geolocation API
- **Backend:** Node.js, Express.js, JWT Authentication, bcrypt
- **Database:** MongoDB Atlas, Mongoose ODM
- **AI:** Anthropic Claude API (claude-sonnet-4-6)
- **PWA:** manifest.json, Service Worker, offline support

---

## ⚡ Quick Start

```bash
# 1. Install everything
npm run install-all

# 2. Create server/.env (copy from server/.env.example and fill values)

# 3. Run both frontend + backend together
npm run dev
```

Open Chrome → http://localhost:5173

---

## 📖 Full Setup Guide

See **SETUP.md** for complete step-by-step instructions including:
- Installing Node.js
- MongoDB Atlas free account setup
- Getting Anthropic API key
- Running the project in VS Code

---

## 🔑 Environment Variables

Create `server/.env` (copy from `server/.env.example`):

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/smartminds
JWT_SECRET=your_long_random_secret_here
PORT=5000
CLIENT_URL=http://localhost:5173
ANTHROPIC_API_KEY=sk-ant-...
```

---

## 📡 API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/contacts
POST   /api/contacts
PUT    /api/contacts/:id
DELETE /api/contacts/:id

GET    /api/places
POST   /api/places
PUT    /api/places/:id
DELETE /api/places/:id

POST   /api/location/log
POST   /api/emergency
GET    /api/emergency/history

POST   /api/ai/chat
POST   /api/ai/read-text
POST   /api/ai/describe

GET    /api/settings
PUT    /api/settings
GET    /api/activity
DELETE /api/activity
```

---

## ♿ Accessibility

- WCAG 2.1 AA compliant design
- All touch targets minimum 56×56px
- Skip navigation link
- ARIA labels on all interactive elements
- `aria-live` regions for dynamic content
- Semantic HTML throughout
- Full keyboard navigation
- Screen reader compatible
- High contrast mode
- Large text mode, reduced motion mode
- Voice feedback for every important action
- No colour-only communication

---

## 🌐 Supported Browsers

| Browser | Voice | TTS | GPS |
|---|---|---|---|
| Chrome (Android) | ✅ | ✅ | ✅ |
| Chrome (Desktop) | ✅ | ✅ | ✅ |
| Safari (iOS 16+) | ✅ | ✅ | ✅ |
| Firefox | ❌ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ |

> **Recommended: Chrome on Android for full experience**

---

## 🚀 Deployment

**Frontend → Vercel**
```bash
cd client && npm run build
# Connect to Vercel, deploy dist/ folder
# Set VITE_API_URL environment variable to your backend URL
```

**Backend → Render**
- Root directory: `server`
- Build: `npm install`
- Start: `npm start`
- Add all .env variables in Render dashboard

**Database → MongoDB Atlas** (already cloud-hosted)

---

## 🔮 Future Scope

1. React Native / Android conversion
2. WhatsApp SOS integration
3. Real-time bus/transport tracking
4. Braille display support (WebBluetooth)
5. Fall detection via phone sensors
6. Offline navigation (downloaded maps)
7. Family monitoring dashboard
8. Multi-user mode
9. Audio compass with directional cues
10. ATM, pharmacy, hospital finder

---

## ⚠️ Limitations

- Speech Recognition requires Chrome browser
- GPS accuracy depends on device hardware
- Navigation uses demo steps — real directions need Google Maps API key
- AI features need Anthropic API key and internet
- Camera requires HTTPS (works on localhost)

---

## 📜 Disclaimer

Smart Minds does not claim to provide 100% safety.
It is an assistive platform designed to enhance independence,
not replace human assistance or emergency services.

---

*Built with ❤️ for accessibility. Final Year BE CS Major Project.*
