# Run both frontend and backend together
# Run both frontend and backend together
# Run both frontend and backend together
# Run both frontend and backend together
# Run both frontend and backend together
# 🧠 Smart Minds — Step-by-Step Setup Guide

Follow these steps exactly. Each step must be completed before the next.

---

## ✅ STEP 1 — Install Required Software

### Install Node.js
1. Go to → https://nodejs.org
2. Click the **LTS** (green) button to download
3. Open the installer → click Next → Next → Install
4. Restart your computer after installing

### Install VS Code
1. Go to → https://code.visualstudio.com
2. Download and install it

---

## ✅ STEP 2 — Open the Project in VS Code

1. Extract (unzip) the `smart-minds.zip` file to your Desktop
2. Open VS Code
3. Click **File → Open Folder**
4. Select the `smart-minds` folder
5. Click **Open**

---

## ✅ STEP 3 — Open the Terminal in VS Code

Press **Ctrl + `** (the backtick key, top-left of keyboard)
A terminal opens at the bottom of VS Code.

Verify Node.js is installed by typing:
```
node --version
```
You should see: `v20.x.x` or similar ✅

---

## ✅ STEP 4 — Create Your Environment File

In the terminal, type:
```
cd server
```
Then:
```
copy .env.example .env
```
(On Mac/Linux use: `cp .env.example .env`)

Now in VS Code's left sidebar:
- Click `server` folder → click `.env` to open it
- You will fill in the values in Steps 5 and 6

---

## ✅ STEP 5 — Get MongoDB Atlas Connection String

1. Go to → https://cloud.mongodb.com
2. Click **"Try Free"** and create a free account
3. After logging in, click **"Create"** (choose M0 Free tier)
4. Select **AWS** → **Mumbai** region → click **Create Deployment**
5. **Create Database User popup appears:**
   - Username: `smartminds`
   - Click **"Autogenerate Secure Password"**
   - ⚠️ Copy and save this password somewhere safe!
   - Click **"Create Database User"**
6. Click **"Choose a connection method"** → click **"Drivers"**
7. Copy the connection string (looks like):
   ```
   mongodb+srv://smartminds:<password>@cluster0.xxxxx.mongodb.net/
   ```
8. Replace `<password>` with your actual password
9. Add `smartminds` at the end:
   ```
   mongodb+srv://smartminds:YOURPASSWORD@cluster0.xxxxx.mongodb.net/smartminds
   ```
10. Paste this as `MONGODB_URI=` in your `server/.env` file

### Allow Network Access:
- Left sidebar on Atlas → **Network Access** → **Add IP Address**
- Click **"Allow Access from Anywhere"** → **Confirm**

---

## ✅ STEP 6 — Get Anthropic API Key (for AI features)

1. Go to → https://console.anthropic.com
2. Sign up / Log in
3. Click **"API Keys"** in the left menu
4. Click **"Create Key"** → give it a name like `smart-minds`
5. Copy the key (starts with `sk-ant-`)
6. Paste it as `ANTHROPIC_API_KEY=` in your `server/.env` file

### Your server/.env should now look like:
```
MONGODB_URI=mongodb+srv://smartminds:YOURPASSWORD@cluster0.abc.mongodb.net/smartminds
JWT_SECRET=smartminds_super_secret_key_2024_please_change_this
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
ANTHROPIC_API_KEY=sk-ant-api03-YOUR_ACTUAL_KEY_HERE
```

---

## ✅ STEP 7 — Install All Dependencies

In VS Code terminal, make sure you are in the `smart-minds` folder.
Check by typing `pwd` — it should show the path ending in `smart-minds`.

If you're inside the `server` folder, go back:
```
cd ..
```

Now run:
```
npm run install-all
```

This automatically installs packages for root, client, and server.
Wait 2-4 minutes. You'll see lots of text — that's normal ✅

---

## ✅ STEP 8 — Run the Project

In the terminal (make sure you're in the `smart-minds` root folder):
```
npm run dev
```

You should see:
```
[server] ✅ MongoDB connected
[server] 🚀 Running at http://localhost:5000
[client] VITE ready → http://localhost:5173
```

---

## ✅ STEP 9 — Open in Browser

Open **Google Chrome** (recommended) and go to:
```
http://localhost:5173
```

The Smart Minds app will load! 🎉

Click **"Try Demo Mode"** to explore without creating an account.

---

## ❓ Troubleshooting

| Problem | Solution |
|---|---|
| `node is not recognized` | Restart VS Code after installing Node.js |
| `npm run install-all` fails | Try: `cd client && npm install` then `cd ../server && npm install` |
| MongoDB connection error | Check your MONGODB_URI in `.env` — password might need URL encoding |
| White screen | Press F12 in Chrome → Console tab → share the error |
| AI not working | Check `ANTHROPIC_API_KEY` in `server/.env` has no spaces |
| Port 5000 in use | Change `PORT=5001` in `server/.env` |
| Speech not working | Must use **Chrome** browser, not Firefox or Edge |
| Camera not working | App must be on `https://` or `localhost` |

---

## 🎓 For College Presentation

1. Run `npm run dev` in VS Code
2. Open Chrome → `http://localhost:5173`
3. Click **"Try Demo Mode"** (no account needed)
4. Show each feature to your audience

The demo mode has pre-loaded sample contacts, places, and history.
All AI features are live (need internet + Anthropic API key).
Voice commands need Chrome browser.

---

## 📁 Project Folder Structure

```
smart-minds/
├── client/               ← React frontend (what users see)
│   ├── public/
│   │   ├── manifest.json ← PWA configuration
│   │   └── sw.js         ← Service Worker (offline support)
│   ├── src/
│   │   ├── App.jsx       ← ALL frontend code (13 pages)
│   │   └── main.jsx      ← React entry point
│   ├── index.html        ← HTML template
│   ├── package.json      ← Frontend dependencies
│   └── vite.config.js    ← Build configuration
│
├── server/               ← Node.js backend (API + database)
│   ├── server.js         ← ALL backend code
│   ├── .env              ← Your secret keys (create this!)
│   ├── .env.example      ← Template for .env
│   └── package.json      ← Backend dependencies
│
├── package.json          ← Root (runs both together)
├── SETUP.md              ← This file
├── README.md             ← Full documentation
└── .gitignore            ← Files to not commit to Git
```
